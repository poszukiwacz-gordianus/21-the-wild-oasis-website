import { differenceInDays, format, isPast, isToday } from "date-fns";
import { auth } from "../_lib/auth";
import { getClosestBooking, getCurrentBooking } from "../_lib/data-service";
import { formatDistanceFromNow } from "../_components/ReservationCard";

export const metadata = {
  title: "Gest area",
};

export default async function Page() {
  const session = await auth();
  const firstName = session.user.name.split(" ").at(0);
  const currentBooking = await getCurrentBooking(session.user.guestId);
  const booking = await getClosestBooking(session.user.guestId);

  //Calculate nights left
  const endDate = new Date(currentBooking?.endDate); // Date object for end date
  const today = new Date(); // Create a new Date object for today

  // Set both dates to midnight UTC
  endDate.setUTCHours(0, 0, 0, 0);
  today.setUTCHours(0, 0, 0, 0);

  // Calculate nights left
  const nightsLeft = differenceInDays(endDate, today);

  const adjustedNightsLeft = nightsLeft < 0 ? 0 : nightsLeft + 1;

  return (
    <div>
      <h2 className="font-semibold text-xl text-accent-400 mb-7">
        Welcome, {firstName}
      </h2>

      {!currentBooking && booking && (
        <p className="border border-primary-800 px-8 py-6 mb-5">
          Hello! We&apos;re excited for you to stay at the cabin.
          <br />
          Your reservation is for{" "}
          {format(new Date(booking?.startDate), "EEE, MMM dd yyyy")}, which is
          only {formatDistanceFromNow(booking?.startDate)} away.
        </p>
      )}
      {currentBooking?.status === "checked-in" && (
        <>
          {isToday(new Date(currentBooking?.endDate)) ? (
            <p className="border border-primary-800 px-8 py-6 mb-5">
              Your stay at the cabin is coming to an end. Please be sure to
              check out before 12PM. We hope you enjoyed your stay and made lots
              of happy memories!
            </p>
          ) : (
            <p className="flex border border-primary-800 px-8 py-6 mb-5">
              You have {adjustedNightsLeft} night{adjustedNightsLeft > 1 && "s"}{" "}
              before you. Enjoy your stay!
            </p>
          )}

          <div className="border border-primary-800 px-8 py-6">
            <p className="mb-4">
              You are currently staying at cabin {currentBooking?.cabins?.name}
            </p>
            <p className="mb-4">
              Check-In Day: You{" "}
              {currentBooking?.numGuests >= 3
                ? "and your friends"
                : currentBooking?.numGuests === 2
                ? "and your friend"
                : ""}{" "}
              arrived at the cabin on{" "}
              {format(new Date(currentBooking?.startDate), "EEE, MMM dd yyyy")}
            </p>
            <p>
              Check-Out Day: Your stay will end on{" "}
              {format(new Date(currentBooking?.endDate), "EEE, MMM dd yyyy")}
            </p>
          </div>
        </>
      )}
      {currentBooking?.status === "unconfirmed" && (
        <p className="border border-primary-800 px-8 py-6">
          {isToday(new Date(booking?.startDate))
            ? `We're waiting for your todays arrival. You can check-in from 6PM
          to 11PM`
            : isPast(new Date(booking?.startDate)) &&
              `Hello, we hope everything is okay. We noticed that you have not checked in to the cabin and the check-in date has passed. If you need to cancel your reservation, please contact us at +56 876 34 23 or email us at thewildoasis@email.com. We look forward to hearing from you.`}
        </p>
      )}
      {currentBooking?.status === "checked-out" && (
        <p className="border border-primary-800 px-8 py-6">
          Thank you for staying with us! We hope you enjoyed your time at the
          cabin and made lots of happy memories. We look forward to welcoming
          you back for your next visit! 😊
        </p>
      )}
    </div>
  );
}
