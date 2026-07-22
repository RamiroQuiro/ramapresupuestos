import { cn } from "@/utils/cn";
import { Bolt, Cog, Ellipsis, Plus, UserPlus, CalendarPlus, Envelope, User, Calendar, Dumbbell, FileUp, FileDown } from "lucide-react";
import React from "react";

type ActionItem = {
  label: string;
  icon: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  shortcut?: string;
};

type SectionItem = {
  label: string;
  icon?: string;
  badge?: { value: string; variant?: "primary" | "default" };
};

type SidebarSection = {
  title: string;
  items: SectionItem[];
  action?: { label: string };
};

interface NotionStyleSidebarProps {
  title?: string;
  actions?: ActionItem[];
  sections?: SidebarSection[];
  isCollapsed?: boolean;
  stats?: { label: string; value: string; color?: string }[];
}

const iconMap: Record<string, React.ElementType> = {
  "user-plus": UserPlus,
  "calendar-plus": CalendarPlus,
  envelope: Envelope,
  user: User,
  calendar: Calendar,
  "tennis-ball": Dumbbell,
  "file-import": FileDown,
  "file-export": FileUp,
  bolt: Bolt,
  plus: Plus,
};

export default function NotionStyleSidebar({
  title = "Acciones Rápidas",
  actions = [],
  sections = [],
  isCollapsed = false,
  stats = [],
}: NotionStyleSidebarProps) {
  if (isCollapsed) {
    return (
      <div className="bg-primary-bg-componentes border-primary-bg-componentes-3 w-16 rounded-2xl border p-4">
        <div className="space-y-4">
          {actions.slice(0, 3).map((action, index) => {
            const Icon = iconMap[action.icon] || Bolt;
            return (
              <button
                key={index}
                className="bg-primary-500 hover:bg-primary-150 flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors"
                title={action.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-bg-componentes border-primary-bg-componentes-3 w-80 overflow-hidden rounded-2xl border">
      <div className="border-primary-bg-componentes-3 from-primary-bg-componentes to-primary-bg-componentes-2 border-b bg-gradient-to-r p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-primary-textoTitle flex items-center gap-2 text-lg font-semibold">
            <Bolt className="text-primary-500 h-5 w-5" />
            {title}
          </h3>
          <button className="hover:bg-primary-bg-componentes-3 flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
            <Ellipsis className="text-primary-texto h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-12rem)] space-y-4 overflow-y-auto p-4">
        {actions.length > 0 && (
          <div className="space-y-2">
            {actions.map((action, index) => {
              const Icon = iconMap[action.icon] || Bolt;
              return (
                <button
                  key={index}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-md",
                    action.variant === "danger"
                      ? "bg-primary-error text-white hover:bg-red-600"
                      : "text-primary-textoTitle border-primary-bg-componentes-3 hover:border-primary-500 hover:bg-primary-50 border bg-white",
                  )}
                  onClick={action.onClick}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      action.variant === "primary"
                        ? "bg-primary-500 text-white group-hover:bg-primary-150"
                        : action.variant === "danger"
                          ? "bg-primary-error text-white"
                          : "bg-primary-100 text-primary-300 group-hover:bg-primary-150",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-left">{action.label}</span>
                  {action.shortcut && (
                    <span className="text-primary-texto bg-primary-bg-componentes-2 rounded px-2 py-1 text-xs">
                      {action.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-primary-texto text-xs font-semibold tracking-wide uppercase">
                {section.title}
              </h4>
              {section.action && (
                <button className="text-primary-500 hover:text-primary-150 text-xs transition-colors">
                  {section.action.label}
                </button>
              )}
            </div>

            <div className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const ItemIcon = item.icon ? iconMap[item.icon] : null;
                return (
                  <div
                    key={itemIndex}
                    className="group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-all hover:bg-white hover:shadow-sm"
                  >
                    {ItemIcon && (
                      <div className="flex h-6 w-6 items-center justify-center">
                        <ItemIcon className="text-primary-texto group-hover:text-primary-500 h-4 w-4" />
                      </div>
                    )}
                    <span className="text-primary-textoTitle group-hover:text-primary-500 flex-1 text-sm">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-xs",
                          item.badge.variant === "primary"
                            ? "bg-primary-500 text-white"
                            : "bg-primary-bg-componentes-2 text-primary-texto",
                        )}
                      >
                        {item.badge.value}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {stats.length > 0 && (
          <div className="border-primary-bg-componentes-3 rounded-lg border bg-white p-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-primary-texto">{stat.label}</span>
                <span
                  className={cn(
                    "font-semibold",
                    stat.color || "text-primary-textoTitle",
                  )}
                >
                  {stat.value}
                </span>
              </div>
            ))}
            <div className="bg-primary-bg-componentes-3 mt-2 h-1.5 w-full rounded-full">
              <div
                className="bg-primary-500 h-1.5 rounded-full"
                style={{ width: "65%" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-primary-bg-componentes-3 border-t bg-white p-4">
        <div className="text-primary-texto flex items-center justify-between text-xs">
          <span>ClubManager v1.0</span>
          <button className="hover:text-primary-500 transition-colors">
            <Cog className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export const useNotionSidebar = (pageType: string) => {
  const configs: Record<string, any> = {
    dashboard: {
      title: "Acciones Rápidas",
      actions: [
        {
          label: "Nuevo Socio",
          icon: "user-plus",
          onClick: () => console.log("Nuevo socio"),
          variant: "primary",
          shortcut: "⌘N",
        },
        {
          label: "Crear Evento",
          icon: "calendar-plus",
          onClick: () => console.log("Nuevo evento"),
          variant: "secondary",
          shortcut: "⌘E",
        },
        {
          label: "Enviar Email",
          icon: "envelope",
          onClick: () => console.log("Enviar email"),
          variant: "secondary",
        },
      ],
      sections: [
        {
          title: "Reciente",
          items: [
            { label: "María López", icon: "user", badge: { value: "Nuevo", variant: "primary" } },
            { label: "Cena Anual", icon: "calendar", badge: { value: "45/100" } },
            { label: "Torneo Tenis", icon: "tennis-ball", badge: { value: "12/32" } },
          ],
        },
      ],
      stats: [
        { label: "Socios activos", value: "450" },
        { label: "Pendientes", value: "18", color: "text-primary-error" },
      ],
    },
    socios: {
      title: "Gestión de Socios",
      actions: [
        {
          label: "Agregar Socio",
          icon: "user-plus",
          onClick: () => console.log("Agregar socio"),
          variant: "primary",
        },
        {
          label: "Importar CSV",
          icon: "file-import",
          onClick: () => console.log("Importar"),
          variant: "secondary",
        },
        {
          label: "Exportar Lista",
          icon: "file-export",
          onClick: () => console.log("Exportar"),
          variant: "secondary",
        },
      ],
    },
  };

  return configs[pageType] || configs.dashboard;
};
