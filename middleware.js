import { auth } from "@/app/_lib/auth";
// import { NextResponse } from "next/server";

// export async function middleware(req) {
//   const res = NextResponse.next(); // Create a new response object

//   // Continue with authentication after deleting the cookie
//   const authResult = await auth(req, res);

//   return authResult; // Return the result from `auth`
// }

export const middleware = auth;

export const config = {
  matcher: ["/account"],
};
