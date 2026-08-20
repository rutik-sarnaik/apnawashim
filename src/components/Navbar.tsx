import { User } from '../types';
import { Building2, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  setView: (view: any) => void;
  currentView: string;
}

export default function Navbar({ user, onLogout, setView, currentView }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('landing')}
        >
          <div className="bg-emerald-600 p-2 rounded-lg group-hover:bg-emerald-700 transition-colors">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">
            Aaple<span className="text-emerald-600">Washim</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button 
                onClick={() => setView('login')}
                className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => setView('register')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
              >
                Register
              </button>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-600">
                {user.role === 'admin' ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <UserIcon className="w-4 h-4" />}
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
