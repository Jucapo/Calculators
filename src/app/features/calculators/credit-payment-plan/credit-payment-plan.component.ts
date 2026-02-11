import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, DataTableColumn } from '../../../shared/components/data-table/data-table.component';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';

interface AmortRow {
  month: number;
  payment: number;
  extra: number;
  interest: number;
  principal: number;
  balance: number;
}

@Component({
  selector: 'app-credit-payment-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, CurrencyInputDirective],
  templateUrl: './credit-payment-plan.component.html',
  styleUrl: './credit-payment-plan.component.scss',
})
export class CreditPaymentPlanComponent {
  loanAmount = 50_000_000;
  eaRate = 12;
  years = 15;
  /** Abono extra fijo mensual a capital (opcional). */
  extraPayment = 0;

  rows: AmortRow[] = [];
  monthsToPay = 0;
  totalPayment = 0;
  totalInterest = 0;
  monthlyPayment = 0;
  interestWithoutExtra = 0;

  showForm = signal(true);

  readonly tableColumns: DataTableColumn[] = [
    { key: 'month', label: 'Mes', align: 'center', format: '1.0-0' },
    { key: 'payment', label: 'Cuota', format: '1.0-0', currency: 'COP' },
    { key: 'extra', label: 'Abono extra', format: '1.0-0', currency: 'COP' },
    { key: 'interest', label: 'Interés', format: '1.0-0', currency: 'COP' },
    { key: 'principal', label: 'Capital', format: '1.0-0', currency: 'COP' },
    { key: 'balance', label: 'Saldo', format: '1.0-0', currency: 'COP' },
  ];

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  calculate(): void {
    this.rows = [];
    const P = Math.max(0, this.loanAmount || 0);
    const yearsCount = Math.max(1, Math.min(40, this.years || 1));
    const nOriginal = yearsCount * 12;
    const ea = (this.eaRate || 0) / 100;
    const monthlyRate = Math.pow(1 + ea, 1 / 12) - 1;
    const extra = Math.max(0, this.extraPayment || 0);

    if (P <= 0) {
      this.monthlyPayment = 0;
      this.monthsToPay = 0;
      this.totalPayment = 0;
      this.totalInterest = 0;
      this.interestWithoutExtra = 0;
      return;
    }

    const factor = Math.pow(1 + monthlyRate, nOriginal);
    this.monthlyPayment = (P * (monthlyRate * factor)) / (factor - 1);
    this.interestWithoutExtra = this.monthlyPayment * nOriginal - P;

    let balance = P;
    let month = 0;
    let totalPaid = 0;
    let totalInt = 0;

    while (balance > 0.01 && month < 600) {
      month++;
      const interest = balance * monthlyRate;
      let principal = this.monthlyPayment - interest;
      if (principal > balance) principal = balance;
      const thisExtra = Math.min(extra, Math.max(0, balance - principal));
      principal += thisExtra;
      if (principal > balance) principal = balance;
      balance = Math.max(0, balance - principal);
      totalPaid += this.monthlyPayment + thisExtra;
      totalInt += interest;

      this.rows.push({
        month,
        payment: this.monthlyPayment,
        extra: thisExtra,
        interest,
        principal,
        balance,
      });
    }

    this.monthsToPay = month;
    this.totalPayment = totalPaid;
    this.totalInterest = totalInt;
  }
}
