import { Suspense } from "react";

import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import Cabin from "@/app/_components/Cabin";

import { getCabin, getCabins } from "@/app/_lib/data-service";

export async function generateMetadata({ params: { cabinId } }) {
  const { name } = await getCabin(Number(cabinId));
  return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  const ids = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));

  return ids;
}

export async function getStaticProps({ params }) {
  const { cabinId } = params; // Get the dynamic cabinId from params

  const cabin = await getCabin(cabinId); // Fetch data based on the cabinId

  if (!cabin) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      cabin,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}

export default async function Page({ params: { cabinId } }) {
  const cabin = await getCabin(Number(cabinId));
  const cabins = await getCabins();

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} cabins={cabins} />
      <div>
        <h2 className="text-[2.5rem] font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
