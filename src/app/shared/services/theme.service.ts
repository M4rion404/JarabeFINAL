import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  theme = signal<'light' | 'synthwave'>('light');

  constructor() {
    const saved = localStorage.getItem('theme') as any;
    this.setTheme(saved ?? 'light');
  }

  toggle(): void {
    this.setTheme(this.theme() === 'light' ? 'synthwave' : 'light');
  }

  setTheme(theme: 'light' | 'synthwave'): void {
    this.theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
