"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Bell,
  HardHat,
  Home,
  LogOut,
  User,
  Users,
  UserCheck,
  Tags,
  ClipboardList,
  FileText,
  TrendingUp,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const pathname = location.pathname

  // Fonction pour déterminer si le lien est actif
  const isActive = (path: string) => pathname === path

  return (
    <SidebarProvider defaultOpen={true} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <Sidebar className="border-r border-border/40">
          <SidebarHeader className="border-b border-border/40 pb-2">
            <div className="flex items-center gap-2 px-4 py-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-menara-djWRkdbDBO6lw0rZvf9Vko7lgTLbxV.png"
                alt="Menara Prefa Logo"
                className="h-10 w-auto"
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link to="/admin">
                      <SidebarMenuButton className={isActive("/admin") ? "bg-menara-blue text-white" : ""}>
                        <Home className="h-5 w-5" />
                        <span>Tableau de bord</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link to="/admin/users">
                      <SidebarMenuButton className={isActive("/admin/users") ? "bg-menara-blue text-white" : ""}>
                        <Users className="h-5 w-5" />
                        <span>Utilisateurs</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link to="/admin/employees">
                      <SidebarMenuButton className={isActive("/admin/employees") ? "bg-menara-blue text-white" : ""}>
                        <UserCheck className="h-5 w-5" />
                        <span>Employés</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link to="/admin/categories">
                      <SidebarMenuButton className={isActive("/admin/categories") ? "bg-menara-blue text-white" : ""}>
                        <Tags className="h-5 w-5" />
                        <span>Catégories</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link to="/admin/materials">
                      <SidebarMenuButton className={isActive("/admin/materials") ? "bg-menara-blue text-white" : ""}>
                        <HardHat className="h-5 w-5" />
                        <span>Matériels EPI</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link to="/admin/stock">
                      <SidebarMenuButton className={isActive("/admin/stock") ? "bg-menara-blue text-white" : ""}>
                        <TrendingUp className="h-5 w-5" />
                        <span>Gestion du Stock</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link to="/admin/affectations">
                      <SidebarMenuButton className={isActive("/admin/affectations") ? "bg-menara-blue text-white" : ""}>
                        <ClipboardList className="h-5 w-5" />
                        <span>Affectations</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link to="/admin/attributions">
                      <SidebarMenuButton className={isActive("/admin/attributions") ? "bg-menara-blue text-white" : ""}>
                        <FileText className="h-5 w-5" />
                        <span>Attributions</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-menara-blue">
                {isActive("/admin") && "Tableau de bord"}
                {isActive("/admin/users") && "Gestion des Utilisateurs"}
                {isActive("/admin/employees") && "Gestion des Employés"}
                {isActive("/admin/categories") && "Gestion des Catégories"}
                {isActive("/admin/materials") && "Gestion des Matériels EPI"}
                {isActive("/admin/affectations") && "Consultation des Affectations"}
                {isActive("/admin/attributions") && "Consultation des Attributions"}
                {isActive("/admin/stock") && "Gestion du Stock"}
                {isActive("/admin/settings") && "Paramètres"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-menara-red text-white">
                  3
                </Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
                      <AvatarFallback className="bg-menara-blue text-white">AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">
                    Mon Compte
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <Link
                    to="/profile"
                    className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800"
                  >
                    <DropdownMenuItem className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">
                      <User className="mr-2 h-4 w-4 " />
                      <span>Profil</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <Link
                    to="/login"
                    onClick={() => {
                      localStorage.removeItem("token")
                    }}
                  >
                    <DropdownMenuItem className="hover:text-white hover:bg-slate-800 focus:text-white focus:bg-slate-800">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
