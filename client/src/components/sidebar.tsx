import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Video, 
  AlertTriangle, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
};

const NavItem = ({ icon, label, href, isActive = false, onClick }: NavItemProps) => (
  <li className="mb-2">
    <Link href={href}>
      <a
        onClick={onClick}
        className={cn(
          "flex items-center py-3 px-4 text-white rounded transition-colors duration-200 ease-in-out",
          isActive 
            ? "bg-primary" 
            : "hover:bg-secondary"
        )}
      >
        {icon}
        <span className="ml-3 hidden md:block">{label}</span>
      </a>
    </Link>
  </li>
);

export function Sidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className={cn(
      "bg-secondary-dark text-white flex flex-col h-screen",
      isExpanded ? "w-64" : "w-16"
    )}>
      <div className="p-4 flex items-center justify-center md:justify-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        {isExpanded && (
          <span className="ml-2 font-bold text-xl hidden md:block">스마트 도로 시스템</span>
        )}
      </div>
      
      <nav className="flex-1 mt-6">
        <ul>
          <NavItem 
            icon={<Home className="h-5 w-5" />} 
            label="대시보드" 
            href="/" 
            isActive={location === "/"} 
          />
          <NavItem 
            icon={<Video className="h-5 w-5" />} 
            label="CCTV 감시" 
            href="/cctv" 
            isActive={location === "/cctv"} 
          />
          <NavItem 
            icon={<AlertTriangle className="h-5 w-5" />} 
            label="이상 보고" 
            href="/incidents" 
            isActive={location === "/incidents"} 
          />
          <NavItem 
            icon={<ClipboardCheck className="h-5 w-5" />} 
            label="작업 목록" 
            href="/tasks" 
            isActive={location === "/tasks"} 
          />
          <NavItem 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="데이터 분석" 
            href="/analytics" 
            isActive={location === "/analytics"} 
          />
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <Link href="/settings">
          <a className="flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200 ease-in-out">
            <Settings className="h-5 w-5" />
            {isExpanded && <span className="ml-3 hidden md:block">설정</span>}
          </a>
        </Link>
        <button 
          onClick={handleLogout}
          className="mt-2 flex items-center py-2 text-white hover:text-gray-300 transition-colors duration-200 ease-in-out w-full"
        >
          <LogOut className="h-5 w-5" />
          {isExpanded && <span className="ml-3 hidden md:block">로그아웃</span>}
        </button>
      </div>
    </aside>
  );
}
