import { Component, signal, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

const SIDEBAR_WIDTH_KEY = 'calcs-app-sidebar-width';
const SIDEBAR_WIDTH_MIN = 200;
const SIDEBAR_WIDTH_MAX = 480;
const SIDEBAR_WIDTH_DEFAULT = 240;

export type NavIconType = 'calculator' | 'home' | 'exchange';

export interface NavItem {
  label: string;
  route: string;
  iconType: NavIconType;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  sidebarCollapsed = signal(true);
  /** Ancho del sidebar en px cuando está expandido (solo aplica si no está collapsed). */
  sidebarWidth = signal(SIDEBAR_WIDTH_DEFAULT);
  /** True mientras el usuario arrastra el borde para redimensionar. */
  resizing = signal(false);

  navItems: NavItem[] = [
    { label: 'Simulador de Interés Compuesto', route: '/compound-interest', iconType: 'calculator' },
    { label: 'Simulador Crédito de Vivienda', route: '/housing-credit', iconType: 'home' },
    { label: 'Convertidor de Tasas de Interés', route: '/interest-rate-converter', iconType: 'exchange' },
  ];

  ngOnInit(): void {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    if (saved != null) {
      const w = parseInt(saved, 10);
      if (!Number.isNaN(w) && w >= SIDEBAR_WIDTH_MIN && w <= SIDEBAR_WIDTH_MAX) {
        this.sidebarWidth.set(w);
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  startResize(event: MouseEvent): void {
    event.preventDefault();
    this.resizing.set(true);
  }

  onResizeMove(event: MouseEvent): void {
    if (!this.resizing()) return;
    const w = Math.round(event.clientX);
    const clamped = Math.min(SIDEBAR_WIDTH_MAX, Math.max(SIDEBAR_WIDTH_MIN, w));
    this.sidebarWidth.set(clamped);
  }

  endResize(): void {
    if (!this.resizing()) return;
    this.resizing.set(false);
    localStorage.setItem(SIDEBAR_WIDTH_KEY, String(this.sidebarWidth()));
  }

  @HostListener('document:mousemove', ['$event'])
  onDocMouseMove(event: MouseEvent): void {
    this.onResizeMove(event);
  }

  @HostListener('document:mouseup')
  onDocMouseUp(): void {
    this.endResize();
  }
}
