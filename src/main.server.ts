import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// The prerenderer passes its server platform via `context`; it must be forwarded
// (Angular >= 18.2.14 no longer shares server platforms globally).
const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
