// LocalStorage handlers with multi-profile support
const PROFILES_KEY = 'jw_app_profiles';
const ACTIVE_PROFILE_ID_KEY = 'jw_app_active_profile_id';
const ACTIVITIES_KEY = 'jw_app_activities';
const PDF_TEMPLATE_KEY = 'jw_app_pdf_template';
const PDF_MAPPING_KEY = 'jw_app_pdf_mapping';
const THEME_KEY = 'jw_app_theme';

export const ROLE_OPTIONS = [
  { value: 'publisher', label: 'Publicador / Publicadora', goal: 0, isPioneer: false },
  { value: 'pioneer', label: 'Precursor(a)', goal: 0, isPioneer: true },
  { value: 'auxiliary_15', label: 'Precursor(a) auxiliar 15 horas', goal: 15, isPioneer: true },
  { value: 'auxiliary_30', label: 'Precursor(a) auxiliar 30 horas', goal: 30, isPioneer: true },
  { value: 'regular_50', label: 'Precursor(a) regular 50 horas', goal: 50, annualGoal: 600, isPioneer: true },
];

export const getRoleDetails = (roleValue) => {
  // Manejo de compatibilidad con 'regular' antiguo
  const normalizedValue = roleValue === 'regular' ? 'regular_50' : roleValue;
  const found = ROLE_OPTIONS.find(r => r.value === normalizedValue);
  return found || ROLE_OPTIONS[0];
};

// --- Perfiles ---
export const getProfiles = () => {
  const data = localStorage.getItem(PROFILES_KEY);
  let profiles = data ? JSON.parse(data) : [];

  // Migración desde el sistema anterior si existe 'jw_app_profile'
  if (profiles.length === 0) {
    const oldProfile = localStorage.getItem('jw_app_profile');
    if (oldProfile) {
      try {
        const parsed = JSON.parse(oldProfile);
        const migrated = {
          id: 'profile_' + Date.now(),
          name: parsed.name,
          role: parsed.role === 'regular' ? 'regular_50' : parsed.role,
          createdAt: new Date().toISOString()
        };
        profiles = [migrated];
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
        localStorage.setItem(ACTIVE_PROFILE_ID_KEY, migrated.id);

        // Migrar actividades antiguas sin profileId
        const oldActivities = localStorage.getItem(ACTIVITIES_KEY);
        if (oldActivities) {
          const acts = JSON.parse(oldActivities);
          const updatedActs = acts.map(a => ({ ...a, profileId: a.profileId || migrated.id }));
          localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updatedActs));
        }
      } catch (e) {
        console.error("Error al migrar perfil antiguo", e);
      }
    }
  }

  return profiles;
};

export const saveProfile = (profileData) => {
  const profiles = getProfiles();
  let updatedProfiles = [...profiles];
  let profileId = profileData.id;

  if (profileId) {
    const index = updatedProfiles.findIndex(p => p.id === profileId);
    if (index !== -1) {
      updatedProfiles[index] = { ...updatedProfiles[index], ...profileData };
    } else {
      updatedProfiles.push(profileData);
    }
  } else {
    profileId = 'profile_' + Date.now();
    const newProfile = {
      ...profileData,
      id: profileId,
      createdAt: new Date().toISOString()
    };
    updatedProfiles.push(newProfile);
  }

  localStorage.setItem(PROFILES_KEY, JSON.stringify(updatedProfiles));
  localStorage.setItem(ACTIVE_PROFILE_ID_KEY, profileId);
  return profileId;
};

export const deleteProfile = (profileId) => {
  const profiles = getProfiles().filter(p => p.id !== profileId);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));

  // Eliminar también actividades asociadas a este perfil
  const activities = getActivities().filter(a => a.profileId !== profileId);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));

  const activeId = getActiveProfileId();
  if (activeId === profileId) {
    localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
  }
};

export const getActiveProfileId = () => {
  return localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
};

export const setActiveProfileId = (profileId) => {
  if (profileId) {
    localStorage.setItem(ACTIVE_PROFILE_ID_KEY, profileId);
  } else {
    localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
  }
};

export const getActiveProfile = () => {
  const activeId = getActiveProfileId();
  const profiles = getProfiles();
  if (!activeId) return null;
  return profiles.find(p => p.id === activeId) || null;
};

// --- Actividades por Perfil ---
export const getActivities = (profileId) => {
  const data = localStorage.getItem(ACTIVITIES_KEY);
  const all = data ? JSON.parse(data) : [];
  if (!profileId) return all;
  return all.filter(a => a.profileId === profileId);
};

export const saveActivity = (activity, profileId) => {
  const allActivities = getActivities();
  const targetProfileId = profileId || activity.profileId || getActiveProfileId();

  if (activity.id) {
    const index = allActivities.findIndex(a => a.id === activity.id);
    if (index !== -1) {
      allActivities[index] = { ...activity, profileId: targetProfileId };
    } else {
      allActivities.push({ ...activity, profileId: targetProfileId });
    }
  } else {
    allActivities.push({
      ...activity,
      id: Date.now().toString(),
      profileId: targetProfileId
    });
  }
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(allActivities));
};

export const deleteActivity = (id) => {
  const activities = getActivities();
  const filtered = activities.filter(a => a.id !== id);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(filtered));
};

export const getActivitiesByMonth = (year, month, profileId) => {
  const targetId = profileId || getActiveProfileId();
  const activities = getActivities(targetId);
  return activities.filter(a => {
    const date = new Date(a.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
};

export const getServiceYearActivities = (profileId) => {
  const targetId = profileId || getActiveProfileId();
  const now = new Date();
  const activities = getActivities(targetId);
  let startYear = now.getFullYear();
  // El año de servicio comienza en septiembre (mes 8, índice 0)
  if (now.getMonth() < 8) {
    startYear -= 1;
  }
  const startDate = new Date(startYear, 8, 1);
  return activities.filter(a => new Date(a.date) >= startDate);
};

// --- Plantillas PDF ---
export const savePdfTemplate = (base64) => localStorage.setItem(PDF_TEMPLATE_KEY, base64);
export const getPdfTemplate = () => localStorage.getItem(PDF_TEMPLATE_KEY);
export const savePdfMapping = (mapping) => localStorage.setItem(PDF_MAPPING_KEY, JSON.stringify(mapping));
export const getPdfMapping = () => {
  const m = localStorage.getItem(PDF_MAPPING_KEY);
  return m ? JSON.parse(m) : null;
};

// --- Tema Claro / Oscuro ---
export const getSavedTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const saveTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

// --- Autoría de la Aplicación ---
const AUTHOR_KEY = 'jw_app_author';
export const getAuthorName = () => {
  return localStorage.getItem(AUTHOR_KEY) || 'Sarit';
};

export const saveAuthorName = (name) => {
  if (name && name.trim()) {
    localStorage.setItem(AUTHOR_KEY, name.trim());
  }
};
