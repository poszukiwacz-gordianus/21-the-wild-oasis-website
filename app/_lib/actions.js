"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import {
  getBookedDatesByCabinId,
  getBooking,
  getBookings,
  getSettings,
} from "./data-service";
import { redirect } from "next/navigation";
import { isWithinInterval } from "date-fns";

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
  //Check on server side if dates are already booked
  function isAlreadyBooked(from, to, datesArr) {
    return (
      from &&
      to &&
      datesArr.some((date) => isWithinInterval(date, { start: from, end: to }))
    );
  }

  const bookedDates = await getBookedDatesByCabinId(bookingData.cabinId);

  if (isAlreadyBooked(bookingData.startDate, bookingData.endDate, bookedDates))
    return { error: "Dates are already booked!" };

  const session = await auth();
  if (!session) throw new Error("You must be logged in");

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

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) return { error: "Booking could not be created" };

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));
  const { hasBreakfast, totalPrice, extrasPrice, numNights } = await getBooking(
    bookingId
  );
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

  if (formData.get("updateBreakfast") === "true" && !hasBreakfast) {
    extraPrice = breakfastPrice * Number(formData.get("numGuests")) * numNights;

    updateData = {
      ...updateData,
      extrasPrice: extraPrice,
      totalPrice: totalPrice + extraPrice,
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

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) return { error: "Booking could not be deleted" };

  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
