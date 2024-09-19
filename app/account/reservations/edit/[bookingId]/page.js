import SubmitButton from "@/app/_components/SubmitButton";
import { updateBooking } from "@/app/_lib/actions";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export const metadata = {
  title: "Update Reservation",
};

export default async function Page({ params: { bookingId } }) {
  const { cabinId, numGuests, observations } = await getBooking(
    Number(bookingId)
  );
  const { maxCapacity } = await getCabin(cabinId);

  return (
    <div>
      <h2 className="font-semibold text-xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <form
        action={updateBooking}
        className="bg-primary-900 py-6 px-10 flex gap-6 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            defaultValue={numGuests}
            className="px-4 py-2 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            defaultValue={observations}
            className="px-4 py-2 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>

        <input type="hidden" name="bookingId" defaultValue={bookingId} />
        <input type="hidden" name="cabinId" defaultValue={cabinId} />

        <div className="flex justify-end items-center gap-6">
          <SubmitButton pendingLabel="Updating...">
            Update reservation
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
