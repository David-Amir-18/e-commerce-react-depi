// AccInlineMenu.jsx
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import UserMenuContent from "./UserMenuContent";

// AccInlineMenu.jsx
export default function AccInlineMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => navigate("/profile");
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="flex flex-col md:hidden backdrop-blur-2xl bg-gray-500/30 text-white rounded-lg p-3 space-y-2">
      <UserMenuContent
        user={user}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
        inline={true} 
      />
    </div>
  );
}
