import { useState } from 'react';
import { saveProfile } from '../utils/storage';

export default function ProfileSetup({ onSave, initialProfile, onCancel }) {
  const [name, setName] = useState(initialProfile?.name || '');
  const [role, setRole] = useState(initialProfile?.role || 'publisher'); // publisher, auxiliary_15, auxiliary_30, regular

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const profile = { name: name.trim(), role };
    saveProfile(profile);
    onSave(profile);
  };

  const isEditing = Boolean(initialProfile);

  return (
    <div className="page flex-center" style={{ minHeight: isEditing ? 'auto' : '100vh', paddingBottom: 0 }}>
      <div className="card" style={{ width: '100%' }}>
        <h1 className="text-center">{isEditing ? 'Editar Perfil' : 'Bienvenido'}</h1>
        <p className="text-muted text-center mb-4">
          {isEditing 
            ? 'Actualiza tu nombre o tu asignación de servicio.' 
            : 'Configura tu perfil para empezar a registrar tu actividad.'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tu Nombre</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ej. Juan Pérez" 
              required
            />
          </div>
          
          <div className="form-group">
            <label>Selecciona tu asignación</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="publisher">Publicador(a)</option>
              <option value="auxiliary_15">Precursor(a) Auxiliar (Meta: 15 hrs)</option>
              <option value="auxiliary_30">Precursor(a) Auxiliar (Meta: 30 hrs)</option>
              <option value="regular">Precursor(a) Regular (Meta: 50 hrs mensuales / 600 anuales)</option>
            </select>
          </div>
          
          <div className="flex-between mt-4" style={{ gap: '0.75rem' }}>
            {isEditing && (
              <button type="button" className="btn btn-secondary" style={{ width: '50%' }} onClick={onCancel}>
                Cancelar
              </button>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: isEditing ? '50%' : '100%' }}>
              {isEditing ? 'Guardar Cambios' : 'Comenzar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
