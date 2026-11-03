import { useState, useEffect } from 'react';
import { saveActivity, getActivities, getRoleDetails } from '../utils/storage';
import { format } from 'date-fns';
import ThemeToggle from './ThemeToggle';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Check, 
  Compass, 
  BookOpen, 
  Users, 
  Video, 
  FileText, 
  PenTool 
} from 'lucide-react';

export default function ActivityForm({ profile, activityId, onFinished }) {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    hours: '',
    facet: 'casa_en_casa',
    customFacet: '',
    studies: '',
    visits: '',
    placements: '',
    notes: ''
  });

  const roleInfo = getRoleDetails(profile.role);
  const isPioneer = roleInfo.isPioneer;

  useEffect(() => {
    if (activityId) {
      const activities = getActivities(profile.id);
      const act = activities.find(a => a.id === activityId);
      if (act) {
        setFormData({
          ...act,
          customFacet: act.customFacet || ''
        });
      }
    }
  }, [activityId, profile.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateHours = (start, end) => {
    if (!start || !end) return;
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    let diff = (endTime - startTime) / 1000 / 60 / 60;
    if (diff < 0) diff += 24;
    setFormData(prev => ({ ...prev, hours: diff.toFixed(1).replace('.0', '') }));
  };

  const handleTimeChange = (e) => {
    handleChange(e);
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    if (newFormData.startTime && newFormData.endTime) {
      calculateHours(newFormData.startTime, newFormData.endTime);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      customFacet: formData.facet === 'otros' ? (formData.customFacet || '').trim() : ''
    };
    saveActivity(cleanedData, profile.id);
    onFinished();
  };

  return (
    <div className="page">
      <div className="flex-between mb-3">
        <div className="flex-center gap-2">
          <button 
            type="button" 
            className="btn-secondary btn-icon" 
            onClick={onFinished}
            title="Volver"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', lineHeight: 1.2 }}>
              {activityId ? 'Editar Actividad' : 'Registrar Actividad'}
            </h2>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              {profile.name} • {roleInfo.label}
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>
      
      <div className="card card-gradient-purple form-card-container">
        <form onSubmit={handleSubmit} className="activity-form">
          {/* Fecha */}
          <div className="form-group">
            <label className="form-label-icon">
              <Calendar size={16} color="var(--primary)" />
              <span>Fecha de la actividad</span>
            </label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Faceta de predicación */}
          <div className="form-group">
            <label className="form-label-icon">
              <Compass size={16} color="var(--primary)" />
              <span>Faceta de predicación</span>
            </label>
            <select name="facet" value={formData.facet} onChange={handleChange}>
              <option value="casa_en_casa">Casa en casa</option>
              <option value="publica">Pública (Carritos / Mesas)</option>
              <option value="informal">Predicación informal</option>
              <option value="cartas">Cartas / Por teléfono</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          {/* Campo adicional cuando elige "Otros" */}
          {formData.facet === 'otros' && (
            <div className="form-group custom-facet-box">
              <label className="form-label-icon">
                <PenTool size={15} color="var(--primary)" />
                <span>¿Cuál faceta realizaste?</span>
              </label>
              <input 
                type="text" 
                name="customFacet" 
                value={formData.customFacet} 
                onChange={handleChange} 
                placeholder="Escribe cuál faceta (ej. Negocios, Zoom, etc.)" 
                required 
                autoFocus
              />
            </div>
          )}

          {/* Bloque de Horario y Horas */}
          <div className="form-section-box">
            <div className="form-row-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label-icon">
                  <Clock size={15} color="var(--primary)" />
                  <span>Hora inicio</span>
                </label>
                <input 
                  type="time" 
                  name="startTime" 
                  value={formData.startTime} 
                  onChange={handleTimeChange} 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label-icon">
                  <Clock size={15} color="var(--primary)" />
                  <span>Hora fin</span>
                </label>
                <input 
                  type="time" 
                  name="endTime" 
                  value={formData.endTime} 
                  onChange={handleTimeChange} 
                />
              </div>
            </div>

            {/* Horas realizadas */}
            <div className="form-group" style={{ marginTop: '0.85rem', marginBottom: 0 }}>
              <label className="form-label-icon" style={{ justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={15} color="var(--primary)" />
                  <span>Horas realizadas</span>
                </span>
                {!isPioneer && (
                  <span className="text-muted" style={{ fontSize: '0.73rem', fontWeight: 500 }}>
                    Opcional para publicadores
                  </span>
                )}
              </label>
              <input 
                type="number" 
                step="0.1" 
                min="0" 
                name="hours" 
                value={formData.hours} 
                onChange={handleChange} 
                placeholder={isPioneer ? "Ej. 2 (o usa hora de inicio y fin)" : "Opcional"}
                required={isPioneer} 
              />
            </div>
          </div>

          {/* Revisitas y Cursos Bíblicos */}
          <div className="form-row-grid" style={{ marginBottom: '0.9rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label-icon">
                <Users size={15} color="var(--success)" />
                <span>Revisitas</span>
              </label>
              <input 
                type="number" 
                min="0" 
                name="visits" 
                value={formData.visits} 
                onChange={handleChange} 
                placeholder="0" 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label-icon">
                <BookOpen size={15} color="var(--warning)" />
                <span>Cursos Bíblicos</span>
              </label>
              <input 
                type="number" 
                min="0" 
                name="studies" 
                value={formData.studies} 
                onChange={handleChange} 
                placeholder="0" 
              />
            </div>
          </div>

          {/* Publicaciones */}
          <div className="form-group">
            <label className="form-label-icon">
              <Video size={15} color="var(--accent-purple)" />
              <span>Publicaciones y videos (Opcional)</span>
            </label>
            <input 
              type="number" 
              min="0" 
              name="placements" 
              value={formData.placements} 
              onChange={handleChange} 
              placeholder="0" 
            />
          </div>

          {/* Notas */}
          <div className="form-group">
            <label className="form-label-icon">
              <FileText size={15} color="var(--primary)" />
              <span>Notas u observaciones</span>
            </label>
            <textarea 
              name="notes" 
              rows="3" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="Direcciones de personas que mostraron interés, textos bíblicos considerados, etc..."
            ></textarea>
          </div>

          <div className="form-actions-row mt-4">
            <button type="button" className="btn btn-secondary" onClick={onFinished}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} />
              <span>Guardar Actividad</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
