// AccDropDown.jsx
import { useAuth } from "../../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import UserMenuContent from "./UserMenuContent";

export default function AccDropDown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => navigate("/profile");
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const getInitial = () => user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-10 h-10 rounded-full cursor-pointer bg-amber-400 text-white font-semibold items-center justify-center hover:bg-amber-500 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label="User profile menu"
        >
          {getInitial()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 backdrop-blur-lg bg-transparent border-amber-400/20 text-white"
      >
        <UserMenuContent
          user={user}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
