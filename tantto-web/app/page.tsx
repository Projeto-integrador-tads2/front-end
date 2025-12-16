import nextAuthOptions from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";



export default async function Home() {

  const session = await getServerSession(nextAuthOptions);

  if (session) {
    redirect("/prospeccao");
  } else {
    redirect("/auth/login");
  }
}
