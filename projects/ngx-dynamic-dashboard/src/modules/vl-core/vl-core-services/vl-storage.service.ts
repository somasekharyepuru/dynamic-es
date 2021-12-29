import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VlStorageService {

  constructor() { }

  public add(key: string, value: any): void {
    if (!value) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  public get(key: string): any {
    const config = localStorage.getItem(key);
    if (!config) {
      return null;
    }
    return JSON.parse(localStorage.getItem(key))
  }
  public remove(key: string): void {
    localStorage.removeItem(key);
  }
}
