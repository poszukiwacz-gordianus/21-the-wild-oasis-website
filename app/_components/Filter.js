"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const filters = [
  {
    filter: "all",
    value: "All cabins",
  },
  {
    filter: "small",
    value: `1-3 guests`,
  },
  {
    filter: "medium",
    value: "4-7 guests",
  },
  {
    filter: "large",
    value: "8-12 guests",
  },
];

function Filter() {
  //To get params from url we need use on client useSearchParams hook from 'next/navigation'
  const searchParams = useSearchParams();
  //to replace URL in searchbar we need use useRouter hook from 'next/navigation'
  //This hook gonna allow us to do programmatic navigation between routes in Next.js
  const router = useRouter();
  //Gets current pathname
  const pathname = usePathname();

  //Reads current value from searchParams
  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(filter) {
    //web API provides a few methods that we can use to manipulate the url query paramiters
    const params = new URLSearchParams(searchParams);

    //We can set, delete and so on
    //This build internally the url but doesn't navigate to it
    params.set("capacity", filter);

    //We need to actually construct the entire URL where we want to move to
    //As a second argument, we can pass in an object with scroll property to false, this is optional and it will ensure that the page is not gonna scroll back up to the top
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className=" border border-primary-800 flex">
      {filters.map((filter) => (
        <button
          key={filter.filter}
          className={`${
            filter.filter === activeFilter
              ? " bg-primary-700 text-primary-50"
              : ""
          } px-5 py-2 hover:bg-primary-700`}
          onClick={() => handleFilter(filter.filter)}
        >
          {filter.value}
        </button>
      ))}
    </div>
  );
}

export default Filter;
