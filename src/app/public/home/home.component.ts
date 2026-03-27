import { Component, AfterViewInit, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../core/seo.service';
import { ClientsComponent } from '../clients/clients.component';
import { AboutComponent } from '../about/about.component';
import { ServicesComponent } from '../services/services.component';
import { ProductsComponent } from '../products/products.component';
import { TeamComponent } from '../team/team.component';
import { ContactComponent } from '../contact/contact.component';

interface CodeLine {
  plain: string;
  html: string;
}

const CODE_LINES: CodeLine[] = [
  { plain: '// dashboard.component.ts',                         html: '<span class="c-c">// dashboard.component.ts</span>' },
  { plain: "import { DashboardService } from './dashboard';",   html: '<span class="c-k">import</span> <span class="c-v">{ DashboardService }</span> <span class="c-k">from</span> <span class="c-s">\'./dashboard\'</span>;' },
  { plain: '',                                                    html: '' },
  { plain: 'interface DashMetrics {',                            html: '<span class="c-k">interface</span> <span class="c-i">DashMetrics</span> {' },
  { plain: '  revenue:  number;',                                html: '&nbsp;&nbsp;<span class="c-key">revenue</span>:&nbsp;&nbsp;<span class="c-t">number</span>;' },
  { plain: '  users:    number;',                                html: '&nbsp;&nbsp;<span class="c-key">users</span>:&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-t">number</span>;' },
  { plain: '  projects: number;',                                html: '&nbsp;&nbsp;<span class="c-key">projects</span>: <span class="c-t">number</span>;' },
  { plain: '}',                                                   html: '}' },
  { plain: '',                                                    html: '' },
  { plain: 'async function loadDash(): Promise<void> {',         html: '<span class="c-k">async function</span> <span class="c-f">loadDash</span>(): <span class="c-i">Promise</span>&lt;<span class="c-t">void</span>&gt; {' },
  { plain: "  const data = await api.get('/metrics');",          html: '&nbsp;&nbsp;<span class="c-k">const</span> <span class="c-v">data</span> = <span class="c-k">await</span> <span class="c-f">api</span>.<span class="c-f">get</span>(<span class="c-s">\'/metrics\'</span>);' },
  { plain: '  chart.render(data.revenue);',                      html: '&nbsp;&nbsp;<span class="c-v">chart</span>.<span class="c-f">render</span>(<span class="c-v">data</span>.<span class="c-key">revenue</span>);' },
  { plain: '  stats.update(data);  // live',                     html: '&nbsp;&nbsp;<span class="c-v">stats</span>.<span class="c-f">update</span>(<span class="c-v">data</span>); <span class="c-c"> // live</span>' },
  { plain: '  notify("Dashboard ready");',                       html: '&nbsp;&nbsp;<span class="c-f">notify</span>(<span class="c-s">"Dashboard ready"</span>);' },
  { plain: '}',                                                   html: '}' },
  { plain: '',                                                    html: '' },
  { plain: 'loadDash();',                                        html: '<span class="c-f">loadDash</span>();' },
];

const CHAR_DELAY = 38;
const LINE_PAUSE = 120;
const START_DELAY = 600;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslatePipe, ClientsComponent,
    AboutComponent, ServicesComponent, ProductsComponent, TeamComponent, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId       = inject(PLATFORM_ID);
  private readonly sanitizer        = inject(DomSanitizer);
  private readonly seoService       = inject(SeoService);
  private readonly translateService = inject(TranslateService);

  completedLines: SafeHtml[] = [];
  currentLineText = '';
  typingDone = false;
  showApp = false;
  dashLoaded = false;

  private lineIndex = 0;
  private charIndex = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private flipInterval: ReturnType<typeof setTimeout> | null = null;
  private dashLoadTimer: ReturnType<typeof setTimeout> | null = null;
  private langSub?: Subscription;

  readonly navIcons = [
    { icon: 'bi bi-grid-fill',      active: true  },
    { icon: 'bi bi-people-fill',    active: false },
    { icon: 'bi bi-bar-chart-fill', active: false },
    { icon: 'bi bi-layers-fill',    active: false },
    { icon: 'bi bi-gear-fill',      active: false },
  ];

  readonly dashStats = [
    { icon: 'bi bi-currency-dollar', cls: 'dsi-navy',   value: '$48.2K', labelKey: 'application.home.dash.stat_revenue', badge: '+12%',  badgeCls: '',        sklW1: '26px', sklW2: '18px' },
    { icon: 'bi bi-people-fill',     cls: 'dsi-teal',   value: '1,480',  labelKey: 'application.home.dash.stat_users',   badge: '+8%',   badgeCls: '',        sklW1: '22px', sklW2: '16px' },
    { icon: 'bi bi-check2-circle',   cls: 'dsi-purple', value: '320',    labelKey: 'application.home.dash.stat_projects',badge: '+5%',   badgeCls: '',        sklW1: '18px', sklW2: '20px' },
    { icon: 'bi bi-activity',        cls: 'dsi-green',  value: '99.8%',  labelKey: 'application.home.dash.stat_uptime',  badge: '+0.2%', badgeCls: 'dl-sb-g', sklW1: '24px', sklW2: '14px' },
  ];

  readonly chartBars = [
    { height: '45%', label: 'J', hi: false },
    { height: '68%', label: 'F', hi: false },
    { height: '55%', label: 'M', hi: false },
    { height: '88%', label: 'A', hi: true  },
    { height: '62%', label: 'M', hi: false },
    { height: '78%', label: 'J', hi: false },
  ];

  readonly donutSegments = [
    { color: '#41B7A8', legendKey: 'application.home.dash.legend_done',  dasharray: '45 30.55', dashoffset: '18.85',  sklW: '26px' },
    { color: '#7B9FEF', legendKey: 'application.home.dash.legend_live',  dasharray: '20 55.55', dashoffset: '-26.15', sklW: '20px' },
    { color: '#A78BFA', legendKey: 'application.home.dash.legend_queue', dasharray: '10 65.55', dashoffset: '-46.15', sklW: '24px' },
  ];

  readonly dashTasks = [
    { dotCls: 'da-teal',   nameKey: 'application.home.dash.task1', statusKey: 'application.home.dash.status_done',  statusCls: 'dl-rs-ok',  amount: '$2.4K', sklBadge: '22px', sklAmt: '18px' },
    { dotCls: 'da-navy',   nameKey: 'application.home.dash.task2', statusKey: 'application.home.dash.status_live',  statusCls: 'dl-rs-wip', amount: '$8.1K', sklBadge: '18px', sklAmt: '22px' },
    { dotCls: 'da-purple', nameKey: 'application.home.dash.task3', statusKey: 'application.home.dash.status_done',  statusCls: 'dl-rs-ok',  amount: '$3.7K', sklBadge: '22px', sklAmt: '16px' },
    { dotCls: 'da-green',  nameKey: 'application.home.dash.task4', statusKey: 'application.home.dash.status_queue', statusCls: 'dl-rs-q',   amount: '$1.2K', sklBadge: '20px', sklAmt: '20px' },
  ];

  readonly dashActivity = [
    { dotCls: 'da-teal',   textKey: 'application.home.dash.act1', time: '2m', sklW: '34px' },
    { dotCls: 'da-navy',   textKey: 'application.home.dash.act2', time: '1h', sklW: '28px' },
    { dotCls: 'da-purple', textKey: 'application.home.dash.act3', time: '3h', sklW: '38px' },
    { dotCls: 'da-green',  textKey: 'application.home.dash.act4', time: '5h', sklW: '24px' },
  ];

  ngOnInit(): void {
    this.seoService.update();
    this.langSub = this.translateService.onLangChange
      .subscribe(() => this.seoService.update());
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const g = globalThis as unknown as Record<string, (new () => object) | undefined>;
      const PureCounterCtor = g['PureCounter'];
      if (PureCounterCtor) {
        const counter = new PureCounterCtor();
        if (!counter) { console.warn('PureCounter failed to initialize'); }
      }

      this.timer = setTimeout(() => this.tick(), START_DELAY);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.flipInterval) clearTimeout(this.flipInterval);
    if (this.dashLoadTimer) clearTimeout(this.dashLoadTimer);
    this.langSub?.unsubscribe();
  }

  scrollTo(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('section-' + sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private tick(): void {
    if (this.lineIndex >= CODE_LINES.length) {
      this.typingDone = true;
      this.timer = setTimeout(() => {
        this.showApp = true;
        this.scheduleDashLoad();
        this.scheduleFlip();
      }, 2000);
      return;
    }

    const line = CODE_LINES[this.lineIndex];

    if (line.plain === '') {
      this.completedLines.push(this.sanitizer.bypassSecurityTrustHtml('&nbsp;'));
      this.lineIndex++;
      this.charIndex = 0;
      this.timer = setTimeout(() => this.tick(), LINE_PAUSE);
      return;
    }

    if (this.charIndex < line.plain.length) {
      this.currentLineText = line.plain.slice(0, ++this.charIndex);
      this.timer = setTimeout(() => this.tick(), CHAR_DELAY);
    } else {
      this.completedLines.push(this.sanitizer.bypassSecurityTrustHtml(line.html));
      this.currentLineText = '';
      this.lineIndex++;
      this.charIndex = 0;
      this.timer = setTimeout(() => this.tick(), LINE_PAUSE);
    }
  }

  private scheduleDashLoad(): void {
    if (this.dashLoadTimer) clearTimeout(this.dashLoadTimer);
    this.dashLoadTimer = setTimeout(() => { this.dashLoaded = true; }, 2200);
  }

  private scheduleFlip(): void {
    // dashboard visible 60s → código visible 15s → repite
    const dashDelay = 60_000;
    const codeDelay = 15_000;
    this.flipInterval = setTimeout(() => {
      // voltear a código
      this.showApp = false;
      this.dashLoaded = false;
      if (this.dashLoadTimer) clearTimeout(this.dashLoadTimer);
      this.flipInterval = setTimeout(() => {
        // voltear a dashboard
        this.showApp = true;
        this.dashLoaded = false;
        this.scheduleDashLoad();
        this.scheduleFlip();
      }, codeDelay);
    }, dashDelay);
  }
}
