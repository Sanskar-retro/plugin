import { InjectionToken } from '@angular/core';
export const WINDOW = new InjectionToken<Window>('window');
export function windowFactory() {
  return window;
}
export const windowProvider = {
  provide: WINDOW,
  useFactory: windowFactory
};