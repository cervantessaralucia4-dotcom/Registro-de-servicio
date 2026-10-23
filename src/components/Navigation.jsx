import { Home, PlusCircle, CalendarDays, Users } from 'lucide-react';

export default function Navigation({ currentView, onNavigate }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
        onClick={() => onNavigate('dashboard')}
      >
        <Home />
        <span>Inicio</span>
      </button>
      <button 
        className={`nav-item ${currentView === 'form' ? 'active' : ''}`}
        onClick={() => onNavigate('form')}
      >
        <PlusCircle />
        <span>Registrar</span>
      </button>
      <button 
        className={`nav-item ${currentView === 'history' ? 'active' : ''}`}
        onClick={() => onNavigate('history')}
      >
        <CalendarDays />
        <span>Historial</span>
      </button>
      <button 
        className={`nav-item ${currentView === 'profiles' ? 'active' : ''}`}
        onClick={() => onNavigate('profiles')}
      >
        <Users />
        <span>Perfiles</span>
      </button>
    </nav>
  );
}
