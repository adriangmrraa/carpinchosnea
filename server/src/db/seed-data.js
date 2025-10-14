const users = [
  { id: "u_analia", username: "analia", createdAt: "2025-09-01T12:00:00Z" },
  { id: "u_ramiro", username: "ramiro", createdAt: "2025-09-01T12:00:00Z" },
  { id: "u_sofia", username: "sofia", createdAt: "2025-09-01T12:00:00Z" },
  { id: "u_martin", username: "martin", createdAt: "2025-09-01T12:00:00Z" },
  { id: "u_carlos", username: "carlos", createdAt: "2025-09-01T12:00:00Z" }
];

const projectTitles = [
  "Mejorar iluminación en plazas públicas",
  "Implementar ciclovías en avenidas principales",
  "Reducir residuos plásticos en el barrio",
  "Crear espacios verdes en zonas urbanas",
  "Mejorar el transporte público local",
  "Instalar cámaras de seguridad en parques",
  "Promover el reciclaje en escuelas",
  "Reparar baches en calles principales",
  "Fomentar el arbolado urbano",
  "Implementar programas de zoonosis",
  "Mejorar accesibilidad en edificios públicos",
  "Crear rutas peatonales seguras",
  "Instalar contenedores de basura inteligentes",
  "Promover el uso de energías renovables",
  "Mejorar la señalización vial",
  "Crear programas de educación ambiental",
  "Instalar fuentes de agua potable",
  "Fomentar el turismo local sostenible",
  "Mejorar la conectividad WiFi en espacios públicos",
  "Implementar barrido manual en zonas residenciales",
  "Crear huertas comunitarias",
  "Promover la movilidad eléctrica",
  "Instalar juegos infantiles inclusivos",
  "Mejorar el mantenimiento de veredas",
  "Crear programas de inclusión social"
];

const summaries = [
  "Proyecto para aumentar la seguridad nocturna mediante mejor iluminación.",
  "Iniciativa para promover el ciclismo como medio de transporte sostenible.",
  "Campaña para reducir el impacto ambiental de los plásticos.",
  "Plan para crear áreas verdes en espacios urbanos desocupados.",
  "Mejoras en el sistema de transporte público para mayor eficiencia.",
  "Instalación de cámaras para prevenir delitos en áreas recreativas.",
  "Programa educativo para enseñar reciclaje desde temprana edad.",
  "Reparación de carreteras dañadas para mejorar la circulación.",
  "Plantación de árboles para mejorar la calidad del aire.",
  "Control de enfermedades transmitidas por animales.",
  "Adaptaciones para personas con discapacidad en espacios públicos.",
  "Rutas seguras para peatones alejadas del tráfico.",
  "Contenedores que optimizan la recolección de basura.",
  "Transición hacia fuentes de energía limpias.",
  "Señalización clara para reducir accidentes de tránsito.",
  "Educación sobre cuidado del medio ambiente.",
  "Acceso gratuito a agua potable en espacios públicos.",
  "Desarrollo turístico que respeta el entorno local.",
  "Conexión inalámbrica gratuita en plazas y parques.",
  "Limpieza manual de calles para mantener la higiene.",
  "Cultivos comunitarios para promover la autosuficiencia.",
  "Incentivos para el uso de vehículos eléctricos.",
  "Juegos adaptados para niños con diferentes capacidades.",
  "Mantenimiento regular de aceras para seguridad peatonal.",
  "Iniciativas para integrar a grupos marginados."
];

const bodies = summaries.map(s => s + " Este proyecto busca implementar soluciones prácticas y sostenibles para mejorar la calidad de vida en nuestra comunidad. Contamos con el apoyo de vecinos y esperamos su participación activa.");

function generateProjects() {
  const projects = [];
  const authors = users.map(u => u.id);
  for (let i = 0; i < 25; i++) {
    const authorId = authors[Math.floor(Math.random() * authors.length)];
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    projects.push({
      id: `p_${i + 1}`,
      title: projectTitles[i % projectTitles.length],
      summary: summaries[i % summaries.length],
      body: bodies[i % bodies.length],
      authorId,
      createdAt
    });
  }
  return projects;
}

function generateVotes(projects, users) {
  const votes = [];
  projects.forEach(project => {
    const voters = users.filter(u => u.id !== project.authorId);
    const numVotes = Math.floor(Math.random() * voters.length);
    const shuffled = voters.sort(() => 0.5 - Math.random());
    for (let i = 0; i < numVotes; i++) {
      const value = Math.random() > 0.5 ? 1 : -1;
      votes.push({
        id: `v_${votes.length + 1}`,
        userId: shuffled[i].id,
        projectId: project.id,
        value
      });
    }
  });
  return votes;
}

module.exports = { users, generateProjects, generateVotes };