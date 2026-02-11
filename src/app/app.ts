import { Component, signal, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TooltipDirective } from './shared/directives/tooltip.directive';

const SIDEBAR_WIDTH_KEY = 'calcs-app-sidebar-width';
const SIDEBAR_WIDTH_MIN = 200;
const SIDEBAR_WIDTH_MAX = 480;
const SIDEBAR_WIDTH_DEFAULT = 240;

export type NavIconType = 'calculator' | 'home' | 'exchange' | 'target' | 'scale' | 'trending' | 'extra' | 'shield' | 'pension' | 'dollar' | 'percent' | 'calendar';

export interface NavItem {
  label: string;
  route: string;
  iconType: NavIconType;
  /** Si es true, se muestra un chip "Beta" en el menú. Quitar cuando el módulo esté testeado y refinado. */
  beta?: boolean;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TooltipDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  sidebarCollapsed = signal(true);
  /** Ancho del sidebar en px cuando está expandido (solo aplica si no está collapsed). */
  sidebarWidth = signal(SIDEBAR_WIDTH_DEFAULT);
  /** True mientras el usuario arrastra el borde para redimensionar. */
  resizing = signal(false);
  /** Ancho del viewport para márgenes en móvil. */
  viewportWidth = signal(1024);

  navItems: NavItem[] = [
    { label: 'Simulador de Interés Compuesto', route: '/compound-interest', iconType: 'calculator' },
    { label: 'Simulador Crédito de Vivienda', route: '/housing-credit', iconType: 'home' },
    { label: 'Convertidor de Tasas de Interés', route: '/interest-rate-converter', iconType: 'exchange' },
    { label: 'Plan de Pago de Créditos', route: '/credit-payment-plan', iconType: 'calendar', beta: true },
    { label: 'Meta de Ahorro', route: '/savings-goal', iconType: 'target', beta: true },
    { label: 'Comparador de Créditos', route: '/credit-comparator', iconType: 'scale', beta: true },
    { label: 'Inflación y Poder Adquisitivo', route: '/inflation', iconType: 'trending', beta: true },
    { label: 'Amortización con Abono Extra', route: '/extra-payment', iconType: 'extra', beta: true },
    { label: 'Fondo de Emergencias', route: '/emergency-fund', iconType: 'shield', beta: true },
    { label: 'Proyección de Retiro', route: '/retirement', iconType: 'pension', beta: true },
    { label: 'Dolarización e Inflación', route: '/currency-inflation', iconType: 'dollar', beta: true },
    { label: 'Tasa Real', route: '/real-rate', iconType: 'percent', beta: true },
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') this.viewportWidth.set(window.innerWidth);
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    if (saved != null) {
      const w = parseInt(saved, 10);
      if (!Number.isNaN(w) && w >= SIDEBAR_WIDTH_MIN && w <= SIDEBAR_WIDTH_MAX) {
        this.sidebarWidth.set(w);
      }
    }
  }

  /** Margen izquierdo del main para no quedar bajo el sidebar. */
  getMainMarginLeft(): number {
    if (this.sidebarCollapsed()) return 56;
    if (this.viewportWidth() <= 768) return Math.min(300, Math.round(this.viewportWidth() * 0.85));
    return this.sidebarWidth();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (typeof window !== 'undefined') this.viewportWidth.set(window.innerWidth);
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
