"use client";
import Link from "next/link";
import { deleteCookieAction } from "../_lib/actions";

export default function GuestAreaButton() {
  return (
    <Link
      onClick={async () => deleteCookieAction()}
      href="/account"
      className="hover:text-accent-400 transition-colors"
    >
      Guest area
    </Link>
  );
}
