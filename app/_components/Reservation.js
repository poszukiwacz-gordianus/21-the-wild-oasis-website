import { auth } from "../_lib/auth";

import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import LoginMessage from "./LoginMessage";

import {
  getBookedDatesByCabinId,
  getBookedDatesByUserId,
  getSettings,
} from "../_lib/data-service";

async function Reservation({ cabin }) {
  const session = await auth();

  const [settings, bookedDatesAll, bookedDatesByGuest = []] = await Promise.all(
    [
      getSettings(),
      getBookedDatesByCabinId(Number(cabin.id)),
      session?.user?.guestId &&
        getBookedDatesByUserId(Number(session?.user?.guestId)),
    ]
  );

  const bookedDates = [...bookedDatesAll, ...bookedDatesByGuest];

  return (
    <div className=" grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm
          cabin={cabin}
          user={session.user}
          settings={settings}
          bookedDates={bookedDates}
        />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Reservation;
