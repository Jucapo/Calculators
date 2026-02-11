import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DataTableColumn {
  /** Clave de la propiedad en cada fila */
  key: string;
  /** Texto del encabezado (puede incluir HTML o saltos de línea) */
  label: string;
  /** Alineación del contenido */
  align?: 'left' | 'right' | 'center';
  /** Formato para el pipe number (ej. '1.0-0', '1.2-4'). Si no se define, se muestra el valor sin formatear */
  format?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T extends object = object> {
  /** Definición de columnas (orden y visibilidad) */
  columns = input.required<DataTableColumn[]>();
  /** Filas de datos */
  rows = input.required<T[]>();
  /** Altura máxima del contenedor con scroll (ej. '70vh', '400px'). Por defecto 70vh */
  maxHeight = input<string>('70vh');
  /** Clave para trackBy en *ngFor (opcional). Si no se pasa, se usa el índice */
  trackByKey = input<string | null>(null);

  trackByFn(index: number, row: T): unknown {
    const key = this.trackByKey();
    if (key && key in row && (row as Record<string, unknown>)[key] != null) {
      return (row as Record<string, unknown>)[key];
    }
    return index;
  }
}
