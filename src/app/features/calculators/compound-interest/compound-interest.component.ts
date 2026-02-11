import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionItemComponent } from '../../../shared/components/accordion/accordion-item.component';
import { DataTableComponent, DataTableColumn } from '../../../shared/components/data-table/data-table.component';

interface ProjectionRow {
  year: number;
  monthlyContribution: number;
  yearlyContribution: number;
  totalContributed: number;
  interestEarned1: number;
  totalBalance1: number;
  interestEarned2?: number | null;
  totalBalance2?: number | null;
}

@Component({
  selector: 'app-compound-interest',
  standalone: true,
  imports: [CommonModule, FormsModule, AccordionItemComponent, DataTableComponent],
  templateUrl: './compound-interest.component.html',
  styleUrl: './compound-interest.component.scss',
})
export class InvestmentCalculatorComponent {
  annualRate = 5.5;
  hasSecondaryRate = false;
  annualRateSecondary = 10;

  monthlyContribution = 50000;
  years = 22;

  incrementEnabled = false;
  incrementAnnualPercent = 5;
  maxMonthlyContribution: number | null = null;

  rows: ProjectionRow[] = [];

  finalTotalContributed = 0;
  finalInterestEarned = 0;
  finalTotalBalance = 0;
  finalInterestEarned2 = 0;
  finalTotalBalance2 = 0;

  // Mostrar/ocultar panel de parámetros
  showForm = signal(true);

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  displayColumns = {
    monthly: true,
    yearly: true,
    accumulated: true,
    interest1: true,
    total1: true,
    interest2: true,
    total2: true,
  };

  /** Acordeón "Columnas visibles": abierto por defecto */
  columnsAccordionOpen = signal(true);

  get tableColumns(): DataTableColumn[] {
    const cols: DataTableColumn[] = [
      { key: 'year', label: 'Año', align: 'center', format: '1.0-0' },
    ];
    if (this.displayColumns.monthly) {
      cols.push({ key: 'monthlyContribution', label: 'Aporte mensual<br/>del año', format: '1.0-0' });
    }
    if (this.displayColumns.yearly) {
      cols.push({ key: 'yearlyContribution', label: 'Ahorro del año<br/>(12 meses)', format: '1.0-0' });
    }
    if (this.displayColumns.accumulated) {
      cols.push({ key: 'totalContributed', label: 'Capital aportado<br/>acumulado', format: '1.0-0' });
    }
    if (this.displayColumns.interest1) {
      cols.push({ key: 'interestEarned1', label: `Intereses<br/>generados<br/>(${this.annualRate}%)`, format: '1.0-0' });
    }
    if (this.displayColumns.total1) {
      cols.push({ key: 'totalBalance1', label: `Total<br/>acumulado<br/>(${this.annualRate}%)`, format: '1.0-0' });
    }
    if (this.hasSecondaryRate && this.displayColumns.interest2) {
      cols.push({ key: 'interestEarned2', label: `Intereses<br/>generados<br/>(${this.annualRateSecondary}%)`, format: '1.0-0' });
    }
    if (this.hasSecondaryRate && this.displayColumns.total2) {
      cols.push({ key: 'totalBalance2', label: `Total<br/>acumulado<br/>(${this.annualRateSecondary}%)`, format: '1.0-0' });
    }
    return cols;
  }

  addSecondaryRate(): void {
    this.hasSecondaryRate = true;
  }

  removeSecondaryRate(): void {
    this.hasSecondaryRate = false;
  }

  calculate(): void {
    this.rows = [];

    const rate1 = this.annualRate / 100;
    const monthlyRate1 = rate1 / 12;
    const rate2 = this.hasSecondaryRate ? this.annualRateSecondary / 100 : 0;
    const monthlyRate2 = this.hasSecondaryRate ? rate2 / 12 : 0;
    const baseMonthly = this.monthlyContribution;
    const incRate = this.incrementEnabled
      ? this.incrementAnnualPercent / 100
      : 0;
    const hasMax =
      this.incrementEnabled &&
      this.maxMonthlyContribution != null &&
      this.maxMonthlyContribution > 0;
    const totalYears = this.years;

    let balance1 = 0;
    let balance2 = 0;
    let totalContributed = 0;

    for (let year = 1; year <= totalYears; year++) {
      let monthlyForYear = baseMonthly * Math.pow(1 + incRate, year - 1);
      if (hasMax && monthlyForYear > this.maxMonthlyContribution!) {
        monthlyForYear = this.maxMonthlyContribution!;
      }
      let yearlyContribution = 0;

      for (let month = 1; month <= 12; month++) {
        yearlyContribution += monthlyForYear;
        totalContributed += monthlyForYear;
        balance1 = (balance1 + monthlyForYear) * (1 + monthlyRate1);
        if (this.hasSecondaryRate) {
          balance2 = (balance2 + monthlyForYear) * (1 + monthlyRate2);
        }
      }

      const interestEarned1 = balance1 - totalContributed;
      const interestEarned2 = this.hasSecondaryRate
        ? balance2 - totalContributed
        : null;

      this.rows.push({
        year,
        monthlyContribution: monthlyForYear,
        yearlyContribution,
        totalContributed,
        interestEarned1,
        totalBalance1: balance1,
        interestEarned2,
        totalBalance2: this.hasSecondaryRate ? balance2 : null,
      });
    }

    if (this.rows.length > 0) {
      const last = this.rows[this.rows.length - 1];
      this.finalTotalContributed = last.totalContributed;
      this.finalInterestEarned = last.interestEarned1;
      this.finalTotalBalance = last.totalBalance1;
      if (
        this.hasSecondaryRate &&
        last.interestEarned2 != null &&
        last.totalBalance2 != null
      ) {
        this.finalInterestEarned2 = last.interestEarned2;
        this.finalTotalBalance2 = last.totalBalance2;
      } else {
        this.finalInterestEarned2 = 0;
        this.finalTotalBalance2 = 0;
      }
    } else {
      this.finalTotalContributed = 0;
      this.finalInterestEarned = 0;
      this.finalTotalBalance = 0;
      this.finalInterestEarned2 = 0;
      this.finalTotalBalance2 = 0;
    }
  }
}
