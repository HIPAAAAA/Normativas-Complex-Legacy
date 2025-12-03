import { Faction, GenericCategory, Rule } from './types';

// Design Tokens
export const THEME = {
  colors: {
    accent: '#8C78FF',
    accentDeep: '#3C0081',
    highlight: '#FFD65A',
    text: 'rgba(255,255,255,.92)',
    muted: 'rgba(255,255,255,.70)',
    glassWeak: 'rgba(255,255,255,.04)',
    glassStrong: 'rgba(255,255,255,.08)',
  }
};

export const LOGO_URL = 'https://i.ibb.co/cK1BWpTp/legacy.png';

export const LINKS = {
  discord: 'https://discord.gg/complexrp',
  support: 'https://discord.gg/complexrp', 
  update: 'https://update.complexrp.com/',
  web: 'https://www.complexrp.com/'
};

export const INITIAL_FACTIONS: Faction[] = [
  {
    id: 'police',
    name: 'Los Santos Police Dept.',
    slug: 'police',
    icon: 'https://i.imgur.com/crtDJQm.jpeg',
    description: 'Servir y proteger. La primera línea de defensa contra el crimen en Los Santos.',
    color: '#3b82f6',
    gradientFrom: 'from-blue-900',
    gradientTo: 'to-blue-600',
    discordUrl: 'https://discord.gg/complexlegacy-police',
    applyUrl: 'https://forms.google.com/complex-police',
    bannerUrl: 'https://i.ibb.co/ynT9xphW/POLICE-POSUT.png',
    members: [
      {
        id: 'p1',
        name: 'Nico',
        role: 'Jefe LSPD',
        avatar: 'https://ui-avatars.com/api/?name=Nico&background=0D8ABC&color=fff',
        discord: 'nico#0001',
        status: 'online'
      },
      {
        id: 'p2',
        name: '𝕭𝖊𝖊𝖑𝖚',
        role: 'Sub Jefa LSPD',
        avatar: 'https://ui-avatars.com/api/?name=Beelu&background=0D8ABC&color=fff',
        discord: 'beelu#1234',
        status: 'busy'
      }
    ],
    rules: [
      {
        id: 'lspd_1',
        title: 'Régimen Disciplinario y Conducta',
        content: `
          <h3>Sanciones / Strikes</h3>
          <ul>
            <li>Deberán cumplir las horas mínimas semanales registrándose en su bitácora correspondiente semanalmente (8 horas).</li>
            <li>Deberán mantener una buena conducta dentro del horario laboral, como fuera del mismo (IDP).</li>
            <li>Queda prohibido utilizar el uniforme fuera de servicio, incompleto, fuera de su rango y/o con accesorios extravagantes.</li>
            <li>Insubordinación hacia un superior o mando.</li>
            <li>Queda prohibido utilizar vehículos de la LSPD para uso personal y/o fuera de servicio.</li>
            <li>No se aceptan tatuajes visibles y/o maquillajes en el rostro, cuello o manos.</li>
            <li>La no devolución de armas de dotación y/o dejarlas tiradas en el suelo es motivo de sanción instantánea.</li>
            <li>Incumplir los procedimientos establecidos para el personal fuera de servicio —incluyendo no valorar su seguridad personal, portar o utilizar el arma reglamentaria sin notificar al 911 en caso de incidente— podrá constituir una falta grave.</li>
            <li>El incumplimiento de los procedimientos así como fallas en desempeño, conducta, asistencia, comunicación o coordinación podrá resultar en medidas disciplinarias, incluidas degradaciones.</li>
          </ul>
        `,
        lastUpdated: new Date().toISOString(),
        author: 'Nico'
      },
      {
        id: 'lspd_2',
        title: 'Niveles de Alerta',
        content: `
          <p><strong style="color: #4ade80;">ALERTA VERDE</strong><br/>
          No existe ningún tipo de riesgo. Este es el nivel de alerta mínimo en el cual todas las Unidades patrullan de forma normal y rutinaria. Oficiales a usar uniforme reglamentario.</p>

          <p><strong style="color: #facc15;">ALERTA AMARILLA</strong><br/>
          Existe una amenaza conocida. Nivel Medio donde los Oficiales podrán identificar, Registrar y retener a cualquier persona sospechosa y su vehículo. (Solo Oficial I en adelante, mínimo 3 policías).</p>

          <p><strong style="color: #ef4444;">ALERTA ROJA</strong><br/>
          Amenaza continua. Nivel máximo. Oficiales podrán portar rifle de asalto, Uniforme táctico, Chaleco Exterior y Máscara. Se limita el libre albedrío de la ciudadanía, se insta a quedarse en casa y se cierran accesos. Todo desobediente podrá ser detenido por 72 horas (30 min). (Solo Oficial III en adelante, mínimo 5 policías).</p>
        `,
        lastUpdated: new Date().toISOString(),
        author: 'Nico'
      },
      {
        id: 'lspd_3',
        title: 'Derechos Miranda y Procedimientos',
        content: `
          <h3>Derechos Miranda</h3>
          <ul>
            <li>Tiene derecho a guardar silencio, todo lo que diga puede ser usado en su contra.</li>
            <li>Tiene derecho a saber los delitos que se le atribuyen.</li>
            <li>Tiene derecho a agua, comida y asistencia médica si lo requiere.</li>
            <li>Tiene derecho a un abogado, siempre y cuando no fuese encontrado flagrante de delito.</li>
            <li>Tiene derecho a una llamada de no más de un minuto en presencia de un oficial y en alta voz.</li>
          </ul>
          <p><strong>Habeas Corpus:</strong> Si no se leen los derechos, el detenido puede pedir su puesta en libertad inmediata ante un juez si no hay motivos de peso para condenarlo.</p>
        `,
        lastUpdated: new Date().toISOString(),
        author: 'Nico'
      },
      {
        id: 'lspd_4',
        title: 'Códigos Radiales',
        content: `
          <table style="width:100%; border-collapse: collapse; border: 1px solid rgba(255,255,255,0.1);">
            <tr style="background: rgba(255,255,255,0.1);"><th>Código 10</th><th>Clave</th></tr>
            <tr><td>10-00</td><td>Precaución</td></tr>
            <tr><td>10-04</td><td>Afirmativo</td></tr>
            <tr><td>10-05</td><td>Negativo</td></tr>
            <tr><td>10-08</td><td>Entrando en servicio</td></tr>
            <tr><td>10-10</td><td>Iniciar patrullaje</td></tr>
            <tr><td>10-20</td><td>Ubicación</td></tr>
            <tr><td>10-38</td><td>Atención médica</td></tr>
            <tr><td>10-50</td><td>Venta de estupefacientes</td></tr>
            <tr><td>10-97</td><td>En camino</td></tr>
            <tr><td>10-98</td><td>Asignación Finalizada</td></tr>
            <tr><td>Código 3</td><td>Emergencia (Luces y Sirena)</td></tr>
            <tr><td>Código 4</td><td>No se necesita ayuda</td></tr>
            <tr><td>Código 6</td><td>Solicitando refuerzos</td></tr>
          </table>
        `,
        lastUpdated: new Date().toISOString(),
        author: 'Nico'
      },
      {
        id: 'lspd_5',
        title: 'Tráfico y Multas',
        content: `
          <h3>Reducción de Multas</h3>
          <p>Un civil con abogado acreditado puede recibir hasta 50% de reducción. Si el implicado supera el monto máximo de multas, se iniciará investigación.</p>
          
          <h3>Paradas de Tráfico</h3>
          <ul>
            <li><strong>Cooperación:</strong> Si coopera, solo incautación del vehículo (si aplica) y multa.</li>
            <li><strong>Falta de Cooperación:</strong> Agentes facultados para revisar vehículo, trasladar sujeto a comisaría o retener el vehículo por 2 horas.</li>
          </ul>
        `,
        lastUpdated: new Date().toISOString(),
        author: 'Nico'
      },
      {
        id: 'lspd_6',
        title: 'Imagen Institucional y Vehículos',
        content: `
          <h3>Presencia</h3>
          <ul>
            <li><strong>Hombres:</strong> Cabello prolijo, barba recortada, sin tatuajes en rostro.</li>
            <li><strong>Mujeres:</strong> Cabello recogido, sin accesorios vistosos.</li>
          </ul>
          <h3>Asignación de Vehículos</h3>
          <p>El uso de vehículos de facción está ligado al rango. Solo se permite usar vehículo de rango superior por necesidad operativa urgente y autorización. El abuso conlleva amonestación.</p>
        `,
        lastUpdated: new Date().toISOString(),
        author: 'Nico'
      },
      {
        id: 'lspd_7',
        title: 'Corrupción y Retiro',
        content: `
          <h3>Retiro (PKT)</h3>
          <p>Cualquier oficial que se retire debe someterse a una solicitud de PKT obligatoria (Pérdida de memoria de todo lo ocurrido dentro de la facción).</p>
          
          <h3>Corrupción</h3>
          <p>Requiere: No pertenecer a Jefatura, antigüedad de 2+ meses y aprobación de Staff vía ticket. Prohibido vender/regalar objetos de la LSPD o evidencias.</p>
        `,
        lastUpdated: new Date().toISOString(),
        author: 'Nico'
      }
    ]
  },
  {
    id: 'saes',
    name: 'S.A. Emergency Services',
    slug: 'saes',
    icon: 'https://i.postimg.cc/L6bnZpRG/SAES-General.png',
    description: 'Departamento unificado de asistencia médica y cuerpo de bomberos de San Andreas.',
    color: '#ef4444',
    gradientFrom: 'from-red-900',
    gradientTo: 'to-orange-600',
    discordUrl: 'https://discord.gg/complexlegacy-saes',
    applyUrl: 'https://forms.google.com/complex-saes',
    bannerUrl: 'https://i.ibb.co/ZzwZkwZt/POSTULACIONEMS.png',
    members: [
      {
        id: 'e1',
        name: '𝑵𝒂𝒕𝒕 ✿',
        role: 'Jefa Médica',
        avatar: 'https://ui-avatars.com/api/?name=Natt&background=E11D48&color=fff',
        discord: 'natt#5555',
        status: 'online'
      },
      {
        id: 'e2',
        name: 'HIPAAAAA',
        role: 'Jefe de Bomberos',
        avatar: 'https://ui-avatars.com/api/?name=Hipa&background=EA580C&color=fff',
        discord: 'hipa#9999',
        status: 'idle'
      }
    ],
    rules: [
      {
        id: 're1',
        title: 'Prioridad de Vida (Reanimación)',
        content: '<p>En situaciones de riesgo, el personal de SAES debe priorizar su propia seguridad antes de ingresar a una zona roja. La vida del civil es la segunda prioridad.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Natt'
      }
    ]
  }
];

