"use client";

import toast from "react-hot-toast";
import { useState } from "react";

import SubmitButton from "./SubmitButton";
import { updateGuest } from "../_lib/actions";

function UpdateProfileForm({ guest, children }) {
  const [error, setError] = useState("");
  const { fullName, email, nationalID, countryFlag } = guest;

  async function handleActionUpdate(formData) {
    const isError = await updateGuest(formData);
    if (isError?.validationFail) setError(isError.validationFail);
    if (isError) toast.error(isError.error);
    else {
      toast.success("Profile updated successfully");
      setError("");
    }
  }

  return (
    <form
      action={handleActionUpdate}
      className="bg-primary-900 py-8 px-12 flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>Full name</label>
        <input
          disabled
          defaultValue={fullName}
          name="fullName"
          className="px-4 py-2 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>
      <div className="space-y-2">
        <label>Email address</label>
        <input
          disabled
          defaultValue={email}
          name="email"
          className="px-4 py-2 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          {countryFlag && (
            <img
              src={countryFlag}
              alt="Country flag"
              className="h-5 rounded-sm"
            />
          )}
        </div>

        {children}
      </div>
      <div className="space-y-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          defaultValue={nationalID}
          name="nationalID"
          className="px-4 py-2 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-between items-center gap-6">
        {error ? <p className="text-red-500 text-base">{error}</p> : <p></p>}
        <SubmitButton pendingLabel="Updating...">Update profile</SubmitButton>
      </div>
    </form>
  );
}

export default UpdateProfileForm;
