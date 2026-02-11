import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';

@Component({
  selector: 'app-savings-goal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyInputDirective],
  templateUrl: './savings-goal.component.html',
  styleUrl: './savings-goal.component.scss',
})
export class SavingsGoalComponent {
  goalAmount = 100_000_000;
  currentSavings = 10_000_000;
  monthlyContribution = 1_000_000;
  annualRate = 8;

  monthsToGoal = 0;
  totalContributions = 0;
  interestEarned = 0;
  showForm = signal(true);

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  calculate(): void {
    const goal = Math.max(0, this.goalAmount || 0);
    let balance = Math.max(0, this.currentSavings || 0);
    const monthly = Math.max(0, this.monthlyContribution || 0);
    const ea = (this.annualRate || 0) / 100;
    const monthlyRate = Math.pow(1 + ea, 1 / 12) - 1;

    this.monthsToGoal = 0;
    this.totalContributions = 0;
    this.interestEarned = 0;

    if (balance >= goal) {
      return;
    }
    if (monthly <= 0 && balance < goal) {
      this.monthsToGoal = 999;
      return;
    }

    let m = 0;
    let totalContrib = 0;
    const initialBalance = balance;
    while (balance < goal && m < 600) {
      m++;
      balance = balance * (1 + monthlyRate) + monthly;
      totalContrib += monthly;
    }
    this.monthsToGoal = m;
    this.totalContributions = totalContrib;
    this.interestEarned = balance - initialBalance - totalContrib;
  }
}
