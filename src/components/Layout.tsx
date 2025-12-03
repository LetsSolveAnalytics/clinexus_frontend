import { ReactNode } from "react";
import CollapsibleSidebar from "./CollapsibleSidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <CollapsibleSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
