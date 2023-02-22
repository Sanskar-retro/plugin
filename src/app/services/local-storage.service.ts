// Core Modules
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
    if (key == 'userInfo') {
      let userData = JSON.parse(value)
      _.set(userData, 'show_welcome_alert', true);
      localStorage.setItem('authToken', _.get(userData, 'auth_token', ''));
      localStorage.setItem(key, JSON.stringify(userData));
    }
  }
  public getData(key: string) {
    return localStorage.getItem(key)
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }
  public userInfo(): any {
    const userInfo = this.getData('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }
  public authToken(): string {
    return localStorage.getItem('authToken') || ''
  }
}
