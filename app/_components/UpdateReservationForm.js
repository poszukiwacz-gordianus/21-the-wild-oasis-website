"use client";

import toast from "react-hot-toast";
import SubmitButton from "@/app/_components/SubmitButton";
import { updateBooking } from "@/app/_lib/actions";

function UpdateReservationForm({
  updateInformations: {
    cabinId,
    numGuests,
    observations,
    maxCapacity,
    bookingId,
    hasBreakfast,
    breakfastPrice,
  },
}) {
  return (
    <form
      action={async (formData) => {
        const isError = await updateBooking(formData);
        if (isError) toast.error(isError.error);
        else toast.success("Reservation updated successfully");
      }}
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
        <label htmlFor="updateBreakfast">
          {hasBreakfast
            ? "Do you want to remove breakfast from your reservation?"
            : `Do you want to add breakfast for $${breakfastPrice} per person per night, to your reservation?`}
        </label>
        <select
          name="updateBreakfast"
          id="updateBreakfast"
          defaultValue={"false"}
          className="px-4 py-2 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
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
  );
}

export default UpdateReservationForm;
