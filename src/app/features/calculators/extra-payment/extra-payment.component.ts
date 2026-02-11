import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, DataTableColumn } from '../../../shared/components/data-table/data-table.component';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';

interface Row {
  month: number;
  payment: number;
  extra: number;
  interest: number;
  principal: number;
  balance: number;
}

@Component({
  selector: 'app-extra-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, CurrencyInputDirective],
  templateUrl: './extra-payment.component.html',
  styleUrl: './extra-payment.component.scss',
})
export class ExtraPaymentComponent {
  loanAmount = 80_000_000;
  eaRate = 11;
  years = 20;
  extraMonthly = 200_000;

  rows: Row[] = [];
  monthsToPay = 0;
  totalInterest = 0;
  totalWithoutExtra = 0;
  monthlyPayment = 0;
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
    const n = Math.max(1, this.years || 1) * 12;
    const ea = (this.eaRate || 0) / 100;
    const r = Math.pow(1 + ea, 1 / 12) - 1;
    const extra = Math.max(0, this.extraMonthly || 0);

    if (P <= 0) {
      this.monthlyPayment = 0;
      this.totalWithoutExtra = 0;
      this.monthsToPay = 0;
      this.totalInterest = 0;
      return;
    }

    const factor = Math.pow(1 + r, n);
    this.monthlyPayment = (P * (r * factor)) / (factor - 1);
    this.totalWithoutExtra = this.monthlyPayment * n - P;

    let balance = P;
    let month = 0;
    this.totalInterest = 0;
    while (balance > 0.01 && month < 600) {
      month++;
      const interest = balance * r;
      let principal = this.monthlyPayment - interest;
      if (principal > balance) principal = balance;
      const thisExtra = Math.min(extra, Math.max(0, balance - principal));
      principal += thisExtra;
      if (principal > balance) principal = balance;
      balance = Math.max(0, balance - principal);
      this.totalInterest += interest;
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
  }
}
