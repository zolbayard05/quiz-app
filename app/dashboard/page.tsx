import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div className="p-8">
      <UserButton />
      <h1 className="mt-4 text-2xl font-bold">Dashboard</h1>
    </div>
  );
}
