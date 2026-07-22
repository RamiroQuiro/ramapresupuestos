import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { Text } from "../atomos/Text";
import { cn } from "../../../utils";

interface UserMenuProps {
  userName: string;
  userEmail?: string;
  userRole?: string;
}

export default function UserMenu({
  userName,
  userEmail,
  userRole,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Mi Perfil", icon: User, href: "/dashboard/perfil" },
    { label: "Ajustes", icon: Settings, href: "/dashboard/ajustes" },
    { label: "Ayuda", icon: HelpCircle, href: "/dashboard/ayuda" },
  ];

  return (
    <div className="relative flex items-center gap-4" ref={menuRef}>
      {/* Notificaciones (Maqueta V1) */}
      <button className="hover:text-primary-600 hover:bg-primary-50 relative rounded-xl p-2 text-gray-400 transition-colors">
        <Bell size={20} />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
      </button>

      {/* Trigger del Menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex cursor-pointer items-center gap-3 rounded-2xl border p-1.5 pl-3 transition-all duration-300",
          isOpen
            ? "border-primary-200 bg-primary-50 shadow-sm"
            : "hover:border-primary-100 border-gray-100 bg-white hover:shadow-md",
        )}
      >
        <div className="hidden text-right sm:block">
          <Text weight="bold" size="sm" className="leading-none text-gray-900">
            {userName}
          </Text>
          <Text size="xs" className="mt-1 text-gray-400 capitalize">
            {userRole || "Usuario"}
          </Text>
        </div>

        <div className="from-primary-500 flex h-10 w-10 items-center justify-center rounded-xl  to-indigo-600 font-bold text-white shadow-lg shadow-indigo-100 transition-transform group-hover:scale-105">
          <User size={20} />
        </div>

        <ChevronDown
          size={16}
          className={cn(
            "text-gray-400 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-[100] mt-2 w-64 rounded-2xl border border-gray-100 bg-white py-2 shadow-2xl duration-200">
          <div className="mb-2 border-b border-gray-50 px-4 py-3">
            <Text weight="bold" className="text-gray-900">
              {userName}
            </Text>
            <Text size="xs" className="truncate text-gray-400">
              {userEmail || "email@clubmanager.com"}
            </Text>
            {userRole === "admin" && (
              <div className="mt-2 flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase">
                <ShieldCheck size={12} />
                Administrador
              </div>
            )}
          </div>

          <div className="space-y-1 px-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-primary-600 group flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-50"
              >
                <item.icon
                  size={18}
                  className="group-hover:text-primary-500 text-gray-400"
                />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="mt-2 border-t border-gray-50 px-2 pt-2">
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 transition-colors hover:bg-red-50"
              >
                <LogOut
                  size={18}
                  className="text-red-400 group-hover:text-red-600"
                />
                <span className="text-sm font-bold">Cerrar Sesión</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
