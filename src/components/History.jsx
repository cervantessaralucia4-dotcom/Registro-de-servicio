import { useState, useEffect } from 'react';
import { getActivitiesByMonth, deleteActivity } from '../utils/storage';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit2, Trash2, Download, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function History({ profile, onEdit, onExport }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState([]);

  const loadActivities = () => {
    const data = getActivitiesByMonth(currentDate.getFullYear(), currentDate.getMonth(), profile.id);
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setActivities(data);
  };

  useEffect(() => {
    loadActivities();
  }, [currentDate, profile.id]);

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      deleteActivity(id);
      loadActivities();
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getFacetName = (f) => {
    const facets = {
      casa_en_casa: 'Casa en casa',
      publica: 'Pública (Carritos)',
      informal: 'Informal',
      cartas: 'Cartas / Teléfono'
    };
    return facets[f] || f;
  };

  // Totales del mes en el historial
  let totalHours = 0;
  activities.forEach(a => totalHours += Number(a.hours || 0));

  return (
    <div className="page">
      <div className="flex-between mb-3">
        <h2 style={{ margin: 0, fontSize: '1.35rem' }}>Historial de Actividad</h2>
        <div className="flex-center gap-2">
          <button 
            className="btn btn-subtle-purple" 
            style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }} 
            onClick={() => onExport(currentDate)}
          >
            <Download size={16} /> Exportar PDF
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Selector de mes */}
      <div className="card flex-between" style={{ padding: '0.85rem 1rem', marginBottom: '0.85rem' }}>
        <button 
          className="btn-secondary btn-icon" 
          onClick={prevMonth}
          title="Mes anterior"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, textTransform: 'capitalize', fontSize: '1.05rem', color: 'var(--primary)' }}>
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h3>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            {activities.length} {activities.length === 1 ? 'registro' : 'registros'} • {totalHours} hrs
          </span>
        </div>
        <button 
          className="btn-secondary btn-icon" 
          onClick={nextMonth}
          title="Mes siguiente"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Lista de actividades */}
      {activities.length === 0 ? (
        <div className="card text-center text-muted" style={{ padding: '2.5rem 1rem' }}>
          <Calendar size={36} color="var(--primary-light)" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ fontWeight: 600 }}>No hay actividades registradas en este mes.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Toca "Registrar" para añadir un día de predicación.</p>
        </div>
      ) : (
        <div className="activities-list">
          {activities.map(act => (
            <div key={act.id} className="card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
              <div className="flex-between" style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)', textTransform: 'capitalize' }}>
                  {format(parseISO(act.date), 'EEEE, dd MMMM', { locale: es })}
                </strong>
                <span className="profile-badge">
                  {getFacetName(act.facet)}
                </span>
              </div>
              
              <div className="stat-grid" style={{ gap: '0.5rem', marginTop: '0.5rem' }}>
                {act.hours && (
                  <div style={{ fontSize: '0.85rem' }}>
                    <span className="text-muted">Horas: </span> 
                    <strong style={{ color: 'var(--primary)' }}>{act.hours}h</strong>
                  </div>
                )}
                {act.placements && (
                  <div style={{ fontSize: '0.85rem' }}>
                    <span className="text-muted">Publicaciones: </span> 
                    <strong>{act.placements}</strong>
                  </div>
                )}
                {act.visits && (
                  <div style={{ fontSize: '0.85rem' }}>
                    <span className="text-muted">Revisitas: </span> 
                    <strong>{act.visits}</strong>
                  </div>
                )}
                {act.studies && (
                  <div style={{ fontSize: '0.85rem' }}>
                    <span className="text-muted">Cursos: </span> 
                    <strong>{act.studies}</strong>
                  </div>
                )}
              </div>

              {act.notes && (
                <div style={{ marginTop: '0.65rem', fontSize: '0.82rem', background: 'var(--input-bg)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  {act.notes}
                </div>
              )}

              <div className="flex-between mt-3 gap-2">
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '48%', padding: '0.45rem', fontSize: '0.85rem' }} 
                  onClick={() => onEdit(act.id)}
                >
                  <Edit2 size={15} /> Editar
                </button>
                <button 
                  className="btn btn-danger" 
                  style={{ width: '48%', padding: '0.45rem', fontSize: '0.85rem' }} 
                  onClick={() => handleDelete(act.id)}
                >
                  <Trash2 size={15} /> Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
