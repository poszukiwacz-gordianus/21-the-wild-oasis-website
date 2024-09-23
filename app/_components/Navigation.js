import Link from "next/link";
import Image from "next/image";
import { auth } from "../_lib/auth";
import GuestAreaButton from "./GuestAreaButton";

export default async function Navigation() {
  const session = await auth();
  return (
    <nav className="z-10">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          {session?.user?.image ? (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex items-center gap-4"
            >
              <div className=" relative h-8 w-8">
                <Image
                  className="rounded-full"
                  fill
                  src={session.user.image}
                  alt={session.user.name}
                  referrerPolicy="no-referrer"
                />
              </div>
              <span>Guest area</span>
            </Link>
          ) : (
            <GuestAreaButton />
          )}
        </li>
      </ul>
    </nav>
  );
}