export const INITIAL_GENERIC_CATEGORIES: GenericCategory[] = [
  {
    id: 'general',
    name: 'Normativas Generales',
    slug: 'general',
    description: 'Reglas fundamentales de convivencia, rol y comportamiento dentro de Complex Legacy. Lectura obligatoria.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png', // Person Icon
    bannerUrl: 'https://i.ibb.co/5xFJ5Ch7/banner-legakl.png',
    gradientFrom: 'from-slate-900',
    gradientTo: 'to-slate-600',
    rules: [
      {
        id: 'g1',
        title: '1. Requisitos de acceso',
        content: '<ul><li>El servidor es estrictamente <strong>+18 años</strong>.</li><li>Se requiere un micrófono de buena calidad y uso constante.</li><li>Todo jugador debe conocer y comprender estas normativas antes de ingresar.</li><li>Su incumplimiento puede conllevar sanción.</li></ul>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g2',
        title: '2. Conducta y Toxicidad',
        content: '<ul><li>Respeto absoluto a todos los miembros de la comunidad.</li><li>Toxicidad IC permitida <strong>solo si aporta al rol</strong> y tiene sentido narrativo.</li><li><strong>Toxicidad OOC (Fuera de Personaje) totalmente prohibida.</strong></li><li>Su incumplimiento puede conllevar sanción.</li></ul>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g3',
        title: '3. Uso de Discord',
        content: '<ul><li>Todos los canales de Discord oficiales deben usarse con coherencia y para su propósito específico.</li><li>Reportes deben realizarse vía ticket obligatorio con prueba en video.</li><li>Su incumplimiento puede conllevar sanción.</li></ul>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g4',
        title: '4. Comunicación IC y Canales',
        content: '<ul><li>Los canales IC y OOC <strong>no deben mezclarse</strong> bajo ninguna circunstancia.</li><li>Prohibido usar Discord (llamadas, streams) como radio IC (Metagaming).</li><li>Su incumplimiento puede conllevar sanción.</li></ul>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g5',
        title: '5. Interpretación de Personaje',
        content: '<ul><li>El personaje debe ser coherente en todo momento.</li><li>Roles de género consistentes y respetuosos.</li><li><strong>Debe portar DNI siempre.</strong></li><li>Su incumplimiento puede conllevar sanción.</li></ul>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g6',
        title: '6. Reglas de Juego y Antiabuso',
        content: '<p>Están estrictamente prohibidos los conceptos básicos anti-rol:</p><ul><li><strong>Metagaming (MG):</strong> Usar info externa.</li><li><strong>Powergaming (PG):</strong> Acciones irreales.</li><li><strong>Deathmatch (DM):</strong> Matar sin rol previo.</li></ul><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g7',
        title: '7. Equipamiento, Mods y Bugs',
        content: '<p>Prohibido el uso de:</p><ul><li>Exploits (aprovechar fallos del juego).</li><li>Macros.</li><li>Combat Storing (guardar cosas/desconectar en rol).</li></ul><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g8',
        title: '8. Identificación y Evidencia',
        content: '<p>El porte de DNI es <strong>obligatorio</strong> en todo momento para identificación policial o administrativa.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g9',
        title: '9. Vehículos y Persecuciones',
        content: '<p>Prohibidos los choques intencionales (VDM/Car Ramming) sin un motivo de rol de peso extremo.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g10',
        title: '10. Zonas y Escenarios Especiales',
        content: '<p>Las <strong>Zonas Seguras</strong> no permiten roles agresivos, robos o secuestros sin un contexto previo iniciado fuera de la zona.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g11',
        title: '11. Secuestros',
        content: '<p>Permitidos únicamente con <strong>motivos IC válidos</strong> y comprobables.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g12',
        title: '12. Robos',
        content: '<p>Solo permitidos entre organizaciones criminales o civiles con motivo válido.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g13',
        title: '13. Represalias',
        content: '<p>Se debe evitar el hostigamiento repetido (Focus/Wipe) hacia un mismo jugador o grupo.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g14',
        title: '14. Roles +18',
        content: '<p>Estrictamente <strong>solo con consentimiento explícito</strong> de todas las partes involucradas.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g15',
        title: '15. Fuerzas del Orden',
        content: '<ul><li>No abatir oficiales sin motivos de peso (No matar "por deporte").</li><li><strong>15.1 Cacheos válidos:</strong> Requieren una razón IC válida y visible.</li></ul><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g16',
        title: '16. Estados de Muerte',
        content: '<ul><li><strong>PK (Player Kill):</strong> Olvido de rol actual.</li><li><strong>CK (Character Kill):</strong> Muerte definitiva del personaje.</li><li><strong>RK (Revenge Kill):</strong> Volver a matar a quien te mató (Prohibido).</li></ul><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g17',
        title: '17. Nombres y Personajes',
        content: '<p>Nombres deben ser realistas y únicos. No nombres de famosos o troleos.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g18',
        title: '18. VIP y Donaciones',
        content: '<p>Las donaciones son para el mantenimiento del servidor y son <strong>intransferibles</strong>.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g19',
        title: '19. Administración',
        content: '<p><strong>Regla 0:</strong> El staff tiene la potestad de sancionar conductas tóxicas o dañinas no listadas explícitamente si afectan la integridad de la comunidad.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g20',
        title: '20. Sanciones',
        content: '<p>Próximamente se publicará la tabla detallada de tiempos y tipos de sanciones.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'g21',
        title: '21. Anexos',
        content: '<p>Consulte el Glosario y la Guía Rápida para más detalles sobre términos específicos.</p><p>Su incumplimiento puede conllevar sanción.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      }
    ]
  },
  {
    id: 'illegal',
    name: 'Normativas Ilegales',
    slug: 'illegal',
    description: 'Reglamento para bandas, mafias, robos, secuestros y actividades delictivas.',
    icon: 'https://i.ibb.co/HZN6v2c/ilegal.png',
    bannerUrl: 'https://i.ibb.co/zyhztb7/bannerilegal.png',
    gradientFrom: 'from-purple-900',
    gradientTo: 'to-pink-900',
    rules: [
      {
        id: 'i1',
        title: 'Inicio de Roles Agresivos',
        content: '<p>Para iniciar un tiroteo o agresión, debe haber una interacción verbal previa de al menos 5 segundos o una amenaza clara y visible.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      },
      {
        id: 'i2',
        title: 'Límites de Robos',
        content: '<p>Máximo 4 atacantes para robos a civiles. Máximo 6 para robos a tiendas pequeñas.</p>',
        lastUpdated: new Date().toISOString(),
        author: 'Staff'
      }
    ]
  }
];