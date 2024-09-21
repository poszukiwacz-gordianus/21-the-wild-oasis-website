import UpdateReservationForm from "@/app/_components/UpdateReservationForm";
import { getBooking, getCabin, getSettings } from "@/app/_lib/data-service";

export const metadata = {
  title: "Update Reservation",
};

export default async function Page({ params: { bookingId } }) {
  const { cabinId, numGuests, observations, hasBreakfast } = await getBooking(
    Number(bookingId)
  );
  const { maxCapacity } = await getCabin(cabinId);
  const { breakfastPrice } = await getSettings();

  return (
    <div>
      <h2 className="font-semibold text-xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <UpdateReservationForm
        updateInformations={{
          cabinId,
          numGuests,
          observations,
          maxCapacity,
          bookingId,
          hasBreakfast,
          breakfastPrice,
        }}
      />
    </div>
  );
}
