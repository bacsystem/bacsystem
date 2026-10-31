export const SITE = {
  url: 'https://bacsystemsolutions.com',
  name: 'Bacsystem Solutions',
  email: 'bacsystem.sac@gmail.com',
  phone: '+51 907 892 868',
  address: 'Av. B 200 Lima',
} as const;

export type ServiceId = 'web' | 'consulting' | 'transformation' | 'optimization' | 'cloud';

/** Fragment of each service's block on /servicios (Home links to /servicios#<anchor>). */
export const SERVICE_ANCHORS = {
  web: 'desarrollo',
  consulting: 'consultoria',
  transformation: 'transformacion',
  optimization: 'optimizacion',
  cloud: 'nube',
} as const satisfies Record<ServiceId, string>;

export type ServiceAnchor = (typeof SERVICE_ANCHORS)[ServiceId];

/** A service as Home lists it (short description). */
export interface ServiceItem {
  id: ServiceId;
  anchor: ServiceAnchor;
  titleKey: string;
  descriptionKey: string;
  /** Concrete kinds of work, shown when the service leads the home page list. */
  tagKeys?: string[];
}

export interface ProductItem {
  id: 'operaai' | 'sophia';
  route: string;
  logo: string;
  nameKey: string;
  taglineKey: string;
}

/** One stage of how we work (shared process section on Home and Nosotros). */
export interface ProcessStep {
  id: 'understand' | 'design' | 'build' | 'maintain';
  titleKey: string;
  textKey: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  logo: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  labelKey: string;
  example: true;
  /** false: render the value as static text (e.g. 24/7), no count-up. */
  animate?: boolean;
}

const HOME_SERVICES = 'application.home.services';

const service = (id: ServiceId, tags?: string[]): ServiceItem => ({
  id,
  anchor: SERVICE_ANCHORS[id],
  titleKey: `${HOME_SERVICES}.${id}.title`,
  descriptionKey: `${HOME_SERVICES}.${id}.description`,
  ...(tags ? { tagKeys: tags.map(tag => `${HOME_SERVICES}.${id}.tags.${tag}`) } : {}),
});

export const SERVICES: ServiceItem[] = [
  service('web', ['internal', 'portals', 'mobile', 'integrations']),
  service('consulting'),
  service('transformation'),
  service('optimization'),
  service('cloud'),
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'operaai',
    route: '/productos/operaai',
    logo: '/assets/img/clients/operaai-favicon.svg',
    nameKey: 'application.home.products.operaai.name',
    taglineKey: 'application.home.products.operaai.tagline',
  },
  {
    id: 'sophia',
    route: '/productos/sophia',
    logo: '/assets/img/clients/sophia-favicon.svg',
    nameKey: 'application.home.products.sophia.name',
    taglineKey: 'application.home.products.sophia.tagline',
  },
];

export const PROCESS: ProcessStep[] = [
  { id: 'understand', titleKey: 'application.home.process.understand.title', textKey: 'application.home.process.understand.text' },
  { id: 'design', titleKey: 'application.home.process.design.title', textKey: 'application.home.process.design.text' },
  { id: 'build', titleKey: 'application.home.process.build.title', textKey: 'application.home.process.build.text' },
  { id: 'maintain', titleKey: 'application.home.process.maintain.title', textKey: 'application.home.process.maintain.text' },
];

// Vacío a propósito: la franja "Confían en nosotros" vuelve sola al agregar logos reales.
// client-7.png y client-8.png (ya eliminados) eran los logos de OperaAI y sophIA (productos propios), no de clientes.
export const CLIENTS: ClientLogo[] = [];

// EJEMPLO: cifras de muestra, reemplazar por reales
export const STATS: StatItem[] = [
  { id: 'years', value: 8, suffix: '+', labelKey: 'application.home.stats.years', example: true },
  { id: 'projects', value: 45, suffix: '+', labelKey: 'application.home.stats.projects', example: true },
  { id: 'clients', value: 20, suffix: '+', labelKey: 'application.home.stats.clients', example: true },
  { id: 'support', value: 24, suffix: '/7', labelKey: 'application.home.stats.support', example: true, animate: false },
];

