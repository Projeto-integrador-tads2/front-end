import Sidebar from "@/components/layout/Sidebar";
import { getServerSession } from "next-auth";
import nextAuthOptions from "@/config/auth";
import { redirect } from "next/navigation";


export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background ">
      <Sidebar />
      <main className="flex-1 overflow-auto no-scrollbar">{children}</main>
    </div>
  );
}
