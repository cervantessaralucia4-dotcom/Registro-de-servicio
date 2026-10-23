import { useState, useEffect } from 'react';
import ProfileManager from './components/ProfileManager';
import Dashboard from './components/Dashboard';
import ActivityForm from './components/ActivityForm';
import History from './components/History';
import ExportPDF from './components/ExportPDF';
import Navigation from './components/Navigation';
import { getActiveProfile, getProfiles, getSavedTheme } from './utils/storage';

function App() {
  const [profile, setProfile] = useState(null);
  const [currentView, setCurrentView] = useState('profiles'); // profiles, dashboard, form, history, export
  const [editActivityId, setEditActivityId] = useState(null);
  const [exportDate, setExportDate] = useState(null);

  // Inicializar tema y perfil activo
  useEffect(() => {
    const theme = getSavedTheme();
    document.documentElement.setAttribute('data-theme', theme);

    const active = getActiveProfile();
    const all = getProfiles();
    if (active) {
      setProfile(active);
    } else if (all.length > 0) {
      setProfile(all[0]);
    }
  }, []);

  const handleSelectProfile = (selectedProfile) => {
    setProfile(selectedProfile);
    setCurrentView('dashboard');
    window.scrollTo(0, 0);
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    setEditActivityId(null);
    window.scrollTo(0, 0);
  };

  const editActivity = (id) => {
    setEditActivityId(id);
    setCurrentView('form');
  };

  const startExport = (date) => {
    setExportDate(date);
    setCurrentView('export');
  };

  return (
    <div className="app-container">
      {/* Vista de Selección y Creación de Perfiles */}
      {currentView === 'profiles' && (
        <ProfileManager 
          activeProfile={profile}
          onSelectProfile={handleSelectProfile}
          onCancel={profile ? () => navigateTo('dashboard') : null}
        />
      )}

      {/* Vistas Principales (cuando hay un perfil seleccionado) */}
      {profile && (
        <>
          {currentView === 'dashboard' && (
            <Dashboard 
              profile={profile} 
              onNavigate={navigateTo} 
              onSwitchProfile={() => navigateTo('profiles')} 
            />
          )}

          {currentView === 'form' && (
            <ActivityForm 
              profile={profile} 
              activityId={editActivityId} 
              onFinished={() => navigateTo('history')} 
            />
          )}

          {currentView === 'history' && (
            <History 
              profile={profile} 
              onEdit={editActivity} 
              onExport={startExport} 
            />
          )}

          {currentView === 'export' && (
            <ExportPDF 
              profile={profile} 
              date={exportDate} 
              onBack={() => navigateTo('history')} 
            />
          )}

          {/* Navegación inferior persistente */}
          {currentView !== 'export' && currentView !== 'profiles' && (
            <Navigation currentView={currentView} onNavigate={navigateTo} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
