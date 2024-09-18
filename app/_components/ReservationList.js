"use client";

import { useOptimistic } from "react";

import ReservationCard from "@/app/_components/ReservationCard";

import { deleteBooking } from "../_lib/actions";

function ReservationList({ bookings }) {
  //Two types of state: Actual state and Optimistic state
  //First argument current state, second argument an update function
  //Return optimistic state and setter function
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    //Takes current state and whatever we pass to setter function
    (currentBookings, bookingId) => {
      //Return optimistic state
      return currentBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
