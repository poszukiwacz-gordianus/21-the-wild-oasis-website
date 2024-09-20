"use client";

import { useTransition } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

import SpinnerMini from "./SpinnerMini";
import toast from "react-hot-toast";

function DeleteReservation({ bookingId, onDelete }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        toast((t) => (
          <div className=" px-4 py-3 flex justify-center content-center flex-grow text-primary-100  transition-colors">
            <p className=" text-lg">
              Are you sure you want to{" "}
              <b className=" text-accent-500">delete</b> this reservation?
            </p>
            <button
              className=" mt-2 h-10 w-36 flex justify-center content-center"
              onClick={() => {
                toast.dismiss(t.id);

                startTransition(() => onDelete(bookingId));
                toast.success("Reservation deleted successfully");
              }}
            >
              <TrashIcon className=" h-10 transition-colors text-primary-600 hover:text-accent-500" />
            </button>
          </div>
        ))
      }
      disabled={isPending}
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
    >
      {isPending ? (
        <span className=" mx-auto">
          <SpinnerMini />
        </span>
      ) : (
        <>
          <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
          <span className="mt-1">Delete</span>
        </>
      )}
    </button>
  );
}

export default DeleteReservation;
