import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';

@Component({
  selector: 'app-currency-inflation',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyInputDirective],
  templateUrl: './currency-inflation.component.html',
  styleUrl: './currency-inflation.component.scss',
})
export class CurrencyInflationComponent {
  amountCop = 100_000_000;
  exchangeRateToday = 4000;
  inflationCop = 8;
  inflationUsd = 2;
  years = 5;

  equivalentUsdToday = 0;
  equivalentCopFuture = 0;
  equivalentUsdFuture = 0;
  /** Poder adquisitivo en COP dentro de X años (mismo monto nominal) */
  purchasingPowerCop = 0;
  showForm = signal(true);

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  calculate(): void {
    const cop = Math.max(0, this.amountCop || 0);
    const trm = Math.max(0.01, this.exchangeRateToday || 1);
    const infCop = (this.inflationCop || 0) / 100;
    const infUsd = (this.inflationUsd || 0) / 100;
    const y = Math.max(0, this.years || 0);

    this.equivalentUsdToday = cop / trm;
    this.equivalentCopFuture = cop * Math.pow(1 + infCop, y);
    this.equivalentUsdFuture = this.equivalentUsdToday * Math.pow(1 + infUsd, y);
    this.purchasingPowerCop = cop / Math.pow(1 + infCop, y);
  }
}
