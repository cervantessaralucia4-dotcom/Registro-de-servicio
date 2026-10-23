import { useState, useEffect } from 'react';
import { 
  getProfiles, 
  saveProfile, 
  deleteProfile, 
  setActiveProfileId, 
  ROLE_OPTIONS,
  getRoleDetails,
  getAuthorName 
} from '../utils/storage';
import ThemeToggle from './ThemeToggle';
import AboutModal from './AboutModal';
import { 
  UserPlus, 
  Users, 
  ArrowRight, 
  Trash2, 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Heart, 
  Info 
} from 'lucide-react';

export default function ProfileManager({ activeProfile, onSelectProfile, onCancel }) {
  const [profiles, setProfiles] = useState(getProfiles());
  const [name, setName] = useState('');
  const [role, setRole] = useState('publisher');
  const [showCreateForm, setShowCreateForm] = useState(profiles.length === 0);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [authorName, setAuthorName] = useState(getAuthorName());

  useEffect(() => {
    setAuthorName(getAuthorName());
  }, [isAboutOpen]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile = {
      name: name.trim(),
      role: role
    };

    const newId = saveProfile(newProfile);
    const updatedProfiles = getProfiles();
    setProfiles(updatedProfiles);
    setName('');
    
    // Seleccionar y entrar con el nuevo perfil
    const created = updatedProfiles.find(p => p.id === newId) || newProfile;
    onSelectProfile(created);
  };

  const handleSelect = (profile) => {
    setActiveProfileId(profile.id);
    onSelectProfile(profile);
  };

  const handleDelete = (e, profileId, profileName) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de eliminar el perfil de "${profileName}" y sus registros?`)) {
      deleteProfile(profileId);
      const remaining = getProfiles();
      setProfiles(remaining);
      if (remaining.length === 0) {
        setShowCreateForm(true);
      }
    }
  };

  return (
    <div className="page flex-center" style={{ minHeight: '92vh', padding: '1.25rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        
        {/* Tarjeta de Bienvenida: Información de la app y Autoría */}
        <div className="app-welcome-card">
          <div className="flex-between mb-2">
            <div className="flex-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="Registro de Servicio" 
                className="app-logo-img" 
              />
              <div>
                <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800 }}>Registro de Servicio</h2>
                <span className="text-muted" style={{ fontSize: '0.72rem' }}>Control personal y reporte ministerial</span>
              </div>
            </div>
            
            <div className="flex-center gap-1">
              <button 
                type="button" 
                className="theme-toggle-btn" 
                style={{ width: '38px', height: '38px' }} 
                onClick={() => setIsAboutOpen(true)}
                title="Información de la app y autoría"
                aria-label="Acerca de la app"
              >
                <Info size={18} />
              </button>
              <ThemeToggle />
              {onCancel && profiles.length > 0 && (
                <button 
                  className="btn-secondary btn-icon" 
                  onClick={onCancel} 
                  title="Volver"
                  style={{ borderRadius: 'var(--radius-full)', width: '38px', height: '38px' }}
                >
                  <ArrowLeft size={18} />
                </button>
              )}
            </div>
          </div>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.45, margin: '0.5rem 0' }}>
            Una herramienta diseñada para llevar un registro personal, privado y organizado de tu actividad mensual de predicación.
          </p>

          <div className="flex-between mt-2 pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
            <div 
              className="author-pill" 
              onClick={() => setIsAboutOpen(true)}
              title="Ver autoría y créditos"
            >
              <Heart size={13} fill="var(--primary)" />
              <span>Creado por {authorName}</span>
            </div>
            <span className="text-muted" style={{ fontSize: '0.72rem' }}>
              🔒 100% privado en tu celular
            </span>
          </div>
        </div>

        {/* Título de sección de perfiles */}
        <div className="flex-between mb-3">
          <div>
            <h1 style={{ fontSize: '1.35rem', marginBottom: '0.15rem' }}>
              {profiles.length > 0 ? 'Perfiles de Predicación' : 'Crear tu Perfil'}
            </h1>
            <p className="text-muted" style={{ fontSize: '0.82rem' }}>
              {profiles.length > 0 
                ? 'Elige tu usuario o crea uno nuevo en este dispositivo' 
                : 'Configura tu nombre y asignación para comenzar'}
            </p>
          </div>
        </div>

        {/* Lista de perfiles existentes si hay al menos uno */}
        {profiles.length > 0 && (
          <div className="card mb-4">
            <div className="flex-between mb-3">
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={18} className="text-primary" /> Perfiles en este dispositivo
              </span>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                {profiles.length} {profiles.length === 1 ? 'perfil' : 'perfiles'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {profiles.map(p => {
                const roleInfo = getRoleDetails(p.role);
                const isCurrent = activeProfile && activeProfile.id === p.id;
                return (
                  <div 
                    key={p.id}
                    className={`profile-card-item ${isCurrent ? 'active-profile' : ''}`}
                    onClick={() => handleSelect(p)}
                  >
                    <div className="profile-card-left">
                      <div className="profile-chip-avatar" style={{ width: '38px', height: '38px', fontSize: '1rem' }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {p.name}
                          {isCurrent && <CheckCircle2 size={15} color="var(--primary)" />}
                        </div>
                        <span className="profile-badge mt-1">
                          {roleInfo.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex-center gap-2">
                      <button 
                        className="btn-secondary btn-icon"
                        style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
                        onClick={(e) => handleDelete(e, p.id, p.name)}
                        title="Eliminar perfil"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        className="btn-subtle-purple btn-icon"
                        style={{ borderRadius: 'var(--radius-full)' }}
                        title="Entrar con este perfil"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {!showCreateForm && (
              <button 
                type="button" 
                className="btn btn-secondary mt-3"
                onClick={() => setShowCreateForm(true)}
              >
                <UserPlus size={18} />
                <span>Crear otro perfil</span>
              </button>
            )}
          </div>
        )}

        {/* Formulario de Creación de Perfil */}
        {showCreateForm && (
          <div className="card card-gradient-purple">
            <div className="flex-between mb-3">
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserPlus size={18} className="text-primary" />
                {profiles.length > 0 ? 'Crear Nuevo Perfil' : 'Datos de tu Perfil'}
              </span>
              {profiles.length > 0 && (
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cerrar
                </button>
              )}
            </div>

            <form onSubmit={handleCreate}>
              {/* Campo 1: Nombre */}
              <div className="form-group">
                <label htmlFor="profile-name-input">Nombre</label>
                <input 
                  id="profile-name-input"
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Ej. Sara Pérez" 
                  required
                  autoFocus={profiles.length > 0}
                />
              </div>
              
              {/* Campo 2: Lista desplegable con las 5 opciones exactas */}
              <div className="form-group">
                <label htmlFor="profile-role-select">Asignación de servicio</label>
                <select 
                  id="profile-role-select"
                  value={role} 
                  onChange={e => setRole(e.target.value)}
                >
                  {ROLE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-between mt-3 gap-2">
                {profiles.length > 0 && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    style={{ width: '40%' }}
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: profiles.length > 0 ? '60%' : '100%' }}
                >
                  Guardar y Entrar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pie de página con autoría */}
        <div className="app-footer-credit">
          <span>Registro de Servicio • Creado con dedicación por <strong>{authorName}</strong></span>
        </div>

        {/* Modal de Información y Acerca de */}
        <AboutModal 
          isOpen={isAboutOpen} 
          onClose={() => {
            setIsAboutOpen(false);
            setAuthorName(getAuthorName());
          }} 
        />

      </div>
    </div>
  );
}
