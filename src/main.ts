import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import * as lodash from 'lodash';

import { AppModule } from './app/app.module';

import { environment } from './environments/environment';


declare global {
  const _: typeof lodash;
  const $: any;
}

(globalThis as any)['_'] = lodash

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
