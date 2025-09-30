"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import useAppStore from "@/store/app-store"

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { setSidebarOpen } = useAppStore()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menú</span>
        </Button>
        {title && (
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Aquí puedes agregar elementos como notificaciones, tema, etc. */}
      </div>
    </header>
  )
}