import { useState, useEffect } from 'react';
import { getActivitiesByMonth, getServiceYearActivities, getRoleDetails, getAuthorName } from '../utils/storage';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, BookOpen, Users, Video, ChevronDown, PlusCircle, Award, CheckCircle, Info } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AboutModal from './AboutModal';

export default function Dashboard({ profile, onNavigate, onSwitchProfile }) {
  const [stats, setStats] = useState({
    hours: 0,
    studies: 0,
    visits: 0,
    placements: 0,
    participated: false
  });
  
  const [yearlyHours, setYearlyHours] = useState(0);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [authorName, setAuthorName] = useState(getAuthorName());

  const roleInfo = getRoleDetails(profile.role);
  const isPioneer = roleInfo.isPioneer;
  const isRegularPioneer = profile.role === 'regular_50' || profile.role === 'regular';

  useEffect(() => {
    const now = new Date();
    const activities = getActivitiesByMonth(now.getFullYear(), now.getMonth(), profile.id);
    
    let hours = 0;
    let studies = 0;
    let visits = 0;
    let placements = 0;
    
    activities.forEach(a => {
      hours += Number(a.hours || 0);
      studies += Number(a.studies || 0);
      visits += Number(a.visits || 0);
      placements += Number(a.placements || 0);
    });

    setStats({
      hours,
      studies,
      visits,
      placements,
      participated: activities.length > 0
    });

    if (isRegularPioneer) {
      const yearlyActs = getServiceYearActivities(profile.id);
      let yHours = 0;
      yearlyActs.forEach(a => yHours += Number(a.hours || 0));
      setYearlyHours(yHours);
    }
  }, [profile, isRegularPioneer]);

  const monthName = format(new Date(), 'MMMM yyyy', { locale: es });
  const monthlyGoal = roleInfo.goal || 0;
  const monthlyPercent = monthlyGoal > 0 ? Math.min(100, Math.round((stats.hours / monthlyGoal) * 100)) : 0;
  const yearlyPercent = isRegularPioneer ? Math.min(100, Math.round((yearlyHours / 600) * 100)) : 0;

  return (
    <div className="page">
      {/* Cabecera superior con selector de perfil y botón de tema */}
      <div className="header-top">
        <div 
          className="profile-chip" 
          onClick={onSwitchProfile}
          title="Cambiar o crear otro perfil"
        >
          <div className="profile-chip-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-chip-info">
            <span className="profile-chip-name">{profile.name}</span>
            <span className="profile-chip-role">{roleInfo.label}</span>
          </div>
          <ChevronDown size={15} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
        </div>

        <div className="header-actions">
          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={() => setIsAboutOpen(true)}
            title="Acerca de la app y autoría"
            aria-label="Acerca de la app"
          >
            <Info size={19} />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Resumen del mes actual */}
      <div className="card card-gradient-purple">
        <div className="flex-between mb-3">
          <h2 style={{ textTransform: 'capitalize', fontSize: '1.25rem', margin: 0 }}>
            {monthName}
          </h2>
          <span className="profile-badge">
            {isPioneer ? (monthlyGoal > 0 ? `Meta: ${monthlyGoal}h` : 'Precursor(a)') : 'Publicador'}
          </span>
        </div>
        
        {/* Estado para publicador */}
        {!isPioneer && (
          <div className="mb-4 mt-2" style={{ padding: '0.85rem', background: stats.participated ? 'var(--success-subtle)' : 'var(--input-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle size={22} color={stats.participated ? 'var(--success)' : 'var(--text-muted)'} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: stats.participated ? 'var(--success)' : 'var(--text-main)' }}>
                {stats.participated ? '¡Has participado en el ministerio este mes!' : 'Aún no registras actividad este mes'}
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                {stats.participated ? 'Tu informe mensual está listo para reportarse' : 'Agrega una actividad para marcar tu participación'}
              </div>
            </div>
          </div>
        )}

        {/* Barra de progreso para precursores */}
        {isPioneer && monthlyGoal > 0 && (
           <div className="mb-4 mt-2">
              <div className="flex-between mb-1">
                <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Progreso mensual
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {stats.hours} de {monthlyGoal} hrs ({monthlyPercent}%)
                </span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${monthlyPercent}%` }}
                ></div>
              </div>
           </div>
        )}

        {/* Cuadrícula de estadísticas */}
        <div className="stat-grid mt-3">
          {(isPioneer || stats.hours > 0) && (
            <div className="stat-card">
              <Clock size={22} color="var(--primary)" style={{ margin: '0 auto' }} />
              <div className="stat-value">{stats.hours}</div>
              <div className="stat-label">Horas</div>
            </div>
          )}
          <div className="stat-card">
            <BookOpen size={22} color="var(--warning)" style={{ margin: '0 auto' }} />
            <div className="stat-value">{stats.studies}</div>
            <div className="stat-label">Cursos Bíblicos</div>
          </div>
          <div className="stat-card">
            <Users size={22} color="var(--success)" style={{ margin: '0 auto' }} />
            <div className="stat-value">{stats.visits}</div>
            <div className="stat-label">Revisitas</div>
          </div>
          <div className="stat-card">
            <Video size={22} color="var(--accent-purple)" style={{ margin: '0 auto' }} />
            <div className="stat-value">{stats.placements}</div>
            <div className="stat-label">Publicaciones</div>
          </div>
        </div>
      </div>

      {/* Meta anual para Precursor Regular (600 horas) */}
      {isRegularPioneer && (
        <div className="card">
          <div className="flex-between mb-2">
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <Award size={18} color="var(--primary)" /> Año de Servicio (Meta: 600h)
            </h3>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
              {yearlyPercent}%
            </span>
          </div>
          <div className="flex-between mb-2">
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Acumulado desde septiembre:</span>
            <strong style={{ fontSize: '0.9rem' }}>{yearlyHours} / 600 hrs</strong>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${yearlyPercent}%` }}
            ></div>
          </div>
          <div className="text-muted mt-2" style={{ fontSize: '0.75rem', textAlign: 'right' }}>
            Faltan {Math.max(0, 600 - yearlyHours)} hrs para completar la meta
          </div>
        </div>
      )}

      {/* Botón de acción principal */}
      <button 
        className="btn btn-primary mt-2" 
        onClick={() => onNavigate('form')}
      >
        <PlusCircle size={20} />
        <span>Registrar Actividad de Hoy</span>
      </button>

      {/* Pie de página con autoría */}
      <div className="app-footer-credit mt-4">
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
  );
}
