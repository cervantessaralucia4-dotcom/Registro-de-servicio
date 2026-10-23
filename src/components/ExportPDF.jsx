import { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { getPdfTemplate, savePdfTemplate, getPdfMapping, savePdfMapping, getActivitiesByMonth } from '../utils/storage';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ExportPDF({ profile, date, onBack }) {
  const [pdfTemplate, setPdfTemplate] = useState(getPdfTemplate() || null);
  const [fields, setFields] = useState([]);
  const [mapping, setMapping] = useState(getPdfMapping() || {});
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (pdfTemplate) {
      loadPdfFields(pdfTemplate);
    }
  }, [pdfTemplate]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setPdfTemplate(base64);
        savePdfTemplate(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadPdfFields = async (base64Str) => {
    try {
      const existingPdfBytes = await fetch(base64Str).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      const pdfFields = form.getFields();
      
      const fieldData = pdfFields.map(f => ({
        name: f.getName(),
        type: f.constructor.name
      }));
      setFields(fieldData);
    } catch (e) {
      console.error("Error loading PDF fields", e);
      alert("El PDF no parece tener un formulario rellenable válido.");
    }
  };

  const handleMappingChange = (pdfFieldName, appDataName) => {
    const newMapping = { ...mapping, [pdfFieldName]: appDataName };
    setMapping(newMapping);
    savePdfMapping(newMapping);
  };

  const generatePdf = async () => {
    if (!pdfTemplate) return;
    setIsGenerating(true);
    try {
      const activities = getActivitiesByMonth(date.getFullYear(), date.getMonth(), profile.id);
      let hours = 0, studies = 0, visits = 0, placements = 0;
      activities.forEach(a => {
        hours += Number(a.hours || 0);
        studies += Number(a.studies || 0);
        visits += Number(a.visits || 0);
        placements += Number(a.placements || 0);
      });

      const participated = activities.length > 0;

      const dataToFill = {
        name: profile.name,
        month: format(date, 'MMMM yyyy', { locale: es }),
        hours: profile.role === 'publisher' ? (hours > 0 ? hours.toString() : '') : hours.toString(),
        studies: studies > 0 ? studies.toString() : '',
        visits: visits > 0 ? visits.toString() : '',
        placements: placements > 0 ? placements.toString() : '',
        participated: participated ? 'Sí' : 'No',
        role: profile.role
      };

      const existingPdfBytes = await fetch(pdfTemplate).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();

      fields.forEach(f => {
        const mappedKey = mapping[f.name];
        if (mappedKey && dataToFill[mappedKey] !== undefined) {
          const field = form.getField(f.name);
          try {
            if (field.constructor.name === 'PDFTextField') {
              field.setText(dataToFill[mappedKey]);
            } else if (field.constructor.name === 'PDFCheckBox') {
               if (dataToFill[mappedKey] === 'Sí' || Number(dataToFill[mappedKey]) > 0) {
                   field.check();
               }
            }
          } catch (err) {
            console.error("Error setting field", f.name, err);
          }
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Informe_${profile.name.replace(/\s+/g, '_')}_${format(date, 'yyyy_MM')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Error al generar el PDF. Revisa la consola para más detalles.');
    }
    setIsGenerating(false);
  };

  const internalDataOptions = [
    { value: '', label: '-- No mapear (Dejar en blanco) --' },
    { value: 'name', label: 'Nombre del publicador' },
    { value: 'month', label: 'Mes y Año' },
    { value: 'hours', label: 'Horas (En blanco si es 0 y publicador)' },
    { value: 'studies', label: 'Cursos Bíblicos' },
    { value: 'visits', label: 'Revisitas' },
    { value: 'placements', label: 'Publicaciones impresas y electrónicas' },
    { value: 'participated', label: 'Participó en el ministerio (Sí/No, ideal para checkbox)' }
  ];

  return (
    <div className="page pb-8">
      <div className="flex-between mb-4">
        <h2>Exportar Informe</h2>
        <button className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem' }} onClick={onBack}>Volver</button>
      </div>

      <div className="card">
        <h3 className="mb-4">Plantilla Oficial (PDF)</h3>
        {!pdfTemplate ? (
          <div>
            <p className="text-muted mb-4 text-sm">
              Sube la plantilla oficial del informe (por ejemplo, el formulario en PDF rellenable). 
              La aplicación detectará los campos y rellenará solo los que tú le indiques.
            </p>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} />
          </div>
        ) : (
          <div>
            <p className="text-success mb-4 font-bold">Plantilla PDF cargada correctamente.</p>
            <button className="btn btn-secondary mb-4 text-sm" style={{ padding: '0.5rem 1rem' }} onClick={() => setPdfTemplate(null)}>
              Cambiar plantilla
            </button>
            
            {fields.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-4">Mapeo de campos</h3>
                <p className="text-muted mb-4 text-sm">
                  Relaciona cada campo detectado en el PDF con los datos de tu aplicación. 
                  Solo se llenarán los campos que selecciones. Si en la plantilla oficial no hay campo de horas (por ejemplo, para publicadores), simplemente déjalo sin mapear.
                </p>
                {fields.map(f => (
                  <div key={f.name} className="form-group mb-4" style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
                    <label style={{ color: 'var(--primary-dark)' }}>Campo en el PDF: <strong>{f.name}</strong></label>
                    <select 
                      value={mapping[f.name] || ''} 
                      onChange={(e) => handleMappingChange(f.name, e.target.value)}
                    >
                      {internalDataOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <button className="btn btn-primary mt-4" onClick={generatePdf} disabled={isGenerating}>
                  {isGenerating ? 'Generando PDF...' : 'Generar y Descargar PDF'}
                </button>
              </div>
            )}
            {fields.length === 0 && (
               <p className="text-danger mt-4">No se detectaron campos de formulario rellenables en este PDF.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
