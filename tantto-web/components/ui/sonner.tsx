"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "border rounded-xl shadow-lg",
          success: "!bg-[#1a3a2a] !border-[#00c461] !text-white",
          error: "!bg-[#3a1a1a] !border-[#FF0004] !text-white",
          warning: "!bg-[#3a3a1a] !border-[#FFD812] !text-white",
          info: "!bg-[#1a2a3a] !border-[#3483BD] !text-white",
          default: "!bg-[var(--card)] !border-[var(--border)] !text-white",
          description: "!text-[#A3A6B1]",
          closeButton: "!bg-[var(--muted)] !text-white !border-[var(--border)] hover:!bg-[var(--input)]",
        },
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "0.75rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
