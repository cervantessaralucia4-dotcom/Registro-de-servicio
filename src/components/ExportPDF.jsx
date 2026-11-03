import { useState, useEffect } from 'react';
import { getActivitiesByMonth, getRoleDetails } from '../utils/storage';
import { generateOfficialReportPdf } from '../utils/pdfGenerator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ThemeToggle from './ThemeToggle';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';

export default function ExportPDF({ profile, date, onBack }) {
  const [selectedDate, setSelectedDate] = useState(date || new Date());
  const [participated, setParticipated] = useState(false);
  const [studies, setStudies] = useState('');
  const [hours, setHours] = useState('');
  const [comments, setComments] = useState('');
  const [activityCount, setActivityCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const roleInfo = getRoleDetails(profile.role);
  const isPioneer = roleInfo.isPioneer;

  useEffect(() => {
    const acts = getActivitiesByMonth(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      profile.id
    );

    let totalHours = 0;
    let totalStudies = 0;

    acts.forEach(a => {
      totalHours += Number(a.hours || 0);
      totalStudies += Number(a.studies || 0);
    });

    const roundedHours = Math.round(totalHours * 10) / 10;
    const hasParticipated = acts.length > 0 || totalHours > 0 || totalStudies > 0;

    setActivityCount(acts.length);
    setParticipated(hasParticipated);
    setStudies(totalStudies > 0 ? String(totalStudies) : '');

    // Regla oficial S-4-S:
    // - Si es Publicador(a), la casilla de Horas se deja en blanco.
    // - Si es Precursor(a) (auxiliar 15h/30h, regular 50h o precursor), se llenan las horas.
    if (isPioneer) {
      setHours(roundedHours > 0 ? String(roundedHours) : '0');
    } else {
      setHours('');
    }

    // Comentario sugerido según meta de precursor auxiliar
    if (profile.role === 'auxiliary_15') {
      setComments('Precursorado auxiliar (meta de 15 horas)');
    } else if (profile.role === 'auxiliary_30') {
      setComments('Precursorado auxiliar (meta de 30 horas)');
    } else {
      setComments('');
    }
  }, [selectedDate, profile, isPioneer]);

  const rawMonthStr = format(selectedDate, 'MMMM yyyy', { locale: es });
  const formattedMonth = rawMonthStr.charAt(0).toUpperCase() + rawMonthStr.slice(1);

  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateOfficialReportPdf({
        name: profile.name,
        month: formattedMonth,
        participated,
        studies: studies && Number(studies) > 0 ? studies : '',
        hours: isPioneer ? hours : '',
        comments
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Informe_${profile.name.replace(/\s+/g, '_')}_${format(selectedDate, 'yyyy_MM')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Ocurrió un error al generar el informe en PDF.');
    }
    setIsGenerating(false);
  };

  const handleSharePdf = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateOfficialReportPdf({
        name: profile.name,
        month: formattedMonth,
        participated,
        studies: studies && Number(studies) > 0 ? studies : '',
        hours: isPioneer ? hours : '',
        comments
      });

      const fileName = `Informe_${profile.name.replace(/\s+/g, '_')}_${format(selectedDate, 'yyyy_MM')}.pdf`;
      const file = new File([pdfBytes], fileName, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Informe de Predicación - ${formattedMonth}`,
          text: `Informe de predicación de ${profile.name} (${formattedMonth})`,
          files: [file]
        });
      } else {
        await handleDownloadPdf();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error al compartir PDF:', error);
      }
    }
    setIsGenerating(false);
  };

  return (
    <div className="page">
      {/* Cabecera */}
      <div className="flex-between mb-3">
        <div className="flex-center gap-2">
          <button 
            type="button" 
            className="btn-secondary btn-icon" 
            onClick={onBack}
            title="Volver"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', lineHeight: 1.2 }}>Informe Oficial PDF</h2>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              Formulario S-4-S integrado • Autocompletado
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Selector de mes del informe */}
      <div className="card flex-between" style={{ padding: '0.75rem 1rem', marginBottom: '0.85rem' }}>
        <button 
          type="button"
          className="btn-secondary btn-icon" 
          onClick={prevMonth}
          title="Mes anterior"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary)' }}>
            {formattedMonth}
          </h3>
          <span className="text-muted" style={{ fontSize: '0.74rem' }}>
            {activityCount} {activityCount === 1 ? 'actividad registrada' : 'actividades registradas'}
          </span>
        </div>
        <button 
          type="button"
          className="btn-secondary btn-icon" 
          onClick={nextMonth}
          title="Mes siguiente"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Aviso inteligente de llenado según rol */}
      <div className="card card-gradient-purple mb-3" style={{ padding: '0.9rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
          <Sparkles size={18} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '0.82rem', lineHeight: 1.45 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              Asignación: <span className="text-primary">{roleInfo.label}</span>
            </div>
            {isPioneer ? (
              <span className="text-muted">
                Como eres <strong>Precursor(a)</strong>{roleInfo.goal > 0 ? ` (meta de ${roleInfo.goal}h)` : ''}, el formulario incluye automáticamente tu casilla de participación, tus <strong>horas totales ({hours || 0}h)</strong> y cursos bíblicos.
              </span>
            ) : (
              <span className="text-muted">
                Como eres <strong>Publicador(a)</strong>, se marca tu participación en el ministerio y cursos bíblicos, dejando la casilla de <strong>Horas en blanco</strong> tal como indica el formulario S-4-S.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vista Previa Visual del Formulario Oficial S-4-S 11/23 */}
      <div className="s4-preview-wrapper mb-3">
        <div className="s4-sheet">
          <div className="s4-title">INFORME DE PREDICACIÓN</div>

          <div className="s4-field-line">
            <span className="s4-field-label">Nombre:</span>
            <span className="s4-field-value">{profile.name}</span>
          </div>

          <div className="s4-field-line">
            <span className="s4-field-label">Mes:</span>
            <span className="s4-field-value">{formattedMonth}</span>
          </div>

          {/* Tabla de 3 filas del S-4-S */}
          <div className="s4-table">
            {/* Fila 1 */}
            <div className="s4-row s4-row-1" onClick={() => setParticipated(!participated)} style={{ cursor: 'pointer' }}>
              <div className="s4-cell-text">
                Marque la casilla si participó en alguna faceta<br />
                de la predicación durante el mes
              </div>
              <div className="s4-cell-box-area">
                <div className={`s4-checkbox ${participated ? 'checked' : ''}`}>
                  {participated && '✓'}
                </div>
              </div>
            </div>

            {/* Fila 2 */}
            <div className="s4-row">
              <div className="s4-cell-text s4-border-right">
                Número de <em>diferentes</em> cursos bíblicos dirigidos
              </div>
              <div className="s4-cell-input">
                <input
                  type="number"
                  min="0"
                  value={studies}
                  onChange={e => setStudies(e.target.value)}
                  placeholder=""
                  aria-label="Número de diferentes cursos bíblicos dirigidos"
                />
              </div>
            </div>

            {/* Fila 3 */}
            <div className="s4-row">
              <div className="s4-cell-text s4-border-right">
                Horas (para precursores auxiliares, regulares<br />
                y especiales, o misioneros en el campo)
              </div>
              <div className="s4-cell-input">
                {isPioneer ? (
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                    aria-label="Horas"
                  />
                ) : (
                  <span className="s4-blank-indicator" title="En blanco para publicadores"></span>
                )}
              </div>
            </div>
          </div>

          {/* Recuadro de Comentarios */}
          <div className="s4-comments-box">
            <label className="s4-comments-label">Comentarios:</label>
            <textarea
              rows="2"
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Opcional: escribe aquí algún comentario si lo necesitas..."
            />
          </div>

          <div className="s4-footer">S-4-S &nbsp; 11/23</div>
        </div>
      </div>

      {/* Botones de Descarga y Compartir */}
      <button 
        type="button" 
        className="btn btn-primary" 
        onClick={handleDownloadPdf} 
        disabled={isGenerating}
      >
        <Download size={19} />
        <span>{isGenerating ? 'Generando PDF...' : 'Descargar Informe en PDF'}</span>
      </button>

      {typeof navigator !== 'undefined' && navigator.share && (
        <button 
          type="button" 
          className="btn btn-secondary mt-2" 
          onClick={handleSharePdf} 
          disabled={isGenerating}
        >
          <Share2 size={18} />
          <span>Compartir PDF por WhatsApp / Correo</span>
        </button>
      )}
    </div>
  );
}
