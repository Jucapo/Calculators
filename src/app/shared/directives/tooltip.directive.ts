import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

const SHOW_DELAY_MS = 400;
const GAP_PX = 6;

/**
 * Muestra un tooltip al pasar el mouse sobre el elemento.
 * Útil para el menú colapsado: indica el nombre de la opción sin expandir.
 */
@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input() appTooltip = '';

  private tooltipEl: HTMLElement | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.tooltipEl = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipEl, 'app-tooltip');
    this.renderer.setStyle(this.tooltipEl, 'display', 'none');
    this.renderer.setAttribute(this.tooltipEl, 'role', 'tooltip');
    this.renderer.appendChild(document.body, this.tooltipEl);
  }

  private show(): void {
    if (!this.appTooltip?.trim() || !this.tooltipEl) return;
    this.tooltipEl.textContent = this.appTooltip.trim();
    this.renderer.setStyle(this.tooltipEl, 'display', 'block');

    const host = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipEl.getBoundingClientRect();
    const viewportW = document.documentElement.clientWidth;

    let left = host.right + GAP_PX;
    if (left + tooltipRect.width > viewportW - 8) {
      left = host.left - tooltipRect.width - GAP_PX;
    }
    const top = host.top + host.height / 2;

    this.renderer.setStyle(this.tooltipEl, 'left', `${Math.max(8, left)}px`);
    this.renderer.setStyle(this.tooltipEl, 'top', `${top}px`);
  }

  private hide(): void {
    if (this.showTimeout != null) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.tooltipEl) {
      this.renderer.setStyle(this.tooltipEl, 'display', 'none');
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.showTimeout = setTimeout(() => this.show(), SHOW_DELAY_MS);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hide();
  }

  ngOnDestroy(): void {
    this.hide();
    if (this.tooltipEl?.parentNode) {
      this.renderer.removeChild(document.body, this.tooltipEl);
    }
    this.tooltipEl = null;
  }
}
