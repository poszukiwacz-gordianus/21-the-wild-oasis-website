import ReservationUpdateForm from "@/app/_components/ReservationUpdateForm";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export const metadata = {
  title: "Update Reservation",
};

export default async function Page({ params: { reservationId } }) {
  const booking = await getBooking(Number(reservationId));
  const { maxCapacity } = await getCabin(booking.cabinId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{reservationId}
      </h2>

      <ReservationUpdateForm
        bookingId={reservationId}
        maxCapacity={maxCapacity}
        booking={booking}
      />
    </div>
  );
}
