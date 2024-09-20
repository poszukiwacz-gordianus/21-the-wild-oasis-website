"use client";

import Image from "next/image";
import { useReservation } from "./ReservationContext";
import { differenceInDays } from "date-fns";
import { createBooking } from "../_lib/actions";
import SubmitButton from "./SubmitButton";
import toast from "react-hot-toast";

function ReservationForm({ cabin, user, settings: { breakfastPrice } }) {
  const { range, resetRange, setBreakfastPrice, setGuestsNumber } =
    useReservation();

  const { maxCapacity, regularPrice, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
    hasBreakfast: breakfastPrice,
  };

  //We use bind to set additional data
  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        {
          <div className="flex gap-4 items-center">
            <Image
              // Important to display google profile images
              referrerPolicy="no-referrer"
              className="h-8 rounded-full"
              width={38}
              height={0}
              src={user.image}
              alt={user.name}
            />
            <p>{user.name}</p>
          </div>
        }
      </div>

      <form
        // action={createBookingWithData}
        action={async (formData) => {
          const isError = await createBookingWithData(formData);
          if (isError) toast.error(isError.error);
          else resetRange();
        }}
        className="bg-primary-900 py-5 px-16 flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            onChange={(e) => setGuestsNumber(Number(e.target.value))}
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
          <label htmlFor="hasBreakfast">
            Would you like to add a breakfast package to your reservation for $
            {breakfastPrice} per person per day?
          </label>
          <select
            name="hasBreakfast"
            id="hasBreakfast"
            onChange={(e) =>
              setBreakfastPrice(e.target.value === "true" ? breakfastPrice : 0)
            }
            className="px-4 py-2 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            defaultValue={false}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-4 py-2 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-lg px-8 py-4">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
