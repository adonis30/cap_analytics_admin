"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
 

import {
  Users,
  Truck,
  Warehouse,
  Wrench,
  ShoppingCart,
  Building,
  BarChart,
  LifeBuoy,
  Send,
  Frame,
  PieChart,
  Map,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";

import {
  PeopleAlt, AttachMoney, AccessTime, Assessment, EventNote,
  Description, AutoAwesome, InsertChart, Feedback
} from "@mui/icons-material";

import { NavMain } from "./NavMain";
import { NavProjects } from "./NavProjects";
import { NavSecondary } from "./NavSecondary";
import { NavUser } from "./NavUser";
import { useGetCurrentUserQuery } from "@/services/api";
 
 

const defaultUser = {
  name: "Onis Ndhlovu",
  email: "onis@gmial.com",
  avatar: "https://github.com/shadcn.png",
};

const navConfig = {
  main: [
    {
      key: "hr",
      icon: Users,
      isActive: true,
      items: [
        
  { label: "Employees", icon: <PeopleAlt />, url: "/hr/employees" },
  { label: "Payroll", icon: <AttachMoney />, url: "/hr/payroll" },
  { label: "Attendance", icon: <AccessTime />, url: "/hr/attendance" },
  { label: "Performance", icon: <Assessment />, url: "/hr/performance" },
  { label: "Leave", icon: <EventNote />, url: "/hr/leave" },
  { label: "Documents", icon: <Description />, url: "/hr/documents" },
  { label: "Engagement", icon: <Feedback />, url: "/hr/engagement" },
  { label: "Automation", icon: <AutoAwesome />, url: "/hr/automation" },
  { label: "Reports", icon: <InsertChart />, url: "/hr/reports" },

      ],
    },
    {
      key: "transport",
      icon: Truck,
      items: [
        { label: "fleetManagement", url: "/transport/fleet" },
        { label: "driverLogs", url: "/transport/drivers" },
      ],
    },
    {
      key: "warehouse",
      icon: Warehouse,
      items: [
        { label: "inventory", url: "/warehouse/inventory" },
        { label: "inbound", url: "/warehouse/inbound" },
        { label: "outbound", url: "/warehouse/outbound" },
      ],
    },
    {
      key: "workshop",
      icon: Wrench,
      items: [
        { label: "workOrders", url: "/workshop/orders" },
        { label: "maintenanceSchedule", url: "/workshop/schedule" },
      ],
    },
    {
      key: "procurement",
      icon: ShoppingCart,
      items: [
        { label: "suppliers", url: "/procurement/suppliers" },
        { label: "purchaseOrders", url: "/procurement/orders" },
      ],
    },
    {
      key: "businessAdmin",
      icon: Building,
      items: [
        { label: "departments", url: "/admin/departments" },
        { label: "policies", url: "/admin/policies" },
      ],
    },
    {
      key: "reportsAnalytics",
      icon: BarChart,
      items: [
        { label: "kpiDashboard", url: "/analytics/kpi" },
        { label: "monthlyReports", url: "/analytics/reports" },
      ],
    },
  ],
  secondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

const AppSidebar = () => {
  const { data: userData } = useGetCurrentUserQuery({});
  const t = useTranslations("common");
  console.log("userData", userData);
  const user = {
    name: userData?.user?.name ?? defaultUser.name,
    email: userData?.user?.email ?? defaultUser.email,
    avatar: userData?.user?.image ?? defaultUser.avatar,
  };
   
  const navMainItems = navConfig.main.map((item) => ({
    title: t(`title.${item.key}`),
    url: "#",
    icon: item.icon,
    isActive: item.isActive,
    items: item.items?.map((sub) => ({
      title: t(`title.${sub.label}`),
      url: sub.url,
    })),
  }));

  return (
    <Sidebar collapsible="icon" className="w-64 h-screen bg-white dark:bg-gray-900">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-2xl font-bold ml-2">Nix BMS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("application")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMain items={navMainItems} />
            <NavProjects projects={navConfig.projects} />
            <NavSecondary items={navConfig.secondary} className="mt-auto" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
