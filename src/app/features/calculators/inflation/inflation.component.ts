import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';

@Component({
  selector: 'app-inflation',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyInputDirective],
  templateUrl: './inflation.component.html',
  styleUrl: './inflation.component.scss',
})
export class InflationComponent {
  amountToday = 10_000_000;
  inflationPercent = 5;
  years = 10;

  futureValue = 0;
  /** Para "equivalencia": si ingresa valor futuro, cuánto equivale hoy */
  futureAmount = 0;
  equivalentToday = 0;
  showForm = signal(true);
  mode: 'future' | 'today' = 'future';

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  calculate(): void {
    const amount = Math.max(0, this.amountToday || 0);
    const inf = (this.inflationPercent || 0) / 100;
    const y = Math.max(0, this.years || 0);
    this.futureValue = amount * Math.pow(1 + inf, y);

    const fut = Math.max(0, this.futureAmount || 0);
    this.equivalentToday = fut <= 0 ? 0 : fut / Math.pow(1 + inf, y);
  }
}
