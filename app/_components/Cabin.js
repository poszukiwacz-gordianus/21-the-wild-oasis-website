"use client";

import Image from "next/image";
import Link from "next/link";
import { setCookie } from "cookies-next";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeSlashIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import TextExpander from "./TextExpander";

function Cabin({
  cabin: { id, name, image, description, maxCapacity },
  cabins,
  session,
}) {
  // Set cookie if user is not login
  if (!session?.user)
    setCookie(`currentPathname`, `/cabins/${id}`, {
      path: "/",
      maxAge: "86400",
    });

  // Navigation previus cabin, next cabin
  const index = cabins.findIndex((cabin) => cabin.id === id);

  let next = cabins[index + 1]?.id;
  if (!next) next = cabins[0].id;

  let prev = cabins[index - 1]?.id;
  if (!prev) prev = cabins[cabins.length - 1].id;

  return (
    <div className="flex">
      <div className="flex justify-center items-center">
        <Link
          href={`/cabins/${prev}`}
          className="h-24 w-24  hover:text-accent-500"
        >
          <ChevronLeftIcon />
        </Link>
      </div>

      <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-10 mb-24">
        <div className="relative scale-[1.15] -translate-x-3">
          <Image
            fill
            className=" object-cover"
            src={image}
            alt={`Cabin ${name}`}
          />
        </div>

        <div>
          <h3 className="text-accent-100 font-black text-6xl mb-5 translate-x-[-254px] bg-primary-950 p-6 pb-1 w-[150%]">
            Cabin {name}
          </h3>

          <p className=" text-primary-300 mb-10">
            <TextExpander>{description}</TextExpander>
          </p>

          <ul className="flex flex-col gap-4 mb-7">
            <li className="flex gap-3 items-center">
              <UsersIcon className="h-5 w-5 text-primary-600" />
              <span>
                For up to <span className="font-bold">{maxCapacity}</span>{" "}
                guests
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <MapPinIcon className="h-5 w-5 text-primary-600" />
              <span>
                Located in the heart of the{" "}
                <span className="font-bold">Dolomites</span> (Italy)
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <EyeSlashIcon className="h-5 w-5 text-primary-600" />
              <span>
                Privacy <span className="font-bold">100%</span> guaranteed
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <Link
          href={`/cabins/${next}`}
          className="h-24 w-24  hover:text-accent-500"
        >
          <ChevronRightIcon />
        </Link>
      </div>
    </div>
  );
}

export default Cabin;
