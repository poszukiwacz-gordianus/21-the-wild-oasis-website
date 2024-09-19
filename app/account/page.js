import { auth } from "../_lib/auth";

export const metadata = {
  title: "Gest area",
};

export default async function Page() {
  const session = await auth();
  const firstName = session.user.name.split(" ").at(0);

  return (
    <div>
      <h2 className="font-semibold text-xl text-accent-400 mb-7">
        Welcome, {firstName}
      </h2>
    </div>
  );
}
