import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type RateType = 'NA' | 'NM' | 'EA' | 'EM';

const RATE_LABELS: Record<RateType, string> = {
  NA: 'Nominal anual',
  NM: 'Nominal mensual',
  EA: 'Efectivo anual',
  EM: 'Efectivo mensual',
};

@Component({
  selector: 'app-interest-rate-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interest-rate-converter.component.html',
  styleUrl: './interest-rate-converter.component.scss',
})
export class InterestRateConverterComponent {
  readonly rateLabels = RATE_LABELS;
  /** Orden: EA, EM, NA, NM (efectivos primero, EM de segundo). */
  readonly rateTypes: RateType[] = ['EA', 'EM', 'NA', 'NM'];

  inputType = signal<RateType>('EA');
  inputValue = signal<number>(0);

  /** Convierte el valor de entrada a las otras tres tasas (porcentaje). */
  readonly converted = computed(() => {
    const type = this.inputType();
    const val = this.inputValue();
    if (val == null || Number.isNaN(val)) {
      return { NA: 0, NM: 0, EA: 0, EM: 0 };
    }
    const p = val / 100;
    let na: number, nm: number, ea: number, em: number;
    switch (type) {
      case 'NA':
        na = val;
        nm = na / 12;
        em = nm; // nominal mensual compuesto mensualmente = efectivo mensual
        ea = (Math.pow(1 + nm / 100, 12) - 1) * 100;
        break;
      case 'NM':
        nm = val;
        na = nm * 12;
        em = nm;
        ea = (Math.pow(1 + nm / 100, 12) - 1) * 100;
        break;
      case 'EA':
        ea = val;
        em = (Math.pow(1 + ea / 100, 1 / 12) - 1) * 100;
        nm = em;
        na = nm * 12;
        break;
      case 'EM':
        em = val;
        ea = (Math.pow(1 + em / 100, 12) - 1) * 100;
        nm = em;
        na = nm * 12;
        break;
      default:
        return { NA: 0, NM: 0, EA: 0, EM: 0 };
    }
    return { NA: na, NM: nm, EA: ea, EM: em };
  });

  /** Para la vista: los otros tipos (excluyendo el de entrada). Orden: efectivos primero (EA, EM), luego nominales (NA, NM). */
  readonly otherRates = computed(() => {
    const type = this.inputType();
    const c = this.converted();
    const order: RateType[] = ['EA', 'EM', 'NA', 'NM'];
    return order
      .filter((t) => t !== type)
      .map((t) => ({ type: t, label: RATE_LABELS[t], value: c[t] }));
  });

  setInputType(type: RateType): void {
    this.inputType.set(type);
  }

  onInputChange(value: string | number): void {
    const s = typeof value === 'number' ? String(value) : value;
    const n = parseFloat(s.replace(',', '.')) || 0;
    this.inputValue.set(n);
  }
}
