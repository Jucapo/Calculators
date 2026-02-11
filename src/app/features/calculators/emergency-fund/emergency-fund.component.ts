import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';

@Component({
  selector: 'app-emergency-fund',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyInputDirective],
  templateUrl: './emergency-fund.component.html',
  styleUrl: './emergency-fund.component.scss',
})
export class EmergencyFundComponent {
  monthsOfExpenses = 6;
  monthlyExpenses = 2_500_000;
  currentSavings = 5_000_000;
  monthlyContribution = 500_000;

  targetAmount = 0;
  monthsToReach = 0;
  showForm = signal(true);

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  calculate(): void {
    this.targetAmount = this.monthsOfExpenses * this.monthlyExpenses;
    const need = Math.max(0, this.targetAmount - this.currentSavings);
    if (this.monthlyContribution <= 0) {
      this.monthsToReach = need > 0 ? 999 : 0;
      return;
    }
    this.monthsToReach = Math.ceil(need / this.monthlyContribution);
  }
}
