import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';

@Component({
  selector: 'app-retirement',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyInputDirective],
  templateUrl: './retirement.component.html',
  styleUrl: './retirement.component.scss',
})
export class RetirementComponent {
  currentBalance = 50_000_000;
  monthlyContribution = 1_500_000;
  annualRate = 7;
  yearsToRetirement = 20;

  balanceAtRetirement = 0;
  totalContributions = 0;
  interestEarned = 0;
  showForm = signal(true);

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  calculate(): void {
    let balance = Math.max(0, this.currentBalance || 0);
    const monthly = Math.max(0, this.monthlyContribution || 0);
    const n = Math.max(0, this.yearsToRetirement || 0) * 12;
    const ea = (this.annualRate || 0) / 100;
    const r = Math.pow(1 + ea, 1 / 12) - 1;

    this.totalContributions = monthly * n;
    const initialBalance = balance;
    for (let i = 0; i < n; i++) {
      balance = balance * (1 + r) + monthly;
    }
    this.balanceAtRetirement = balance;
    this.interestEarned = balance - initialBalance - this.totalContributions;
  }
}
