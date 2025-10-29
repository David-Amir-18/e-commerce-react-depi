import { useAuth } from "../contexts/AuthContext";

function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-amber-400 text-white font-bold text-3xl flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.name || 'User'}
              </h1>
              <p className="text-gray-300">{user?.email}</p>
            </div>
          </div>

          <div className="text-white">
            <p className="text-lg text-center py-12 text-gray-400">
              Profile content coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
