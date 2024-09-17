import Header from "./_components/Header";

import { ReservationProvider } from "./_components/ReservationContext";

import { Josefin_Sans } from "next/font/google";

import "@/app/_styles/globals.css";

const josefinFont = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  // weight: "400"
});

export const metadata = {
  title: {
    template: "%s | The Wild Oasis",
    default: "Welcome | The Wild Oasis",
  },
  description:
    "Luxurius cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body
        className={`${josefinFont.className} bg-primary-950 text-primary-100 min-h-screen flex flex-col antialiased relative`}
      >
        <Header />

        <div className="flex-1 px-8 py-12 grid">
          <main className=" max-w-7xl mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
