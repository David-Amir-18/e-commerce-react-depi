import { useAuth } from "../../contexts/AuthContext";
import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

function AccDropDown() {
      const { user, logout } = useAuth();
      const navigate = useNavigate()
      function handleProfileClick() {
            navigate('/profile');
      }

      function handleLogout() {
            logout();
            navigate('/signin');
      }

      function getInitial() {
            if (user?.name) {
                  return user.name.charAt(0).toUpperCase();
            }
            return 'U';
      }
      return (
            <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                        <button
                              className="w-10 h-10 rounded-full cursor-pointer bg-amber-400 text-white font-semibold flex items-center justify-center hover:bg-amber-500 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                              aria-label="User profile menu"
                        >
                              {getInitial()}
                        </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                        align="end"
                        className="w-56 bg-slate-800 border-amber-400/20 text-white"
                  >
                        <div className="px-2 py-1.5 text-sm">
                              <p className="font-semibold text-amber-400">{user?.name}</p>
                              <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator className="bg-amber-400/20" />
                        <DropdownMenuItem
                              onClick={handleProfileClick}
                              className="cursor-pointer focus:bg-amber-400/10 focus:text-amber-400"
                        >
                              <User className="mr-2 h-4 w-4" />
                              <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-amber-400/20" />
                        <DropdownMenuItem
                              onClick={handleLogout}
                              className="cursor-pointer focus:bg-red-500/10 focus:text-red-400"
                        >
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Log out</span>
                        </DropdownMenuItem>
                  </DropdownMenuContent>
            </DropdownMenu>
      )
}

export default AccDropDown;