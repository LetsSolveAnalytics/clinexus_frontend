import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  id: string;
  icon: string; // Path to SVG icon
  label: string;
  path?: string;
  onClick?: () => void;
}

const CollapsibleSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { id: "menu", icon: "/icons/menu.svg", label: "Menu", path: "/" },
    { id: "appointments", icon: "/icons/appointment-filled.svg", label: "Appointments", path: "/appointments" },
    { id: "patients", icon: "/icons/people.svg", label: "Patient Hub", path: "/patient-hub" },
    { id: "reports", icon: "/icons/report.svg", label: "Reports", path: "/reports" },
    { id: "messages", icon: "/icons/message-filled.svg", label: "Messages", path: "/messages" },
    { id: "medications", icon: "/icons/medication.svg", label: "Medications", path: "/medications" },
    { id: "notifications", icon: "/icons/notification-fill.svg", label: "Notifications", path: "/notifications" },
    { id: "help", icon: "/icons/help-rounded.svg", label: "Help", path: "/help" },
  ];

  const handleNavigation = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <TooltipProvider>
      <div
        className={`
          relative h-screen bg-gradient-to-b from-[#87CEEB] via-[#9DD6F0] to-[#B3DFF5]
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          flex flex-col shadow-xl
        `}
      >
        {/* Logo Header */}
        <div className="p-3 flex justify-center items-center border-b border-white/20">
          {isCollapsed ? (
            <img
              src="/icons/colored-logo-transperant-bg-clinexus.svg"
              alt="Clinexus Icon"
              className="h-10 w-10 transition-all duration-300 object-contain"
            />
          ) : (
            <img
              src="/logo.png"
              alt="Clinexus Logo"
              className="max-h-12 w-full transition-all duration-300 object-contain"
            />
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all z-10 border-2 border-[#87CEEB]"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-[#4F6EFF]" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-[#4F6EFF]" />
          )}
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);

            const buttonContent = (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl
                  transition-all duration-200
                  ${
                    active
                      ? "bg-[#4F6EFF] text-white shadow-lg scale-105"
                      : "text-[#2C5F7F] hover:bg-white/30 hover:scale-105"
                  }
                  ${isCollapsed ? "justify-center" : "justify-start"}
                `}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`${isCollapsed ? "h-6 w-6" : "h-5 w-5"} flex-shrink-0 ${
                    active ? "brightness-0 invert" : ""
                  }`}
                />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );

            return isCollapsed ? (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              buttonContent
            );
          })}
        </nav>

        {/* User Avatar */}
        <div className="px-4 py-4 border-t border-white/20">
          <div
            className={`
              flex items-center gap-3
              ${isCollapsed ? "justify-center" : "justify-start"}
            `}
          >
            <img
              src="/icons/user-pp.svg"
              alt="User Profile"
              className="h-12 w-12 rounded-full border-2 border-white shadow-md"
            />
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#2C5F7F]">Dr. Smith</p>
                <p className="text-xs text-[#5B8BA0]">Physician</p>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => console.log("Logout clicked")}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-2xl
                  text-[#2C5F7F] hover:bg-red-100/50 hover:text-red-600
                  transition-all duration-200
                  ${isCollapsed ? "justify-center" : "justify-start"}
                `}
              >
                <img
                  src="/icons/logout.svg"
                  alt="Logout"
                  className={`${isCollapsed ? "h-6 w-6" : "h-5 w-5"} flex-shrink-0`}
                />
                {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CollapsibleSidebar;
