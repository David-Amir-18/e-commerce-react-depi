// UserMenuContent.jsx
import { DropdownMenuItem, DropdownMenuSeparator } from "../../components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

export default function UserMenuContent({ user, onProfileClick, onLogout, inline = false }) {
  const Item = inline ? "button" : DropdownMenuItem;
  const Separator = inline ? "hr" : DropdownMenuSeparator;

  return (
    <div className={`${inline ? "flex flex-col space-y-2" : ""}`}>
      <div className="px-2 py-1.5 text-sm">
        <p className="font-semibold text-amber-400">{user?.name}</p>
        <p className="text-xs text-gray-400">{user?.email}</p>
      </div>
      <Separator className="bg-amber-400/20" />
      <Item
        onClick={onProfileClick}
        className={`cursor-pointer flex items-center ${
          inline
            ? "text-left px-2 py-2 rounded-md hover:bg-amber-400/10 hover:text-amber-400"
            : "focus:bg-amber-400/10 focus:text-amber-400"
        }`}
      >
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </Item>
      <Separator className="bg-amber-400/20" />
      <Item
        onClick={onLogout}
        className={`cursor-pointer flex items-center ${
          inline
            ? "text-left px-2 py-2 rounded-md hover:bg-red-500/10 hover:text-red-400"
            : "focus:bg-red-500/10 focus:text-red-400"
        }`}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </Item>
    </div>
  );
}
