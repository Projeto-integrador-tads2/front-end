"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Users, Building2, FileText, LogOut, Network } from "lucide-react";

const menuOptions = [
  { label: "Prospecção", icon: <Network size={20} />, href: "/prospeccao" },
  { label: "Empresas", icon: <Building2 size={20} />, href: "/empresas" },
  { label: "Clientes", icon: <Users size={20} />, href: "/clientes" },
  { label: "Serviços", icon: <FileText size={20} />, href: "/servicos" },
];

function getInitials(name?: string) {
  if (!name) return "U";
  const names = name.split(" ");
  if (names.length === 1) return names[0][0];
  return names[0][0] + names[names.length - 1][0];
}

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname() || "/";

  const userName = session?.user?.name ?? "Usuário";
  const userRole = session?.user?.role ?? "Colaborador";

  return (
    <aside
      className="flex flex-col justify-between h-screen w-64 bg-sidebar sticky top-0 left-0 z-30"
      style={{ minWidth: "256px" }}
    >
      <div>
        <div className="flex items-center gap-3 pr-6 pl-2 pt-2 pb-6">
          <Image
            src="/logo-tantto.png"
            alt="Logo Tantto"
            width={50}
            height={50}
            draggable={false}
          />
          <span className="text-2xl font-bold text-[var(--color-sidebar-foreground)] font-jakarta-sans tracking-wide">
            TANTTO
          </span>
        </div>
        {/* Menu */}
        <nav className="flex flex-col gap-2 mt-4 px-6">
          {menuOptions.map((option) => {
            const isActive =
              pathname === option.href ||
              pathname.startsWith(option.href + "/");
            return (
              <Link key={option.label} href={option.href} passHref>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-colors
                    ${
                      isActive
                        ? "bg-[var(--color-card)] text-[var(--color-sidebar-foreground)]"
                        : "text-[var(--color-sidebar-foreground)] hover:bg-[var(--color-card)]"
                    }
                  `}
                >
                  <span
                    className={`flex items-center text-[var(--color-sidebar-foreground)]`}
                  >
                    {option.icon}
                  </span>
                  <span className="font-medium text-base font-jakarta-sans">
                    {option.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé: Usuário + Logout */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between bg-[var(--color-card)] rounded-xl px-3 py-2">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[var(--color-sidebar-border)] flex items-center justify-center text-[var(--color-sidebar-foreground)] font-bold text-lg select-none">
              {getInitials(userName)}
            </div>
            {/* Nome e papel */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[var(--color-sidebar-foreground)] font-jakarta-sans leading-tight">
                {userName}
              </span>
              <span className="text-xs text-[var(--color-muted-foreground)] font-jakarta-sans leading-tight">
                {userRole}
              </span>
            </div>
          </div>
          {/* Botão logout */}
          <button
            title="Sair"
            onClick={() => signOut()}
            className="p-2 rounded-lg hover:bg-[var(--color-sidebar-border)] transition-colors"
          >
            <LogOut
              size={18}
              className="text-[var(--color-muted-foreground)]"
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
