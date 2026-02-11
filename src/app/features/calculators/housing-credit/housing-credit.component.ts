import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, DataTableColumn } from '../../../shared/components/data-table/data-table.component';

interface AmortRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

@Component({
  selector: 'app-housing-credit',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  templateUrl: './housing-credit.component.html',
  styleUrl: './housing-credit.component.scss',
})
export class HousingCreditComponent {
  /** Valor del inmueble */
  propertyValue = 300_000_000;
  /** Tasa de interés efectiva anual (%) */
  eaRate = 12;
  /** Porcentaje a financiar (0-100) */
  loanPercent = 80;
  /** Plazo en años */
  years = 15;

  rows: AmortRow[] = [];
  totalPayment = 0;
  totalInterest = 0;
  loanAmount = 0;
  monthlyPayment = 0;
  downPayment = 0;

  // Mostrar/ocultar panel de datos
  showForm = signal(true);

  readonly amortTableColumns: DataTableColumn[] = [
    { key: 'month', label: 'Mes', align: 'center', format: '1.0-0' },
    { key: 'payment', label: 'Cuota', format: '1.0-0' },
    { key: 'interest', label: 'Interés', format: '1.0-0' },
    { key: 'principal', label: 'Capital', format: '1.0-0' },
    { key: 'balance', label: 'Saldo', format: '1.0-0' },
  ];

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  calculate(): void {
    this.rows = [];
    const val = this.propertyValue || 0;
    const pct = Math.min(100, Math.max(0, this.loanPercent || 0)) / 100;
    this.loanAmount = val * pct;
    this.downPayment = Math.max(0, val - this.loanAmount);
    const yearsCount = Math.max(1, Math.min(30, this.years || 1));
    const n = yearsCount * 12;
    const ea = (this.eaRate || 0) / 100;
    const monthlyRate = Math.pow(1 + ea, 1 / 12) - 1;

    if (this.loanAmount <= 0 || n <= 0) {
      this.monthlyPayment = 0;
      this.totalPayment = 0;
      this.totalInterest = 0;
      this.downPayment = 0;
      return;
    }

    // Cuota fija (sistema francés): PMT = P * r * (1+r)^n / ((1+r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, n);
    this.monthlyPayment = this.loanAmount * (monthlyRate * factor) / (factor - 1);
    this.totalPayment = this.monthlyPayment * n;
    this.totalInterest = this.totalPayment - this.loanAmount;

    let balance = this.loanAmount;
    for (let month = 1; month <= n; month++) {
      const interest = balance * monthlyRate;
      const principal = this.monthlyPayment - interest;
      balance = Math.max(0, balance - principal);
      this.rows.push({
        month,
        payment: this.monthlyPayment,
        interest,
        principal,
        balance,
      });
    }
  }
}
