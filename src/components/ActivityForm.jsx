import { useState, useEffect } from 'react';
import { saveActivity, getActivities, getRoleDetails } from '../utils/storage';
import { format } from 'date-fns';
import ThemeToggle from './ThemeToggle';
import { ArrowLeft, Clock, Calendar, Check } from 'lucide-react';

export default function ActivityForm({ profile, activityId, onFinished }) {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    hours: '',
    facet: 'casa_en_casa',
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
      if (act) setFormData(act);
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
    saveActivity(formData, profile.id);
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
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
            {activityId ? 'Editar Actividad' : 'Nueva Actividad'}
          </h2>
        </div>
        <ThemeToggle />
      </div>
      
      <div className="card card-gradient-purple">
        <form onSubmit={handleSubmit}>
          {/* Fecha */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="var(--primary)" /> Fecha de la actividad
            </label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          {/* Faceta de predicación */}
          <div className="form-group">
            <label>Faceta de predicación</label>
            <select name="facet" value={formData.facet} onChange={handleChange}>
              <option value="casa_en_casa">Casa en casa</option>
              <option value="publica">Pública (Carritos / Mesas)</option>
              <option value="informal">Predicación informal</option>
              <option value="cartas">Cartas / Por teléfono</option>
            </select>
          </div>

          {/* Horario de inicio y fin */}
          <div className="stat-grid" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={15} color="var(--primary)" /> Inicio
              </label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleTimeChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={15} color="var(--primary)" /> Fin
              </label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleTimeChange} />
            </div>
          </div>

          {/* Horas realizadas */}
          <div className="form-group">
            <label>
              Horas realizadas {!isPioneer && <span className="text-muted">(Opcional para publicadores)</span>}
            </label>
            <input 
              type="number" 
              step="0.1" 
              min="0" 
              name="hours" 
              value={formData.hours} 
              onChange={handleChange} 
              placeholder={isPioneer ? "Ej. 2 o se calcula con inicio/fin" : "Opcional"}
              required={isPioneer} 
            />
          </div>

          {/* Publicaciones */}
          <div className="form-group">
            <label>Publicaciones colocadas (Revistas, folletos, libros)</label>
            <input type="number" min="0" name="placements" value={formData.placements} onChange={handleChange} placeholder="0" />
          </div>

          {/* Revisitas y Cursos */}
          <div className="stat-grid" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Revisitas</label>
              <input type="number" min="0" name="visits" value={formData.visits} onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Cursos Bíblicos</label>
              <input type="number" min="0" name="studies" value={formData.studies} onChange={handleChange} placeholder="0" />
            </div>
          </div>

          {/* Notas */}
          <div className="form-group">
            <label>Notas u observaciones adicionales</label>
            <textarea 
              name="notes" 
              rows="3" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="Direcciones de personas que mostraron interés, textos bíblicos considerados, etc..."
            ></textarea>
          </div>

          <div className="flex-between mt-4 gap-2">
            <button type="button" className="btn btn-secondary" style={{ width: '45%' }} onClick={onFinished}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: '55%' }}>
              <Check size={18} /> Guardar Actividad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
