import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProjectionRow {
  year: number;
  monthlyContribution: number;
  yearlyContribution: number;
  totalContributed: number;
  // Escenario 1
  interestEarned1: number;
  totalBalance1: number;
  // Escenario 2 (opcional)
  interestEarned2?: number | null;
  totalBalance2?: number | null;
}

@Component({
  selector: 'app-investment-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './investment-calculator.html',
  styleUrls: ['./investment-calculator.scss'],
})
export class InvestmentCalculatorComponent {
  // Escenario 1
  annualRate = 5.5;
  // Escenario 2
  hasSecondaryRate = true;
  annualRateSecondary = 10;

  monthlyContribution = 50000;
  years = 22;

  // IPC
  incrementEnabled = true;
  incrementAnnualPercent = 5;
  // Tope máximo para el aporte mensual
  maxMonthlyContribution: number | null = null;

  rows: ProjectionRow[] = [];

  // Resumen escenario 1
  finalTotalContributed = 0;
  finalInterestEarned = 0;
  finalTotalBalance = 0;

  // Resumen escenario 2
  finalInterestEarned2 = 0;
  finalTotalBalance2 = 0;

  // Control de columnas visibles
  displayColumns = {
    monthly: true,
    yearly: true,
    accumulated: true,
    interest1: true,
    total1: true,
    interest2: true,
    total2: true,
  };

  addSecondaryRate(): void {
    this.hasSecondaryRate = true;
  }

  removeSecondaryRate(): void {
    this.hasSecondaryRate = false;
  }

  calculate(): void {
    this.rows = [];

    // Escenario 1
    const rate1 = this.annualRate / 100;
    const monthlyRate1 = rate1 / 12;

    // Escenario 2
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
      // aporte mensual calculado por IPC
      let monthlyForYear = baseMonthly * Math.pow(1 + incRate, year - 1);

      // aplicar tope máximo si corresponde
      if (hasMax && monthlyForYear > this.maxMonthlyContribution!) {
        monthlyForYear = this.maxMonthlyContribution!;
      }

      let yearlyContribution = 0;

      for (let month = 1; month <= 12; month++) {
        yearlyContribution += monthlyForYear;
        totalContributed += monthlyForYear;

        // Escenario 1
        balance1 = (balance1 + monthlyForYear) * (1 + monthlyRate1);

        // Escenario 2 (si está activo)
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

      // Escenario 1
      this.finalTotalContributed = last.totalContributed;
      this.finalInterestEarned = last.interestEarned1;
      this.finalTotalBalance = last.totalBalance1;

      // Escenario 2 (si está activo)
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
