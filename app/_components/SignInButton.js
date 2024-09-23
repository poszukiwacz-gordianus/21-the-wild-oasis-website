"use client";

import Image from "next/image";
import { signInAction } from "../_lib/actions";
import { useReservation } from "./ReservationContext";

function SignInButton() {
  const { range } = useReservation();
  console.log(range);
  localStorage.setItem("dateRange", JSON.stringify(range));
  return (
    <form action={signInAction}>
      <button className="flex items-center gap-6 text-base border border-primary-300 px-10 py-4 font-medium">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
