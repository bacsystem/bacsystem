export interface NavLink {
  path: string;
  labelKey: string;
}

/** Main navigation, shared by header and footer. */
export const NAV_LINKS: NavLink[] = [
  { path: '/servicios', labelKey: 'application.site.nav.services' },
  { path: '/productos', labelKey: 'application.site.nav.products' },
  { path: '/nosotros', labelKey: 'application.site.nav.about' },
  { path: '/contacto', labelKey: 'application.site.nav.contact' },
];
