"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings,
  Building2,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import useAppStore from "@/store/app-store"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Casos",
    href: "/casos",
    icon: FileText,
  },
  {
    name: "Corresponsales",
    href: "/corresponsales",
    icon: Building2,
  },
  {
    name: "Reportes",
    href: "/reportes",
    icon: Users,
  },
  {
    name: "Configuración",
    href: "/configuracion",
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useAppStore()

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-gray-900 text-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
            <h1 className="text-xl font-bold">ASSISTRAVEL</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800 md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Usuario</p>
                <p className="text-xs text-gray-400">admin@assistravel.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}