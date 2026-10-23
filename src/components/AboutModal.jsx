import { useState } from 'react';
import { getAuthorName, saveAuthorName } from '../utils/storage';
import { X, Heart, Sparkles, BookOpen, ShieldCheck, FileText, Edit3, Check } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  const [authorName, setAuthorName] = useState(getAuthorName());
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const [tempAuthor, setTempAuthor] = useState(authorName);

  if (!isOpen) return null;

  const handleSaveAuthor = (e) => {
    e.preventDefault();
    if (tempAuthor.trim()) {
      saveAuthorName(tempAuthor);
      setAuthorName(tempAuthor.trim());
      setIsEditingAuthor(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Cabecera del modal */}
        {/* Banner del Logo Oficial */}
        <img 
          src="/logo.jpg" 
          alt="Registro de Servicio" 
          className="app-logo-hero"
        />

        {/* Cabecera del modal */}
        <div className="flex-between mb-3">
          <div className="flex-center gap-2">
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>Registro de Servicio</h2>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>Versión 1.2 • Aplicación Personal</span>
            </div>
          </div>
          <button 
            className="btn-secondary btn-icon" 
            onClick={onClose} 
            title="Cerrar"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Sección: ¿De qué se trata la aplicación? */}
        <div className="card card-gradient-purple mb-3" style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)' }}>
            <Sparkles size={16} /> ¿De qué se trata esta app?
          </h3>
          <p style={{ fontSize: '0.86rem', lineHeight: 1.55, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
            Esta aplicación está diseñada para ayudarte a llevar un <strong>control personal, ágil y ordenado</strong> de tu actividad de predicación cada mes desde tu celular.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <Check size={14} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span><strong>Se adapta a tu asignación:</strong> Publicador(a) o Precursor(a) con metas de 15h, 30h, 50h y 600h anuales.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <FileText size={14} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span><strong>Informe oficial inteligente:</strong> Exporta directamente sobre la plantilla oficial en PDF trasladando solo los datos necesarios.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
              <ShieldCheck size={14} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span><strong>100% Privado y Seguro:</strong> Todos tus registros se guardan únicamente dentro de este dispositivo sin requerir internet.</span>
            </div>
          </div>
        </div>

        {/* Sección: Autoría de la app */}
        <div className="card" style={{ padding: '1rem', background: 'var(--input-bg)', borderColor: 'var(--primary-light)' }}>
          <div className="flex-between">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Autoría y Creación
            </span>
            {!isEditingAuthor && (
              <button 
                type="button" 
                onClick={() => { setTempAuthor(authorName); setIsEditingAuthor(true); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
              >
                <Edit3 size={13} /> Editar nombre
              </button>
            )}
          </div>

          {!isEditingAuthor ? (
            <div className="mt-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <Heart size={18} fill="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Desarrollado y creado por:</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {authorName}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveAuthor} className="mt-2">
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>
                Tu nombre de autoría:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input 
                  type="text" 
                  value={tempAuthor} 
                  onChange={e => setTempAuthor(e.target.value)} 
                  placeholder="Ej. Sarit" 
                  autoFocus
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Botón de cierre */}
        <button 
          className="btn btn-primary mt-3" 
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
