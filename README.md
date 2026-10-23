# 📖 Registro de Servicio

<p align="center">
  <img src="public/logo.jpg" alt="Logo Registro de Servicio" width="220" style="border-radius: 20px; box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3);" />
</p>

<p align="center">
  <strong>Aplicación web moderna, personal y privada para el registro diario y reporte mensual de la actividad ministerial.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19+-8b5cf6?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Fast-9333ea?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Privacidad-100%25_Local-10b981?style=for-the-badge&logo=shield&logoColor=white" alt="Privacidad" />
  <img src="https://img.shields.io/badge/Tema-Claro%20%7C%20Oscuro-7c3aed?style=for-the-badge" alt="Temas" />
</p>

---

## 🌟 ¿De qué se trata la aplicación?

**Registro de Servicio** es una herramienta pensada especialmente para llevar un control personal, cómodo, ágil y organizado de la predicación mes a mes desde el celular o la computadora.

Diferencia de forma inteligente entre los **datos de control personal** (notas, horarios detallados, revisitas, publicaciones, facetas) y los **datos oficiales requeridos** para el informe de congregación, permitiendo exportar directamente sobre la plantilla oficial en PDF sin complicaciones.

---

## 🚀 Características Clave

### 👥 1. Soporte Multi-Perfil y Asignaciones
* **Múltiples perfiles en un mismo dispositivo:** Permite crear diferentes usuarios para que varios miembros de la familia lleven sus registros de manera totalmente independiente.
* **Adaptación según la condición de servicio:**
  * **Publicador / Publicadora:** El registro de horas es opcional y no se exige en el informe; permite registrar la participación en el ministerio y los cursos bíblicos.
  * **Precursor(a):** Categoría general de precursorado.
  * **Precursor(a) auxiliar 15 horas:** Control mensual con barra de progreso en vivo hacia la meta de 15 horas.
  * **Precursor(a) auxiliar 30 horas:** Control mensual con barra de progreso en vivo hacia la meta de 30 horas.
  * **Precursor(a) regular 50 horas:** Control mensual de 50 horas más **seguimiento automático del año de servicio (meta de 600 horas anuales)** calculado de septiembre a agosto.

---

### 📝 2. Registro Rápido de Actividad Diaria
* **Cálculo automático de horas:** Ingresa la hora de inicio y de fin, y la aplicación calcula automáticamente las horas realizadas (también permite ingreso manual).
* **Facetas de predicación:**
  * Casa en casa
  * Pública (Carritos / Mesas)
  * Informal
  * Cartas / Por teléfono
* **Estadísticas detalladas:** Registro de publicaciones colocadas (revistas, folletos, libros), revisitas y cursos bíblicos.
* **Notas y observaciones:** Espacio para anotar nombres, direcciones de personas interesadas o textos bíblicos considerados.

---

### 📅 3. Historial y Resumen Mensual
* **Navegación mes a mes:** Consulta y revisa las actividades de meses anteriores y del mes en curso.
* **Modificación y eliminación:** Posibilidad de editar o corregir cualquier entrada en cualquier momento.
* **Cálculo automático de totales:** Visualiza en el panel principal las horas totales, cursos, revisitas y publicaciones acumuladas del mes.

---

### 📄 4. Exportación Inteligente a PDF Oficial
* **Uso de plantilla oficial rellenable:** Permite cargar la plantilla PDF oficial (por ejemplo, el formato S-4).
* **Mapeo configurable de campos:** La aplicación detecta automáticamente los campos del formulario del PDF y te permite enlazar qué dato va en cada casilla.
* **Privacidad entre lo personal y lo oficial:** Tus datos personales permanecen en tu historial; al PDF solo se transfieren los campos que decidas mapear.

---

### 🎨 5. Diseño Visual de Primera Calidad (UI/UX)
* **Paleta de Colores Morados:** Diseñada con una gama de violetas y púrpuras modernos, inspirada en el logotipo oficial.
* **Modo Claro / Modo Oscuro:** Botón interactivo (☀️ / 🌙) para cambiar al instante entre ambos modos según tu preferencia.
* **Mobile-First:** Interfaz táctil ergonómica con barra de navegación inferior, tarjetas con esquinas redondeadas y micro-animaciones suaves.
* **🔒 100% Privado y Seguro:** Todo se guarda en el almacenamiento local (`localStorage`) del navegador. No se envían datos a servidores externos y funciona sin conexión a internet.

---

## 🛠️ Tecnologías Utilizadas

* **[React 19](https://react.dev/):** Interfaz declarativa, modular y reactiva.
* **[Vite](https://vitejs.dev/):** Entorno de desarrollo ultra rápido y empaquetador moderno.
* **[Lucide React](https://lucide.dev/):** Iconografía limpia y consistente.
* **[PDF-Lib](https://pdf-lib.js.org/):** Lectura, detección de campos y llenado interactivo de formularios PDF.
* **[Date-fns](https://date-fns.org/):** Manejo, formateo y cálculo de fechas y meses en español.
* **CSS3 Vanilla:** Variables CSS dinámicas, glassmorphism y diseño responsivo para móviles.

---

## 📁 Estructura del Proyecto

```text
App_Jw/
├── public/
│   ├── logo.jpg               # Logotipo oficial de la aplicación
│   └── favicon.svg            # Favicon para navegadores
├── src/
│   ├── assets/                # Recursos estáticos
│   ├── components/
│   │   ├── AboutModal.jsx     # Ventana informativa y créditos de autoría
│   │   ├── ActivityForm.jsx   # Formulario de registro de actividad diaria
│   │   ├── Dashboard.jsx      # Panel de inicio con metas y estadísticas
│   │   ├── ExportPDF.jsx      # Motor de mapeo y exportación a PDF oficial
│   │   ├── History.jsx        # Historial mensual y edición de registros
│   │   ├── Navigation.jsx     # Barra de navegación inferior móvil
│   │   ├── ProfileManager.jsx # Pantalla de bienvenida, selección y creación de perfiles
│   │   ├── ProfileSetup.jsx   # Componente de configuración de perfiles
│   │   └── ThemeToggle.jsx    # Botón de alternancia de tema claro/oscuro
│   ├── utils/
│   │   └── storage.js         # Capa de almacenamiento local multiperfil y lógica teocrática
│   ├── App.jsx                # Enrutador principal de vistas y gestión de estado
│   ├── index.css              # Sistema de diseño con paleta morada y temas
│   └── main.jsx               # Punto de entrada de la aplicación
├── index.html                 # Plantilla HTML con metadata e icono
├── package.json               # Dependencias del proyecto
└── README.md                  # Documentación del proyecto
```

---

## 💻 Instalación y Ejecución Local

Si deseas correr la aplicación en tu computadora localmente:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/cervantessaralucia4-dotcom/Registro-de-servicio.git
   cd Registro-de-servicio
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador en:**
   `http://localhost:5173/`

---

## 👤 Autoría y Créditos

* **Creado y Desarrollado por:** **Sarit** ([Sara Cervantes](https://github.com/cervantessaralucia4-dotcom))
* **Diseño del Logotipo:** Registro de Servicio

---

<p align="center">
  Hecho con 💜 para facilitar y organizar el servicio del reino.
</p>