/* ---------- Nosotros (/nosotros) ---------- */

/** Mission or vision: a label and one statement. */
export interface PurposeItem {
  id: 'mission' | 'vision';
  labelKey: string;
  textKey: string;
}

/** One company value and what it means in practice (one sentence). */
export interface ValueItem {
  id: 'innovation' | 'integrity' | 'commitment' | 'client' | 'teamwork' | 'quality';
  titleKey: string;
  textKey: string;
}

/** A team member. Names are proper nouns (never translated); role and bio are i18n keys. */
export interface TeamMember {
  id: string;
  name: string;
  roleKey: string;
  bioKey: string;
  /** Shown on the monogram tile while there is no photo. */
  initials: string;
  /** Path under /assets; when set, the photo replaces the monogram. */
  photo?: string;
}

const ABOUT = 'application.aboutPage';

export const PURPOSE: PurposeItem[] = [
  { id: 'mission', labelKey: `${ABOUT}.mission.label`, textKey: `${ABOUT}.mission.text` },
  { id: 'vision', labelKey: `${ABOUT}.vision.label`, textKey: `${ABOUT}.vision.text` },
];

const value = (id: ValueItem['id']): ValueItem => ({
  id,
  titleKey: `${ABOUT}.values.items.${id}.title`,
  textKey: `${ABOUT}.values.items.${id}.text`,
});

export const VALUES: ValueItem[] = [
  value('innovation'),
  value('integrity'),
  value('commitment'),
  value('client'),
  value('teamwork'),
  value('quality'),
];

const member = (id: string, name: string, initials: string): TeamMember => ({
  id,
  name,
  initials,
  roleKey: `${ABOUT}.team.members.${id}.role`,
  bioKey: `${ABOUT}.team.members.${id}.bio`,
});

// EJEMPLO: sin fotos todavía; cada tarjeta muestra un monograma. Para usar una foto real,
// agregar `photo: '/assets/img/team/<archivo>.jpg'` al integrante (reemplaza el monograma).
export const TEAM: TeamMember[] = [
  member('christian', 'Christian Bacilio', 'CB'),
  member('jose', 'José Bacilio', 'JB'),
  member('faustina', 'Faustina Del Rosario', 'FD'),
];

/* ---------- Servicios (/servicios) ---------- */

/** A service as /servicios details it: what it is, when it fits, what the client gets. */
export interface ServiceDetail {
  id: ServiceId;
  anchor: ServiceAnchor;
  titleKey: string;
  summaryKey: string;
  /** "Te sirve si…": 2–3 situations the client recognizes. */
  fitKeys: string[];
  /** "Qué recibes": 3–4 concrete deliverables (no prices, timelines or guarantees). */
  deliverableKeys: string[];
}

const SERVICES_PAGE = 'application.servicesPage.services';

const detail = (id: ServiceId, fit: string[], deliverables: string[]): ServiceDetail => ({
  id,
  anchor: SERVICE_ANCHORS[id],
  titleKey: `${SERVICES_PAGE}.${id}.title`,
  summaryKey: `${SERVICES_PAGE}.${id}.summary`,
  fitKeys: fit.map(k => `${SERVICES_PAGE}.${id}.fit.${k}`),
  deliverableKeys: deliverables.map(k => `${SERVICES_PAGE}.${id}.deliverables.${k}`),
});

export const SERVICE_DETAILS: ServiceDetail[] = [
  detail('web', ['spreadsheets', 'workaround', 'requests'], ['system', 'integrations', 'training', 'support']),
  detail('consulting', ['quotes', 'buyOrBuild', 'noTeam'], ['diagnosis', 'recommendation', 'plan', 'review']),
  detail('transformation', ['paper', 'retyping', 'reports'], ['map', 'digital', 'automation', 'adoption']),
  detail('optimization', ['slow', 'avoided', 'untouchable'], ['review', 'fixes', 'screens', 'docs']),
  detail('cloud', ['server', 'remote', 'backups'], ['plan', 'migration', 'access', 'costs']),
];
