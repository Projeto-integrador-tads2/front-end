import React from "react";
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
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />
      {/* Área principal de conteúdo */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
