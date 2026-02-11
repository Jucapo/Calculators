import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss',
})
export class AccordionItemComponent {
  /** Título del acordeón */
  title = input.required<string>();
  /** Si el contenido está expandido */
  expanded = input<boolean>(true);
  /** Se emite al hacer clic en el encabezado (el padre puede actualizar expanded) */
  expandedChange = output<boolean>();

  readonly headerId = 'acc-h-' + Math.random().toString(36).slice(2, 10);
  readonly contentId = 'acc-c-' + Math.random().toString(36).slice(2, 10);

  toggle(): void {
    this.expandedChange.emit(!this.expanded());
  }
}
