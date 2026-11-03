import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Genera el PDF oficial "INFORME DE PREDICACIÓN" (S-4-S 11/23)
 * internamente en la aplicación sin necesidad de que el usuario suba plantillas.
 *
 * @param {Object} data
 * @param {string} data.name - Nombre del publicador o precursor
 * @param {string} data.month - Mes y año del informe (ej. "Noviembre 2026")
 * @param {boolean} data.participated - Si participó en alguna faceta durante el mes
 * @param {string|number} data.studies - Número de diferentes cursos bíblicos dirigidos
 * @param {string|number} data.hours - Horas (solo para precursores; vacío para publicadores)
 * @param {string} data.comments - Comentarios adicionales opcionales
 * @returns {Promise<Uint8Array>} Bytes del documento PDF listo para descargar o compartir
 */
export async function generateOfficialReportPdf({
  name = '',
  month = '',
  participated = false,
  studies = '',
  hours = '',
  comments = ''
}) {
  const pdfDoc = await PDFDocument.create();
  // Proporción exacta de la hojita oficial S-4-S (horizontal)
  const page = pdfDoc.addPage([540, 375]);

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const black = rgb(0.05, 0.05, 0.05);
  const darkBlue = rgb(0.08, 0.12, 0.28);

  const xLeft = 36;
  const xRight = 504;
  const tableWidth = xRight - xLeft; // 468
  const xDivider = 426; // Columna derecha para números

  // 1. Título centrado: INFORME DE PREDICACIÓN
  const titleText = 'INFORME DE PREDICACIÓN';
  const titleSize = 16.5;
  const titleWidth = fontBold.widthOfTextAtSize(titleText, titleSize);
  page.drawText(titleText, {
    x: (540 - titleWidth) / 2,
    y: 332,
    size: titleSize,
    font: fontBold,
    color: black
  });

  // Helper para dibujar línea punteada
  const drawDottedLine = (startX, endX, y) => {
    const dotSpacing = 3.6;
    for (let x = startX; x <= endX; x += dotSpacing) {
      page.drawCircle({
        x,
        y: y + 1,
        size: 0.55,
        color: black
      });
    }
  };

  // 2. Campo: Nombre
  const nameLabel = 'Nombre:';
  page.drawText(nameLabel, {
    x: xLeft + 2,
    y: 292,
    size: 13,
    font: fontBold,
    color: black
  });
  drawDottedLine(xLeft + 62, xRight, 292);

  if (name && String(name).trim()) {
    page.drawText(String(name).trim(), {
      x: xLeft + 68,
      y: 294,
      size: 12.5,
      font: fontRegular,
      color: darkBlue
    });
  }

  // 3. Campo: Mes
  const monthLabel = 'Mes:';
  page.drawText(monthLabel, {
    x: xLeft + 2,
    y: 264,
    size: 13,
    font: fontBold,
    color: black
  });
  drawDottedLine(xLeft + 38, xRight, 264);

  if (month && String(month).trim()) {
    page.drawText(String(month).trim(), {
      x: xLeft + 46,
      y: 266,
      size: 12.5,
      font: fontRegular,
      color: darkBlue
    });
  }

  // 4. Tabla principal (3 filas)
  const yTableTop = 240;
  const yRow1Bottom = 186; // Fila 1: Casilla de participación (alto 54)
  const yRow2Bottom = 152; // Fila 2: Cursos bíblicos (alto 34)
  const yRow3Bottom = 98;  // Fila 3: Horas (alto 54)

  // Contorno exterior de la tabla principal
  page.drawRectangle({
    x: xLeft,
    y: yRow3Bottom,
    width: tableWidth,
    height: yTableTop - yRow3Bottom,
    borderColor: black,
    borderWidth: 1
  });

  // Líneas horizontales divisorias de filas
  page.drawLine({
    start: { x: xLeft, y: yRow1Bottom },
    end: { x: xRight, y: yRow1Bottom },
    thickness: 0.9,
    color: black
  });

  page.drawLine({
    start: { x: xLeft, y: yRow2Bottom },
    end: { x: xRight, y: yRow2Bottom },
    thickness: 0.9,
    color: black
  });

  // Línea vertical divisoria (solo en filas 2 y 3, igual al formulario oficial S-4-S)
  page.drawLine({
    start: { x: xDivider, y: yRow1Bottom },
    end: { x: xDivider, y: yRow3Bottom },
    thickness: 0.9,
    color: black
  });

  // --- Texto y Casilla de la Fila 1 ---
  page.drawText('Marque la casilla si participó en alguna faceta', {
    x: xLeft + 9,
    y: 217,
    size: 12.5,
    font: fontRegular,
    color: black
  });
  page.drawText('de la predicación durante el mes', {
    x: xLeft + 9,
    y: 199,
    size: 12.5,
    font: fontRegular,
    color: black
  });

  // Casilla cuadrada en la Fila 1 (centrada respecto a la columna derecha)
  const boxSize = 23;
  const boxX = xDivider + (xRight - xDivider - boxSize) / 2;
  const boxY = yRow1Bottom + (yTableTop - yRow1Bottom - boxSize) / 2;

  page.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxSize,
    height: boxSize,
    borderColor: black,
    borderWidth: 1
  });

  if (participated) {
    // Dibuja un check vectorial nítido dentro de la casilla
    page.drawLine({
      start: { x: boxX + 4.5, y: boxY + 11.5 },
      end: { x: boxX + 9.8, y: boxY + 5.5 },
      thickness: 2.2,
      color: darkBlue
    });
    page.drawLine({
      start: { x: boxX + 9.2, y: boxY + 5.5 },
      end: { x: boxX + 18.8, y: boxY + 17.5 },
      thickness: 2.2,
      color: darkBlue
    });
  }

  // --- Texto y Valor de la Fila 2 (Número de diferentes cursos bíblicos dirigidos) ---
  const row2TextY = 164;
  const p1 = 'Número de ';
  const p2 = 'diferentes';
  const p3 = ' cursos bíblicos dirigidos';
  const fSize = 12.5;

  let curX = xLeft + 9;
  page.drawText(p1, { x: curX, y: row2TextY, size: fSize, font: fontRegular, color: black });
  curX += fontRegular.widthOfTextAtSize(p1, fSize);

  page.drawText(p2, { x: curX, y: row2TextY, size: fSize, font: fontItalic, color: black });
  curX += fontItalic.widthOfTextAtSize(p2, fSize);

  page.drawText(p3, { x: curX, y: row2TextY, size: fSize, font: fontRegular, color: black });

  const studiesStr = studies !== null && studies !== undefined && String(studies).trim() !== '' && Number(studies) > 0
    ? String(studies).trim()
    : '';

  if (studiesStr) {
    const valWidth = fontBold.widthOfTextAtSize(studiesStr, 13.5);
    page.drawText(studiesStr, {
      x: xDivider + (xRight - xDivider - valWidth) / 2,
      y: 163.5,
      size: 13.5,
      font: fontBold,
      color: darkBlue
    });
  }

  // --- Texto y Valor de la Fila 3 (Horas) ---
  page.drawText('Horas (para precursores auxiliares, regulares', {
    x: xLeft + 9,
    y: 129,
    size: 12.5,
    font: fontRegular,
    color: black
  });
  page.drawText('y especiales, o misioneros en el campo)', {
    x: xLeft + 9,
    y: 111,
    size: 12.5,
    font: fontRegular,
    color: black
  });

  const hoursStr = hours !== null && hours !== undefined && String(hours).trim() !== ''
    ? String(hours).trim()
    : '';

  if (hoursStr) {
    const valWidth = fontBold.widthOfTextAtSize(hoursStr, 14);
    page.drawText(hoursStr, {
      x: xDivider + (xRight - xDivider - valWidth) / 2,
      y: 119.5,
      size: 14,
      font: fontBold,
      color: darkBlue
    });
  }

  // 5. Recuadro de Comentarios
  const yCommentsTop = 83;
  const yCommentsBottom = 32;

  page.drawRectangle({
    x: xLeft,
    y: yCommentsBottom,
    width: tableWidth,
    height: yCommentsTop - yCommentsBottom,
    borderColor: black,
    borderWidth: 1
  });

  page.drawText('Comentarios:', {
    x: xLeft + 9,
    y: 65,
    size: 12.5,
    font: fontRegular,
    color: black
  });

  if (comments && String(comments).trim()) {
    const cleanComments = String(comments).trim().replace(/\r?\n/g, ' ');
    const maxLine1Chars = 54;
    const line1 = cleanComments.slice(0, maxLine1Chars);
    const line2 = cleanComments.slice(maxLine1Chars, maxLine1Chars + 70);

    page.drawText(line1, {
      x: xLeft + 90,
      y: 65,
      size: 11,
      font: fontRegular,
      color: darkBlue
    });

    if (line2) {
      page.drawText(line2, {
        x: xLeft + 9,
        y: 44,
        size: 11,
        font: fontRegular,
        color: darkBlue
      });
    }
  }

  // 6. Pie de página oficial: S-4-S 11/23
  page.drawText('S-4-S   11/23', {
    x: xLeft,
    y: 14,
    size: 9.5,
    font: fontRegular,
    color: black
  });

  return await pdfDoc.save();
}

