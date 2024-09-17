import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(request, { params }) {
  //These rout handlers use web standards such as Request and Response
  const { cabinId } = params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(Number(cabinId)),
      getBookedDatesByCabinId(Number(cabinId)),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch (error) {
    return Response.json({ message: "Cabin not found" });
  }
}

//We can create one rout handler for each of those verbs GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
