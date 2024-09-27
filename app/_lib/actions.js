"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import {
  getBookedDatesByCabinId,
  getBooking,
  getBookings,
  getGuest,
  getSettings,
} from "./data-service";
import { redirect } from "next/navigation";
import { isWithinInterval } from "date-fns";
import { cookies } from "next/headers";
import { convertDateToLocale } from "./helpers";

/////////////
// CREATE

export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from("guests")
    .insert([newGuest])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  await createLog(
    "New Registration",
    `${data[0].fullName} has successfully registered.`
  );

  return data;
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    return {
      error: "Profile could not be updated",
      validationFail: "Please provide a valid national ID",
    };

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) return { error: "Profile could not be updated" };

  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //Check if user have already more than two active reservations

  const userBookings = await getBookings(session.user.guestId);

  if (userBookings.length === 2)
    return {
      error:
        "You have already reached the limit of two active reservations. Please cancel one of your existing reservations to book a new one.",
    };

  //Check on server side if dates are already booked
  function isAlreadyBooked(from, to, datesArr) {
    return (
      from &&
      to &&
      datesArr.some((date) => isWithinInterval(date, { start: from, end: to }))
    );
  }

  const bookedDates = await getBookedDatesByCabinId(bookingData.cabinId);

  if (
    isAlreadyBooked(bookingData.startDate, bookingData.endDate, bookedDates)
  ) {
    revalidatePath(`/cabins/${bookingData.cabinId}`);
    return {
      error:
        "Oops, looks like someone else beat you to it! These dates are already reserved. Why not try a different date?",
    };
  }

  //If we have huge object we can do
  //Object.entries(formData.entries())
  //to create object

  //we can validate data using zod library
  const breakfast = formData.get("hasBreakfast") === "true" ? true : false;
  const extraPrice = breakfast
    ? bookingData.hasBreakfast *
      Number(formData.get("numGuests")) *
      bookingData.numNights
    : 0;

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: extraPrice,
    totalPrice: bookingData.cabinPrice + extraPrice,
    isPaid: false,
    hasBreakfast: breakfast,
    status: "unconfirmed",
  };

  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select(
      "startDate, endDate, numNights, numGuests, totalPrice, cabinId(name), guestId(fullName)"
    );

  if (error) return { error: "Booking could not be created" };

  // Create log
  await createLog(
    "New booking",
    `${data[0].guestId.fullName} has booked Cabin ${data[0].cabinId.name} for ${
      data[0].numGuests
    } guest${data[0].numGuests > 1 ? "s" : ""}, from ${convertDateToLocale(
      data[0].startDate.slice(0, 10)
    )} to
    ${convertDateToLocale(data[0].endDate.slice(0, 10))} (${
      data[0].numNights
    } nights). Total Price: €${data[0].totalPrice}.`
  );

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));
  const { hasBreakfast, totalPrice, extrasPrice, numNights, numGuests } =
    await getBooking(bookingId);
  const { breakfastPrice } = await getSettings();

  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this reservation");

  // 5) Building update data

  let extraPrice = extrasPrice;
  let updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    hasBreakfast:
      formData.get("updateBreakfast") === "true" ? !hasBreakfast : hasBreakfast,
  };

  if (
    (formData.get("updateBreakfast") === "true" && !hasBreakfast) ||
    (numGuests !== Number(formData.get("numGuests")) && hasBreakfast)
  ) {
    extraPrice = breakfastPrice * Number(formData.get("numGuests")) * numNights;

    updateData = {
      ...updateData,
      extrasPrice: extraPrice,
      totalPrice: totalPrice - extrasPrice + extraPrice,
    };
  }

  if (formData.get("updateBreakfast") === "true" && hasBreakfast) {
    updateData = {
      ...updateData,
      extrasPrice: 0,
      totalPrice: totalPrice - extrasPrice,
    };
  }

  // 4) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // 5) Error handling
  if (error) {
    console.error(error);
    return { error: "Booking could not be updated" };
  }

  // 6) Revalidate cache
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  // 7) Redirecting
  redirect("/account/reservations");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  const deletedBooking = guestBookings.find(
    (booking) => booking.id === bookingId
  );
  const guest = await getGuest(session.user.email);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  // Create log
  await createLog(
    "Reservation Canceled",
    `The reservation #${deletedBooking.id} by ${guest.fullName} for cabin ${
      deletedBooking.cabins.name
    } originally scheduled from ${convertDateToLocale(
      deletedBooking.startDate.slice(0, 10)
    )} to ${convertDateToLocale(
      deletedBooking.endDate.slice(0, 10)
    )}, has been canceled.`
  );

  //Delete Log if is with this id, needed to delete booking
  await deleteLog(bookingId);

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) return { error: "Booking could not be deleted" };

  revalidatePath("/account/reservations");
}

export async function signInAction() {
  const cookieValue = cookies().get("currentPathname")?.value || "/account";
  await deleteCookieAction();

  await signIn("google", { redirectTo: cookieValue });
}

export async function signOutAction() {
  await deleteCookieAction();

  await signOut({ redirectTo: "/" });
}

export async function deleteCookieAction() {
  const cookieStore = cookies();
  cookieStore.delete("currentPathname");
}

//////////////////
// CREATE LOG

export async function createLog(action, description) {
  const { error } = await supabase
    .from("logs")
    .insert([{ action, description }]);
  if (error) {
    console.error(error.message);
    throw new Error("Error");
  }
}

//////////////
// DELETE LOG
export async function deleteLog(id) {
  await supabase.from("logs").delete().eq("bookingId", id);
}
