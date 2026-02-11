import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';
import { AccordionItemComponent } from '../../../shared/components/accordion/accordion-item.component';

interface CreditOption {
  name: string;
  amount: number;
  rate: number;
  years: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

@Component({
  selector: 'app-credit-comparator',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyInputDirective, AccordionItemComponent],
  templateUrl: './credit-comparator.component.html',
  styleUrl: './credit-comparator.component.scss',
})
export class CreditComparatorComponent {
  options: { name: string; amount: number; rate: number; years: number }[] = [
    { name: 'Oferta A', amount: 100_000_000, rate: 12, years: 15 },
    { name: 'Oferta B', amount: 100_000_000, rate: 11.5, years: 20 },
    { name: 'Oferta C', amount: 100_000_000, rate: 13, years: 10 },
  ];
  results: CreditOption[] = [];
  offersAccordionOpen = signal(true);

  addOption(): void {
    this.options.push({
      name: `Oferta ${String.fromCharCode(65 + this.options.length)}`,
      amount: 100_000_000,
      rate: 12,
      years: 15,
    });
  }

  removeOption(i: number): void {
    if (this.options.length > 1) this.options.splice(i, 1);
  }

  calculate(): void {
    this.results = this.options.map((opt) => {
      const P = Math.max(0, opt.amount);
      const n = Math.max(1, opt.years) * 12;
      const ea = (opt.rate || 0) / 100;
      const r = Math.pow(1 + ea, 1 / 12) - 1;
      const factor = Math.pow(1 + r, n);
      const monthly = P <= 0 ? 0 : (P * (r * factor)) / (factor - 1);
      const total = monthly * n;
      const interest = total - P;
      return {
        name: opt.name,
        amount: P,
        rate: opt.rate,
        years: opt.years,
        monthlyPayment: monthly,
        totalPayment: total,
        totalInterest: interest,
      };
    });
  }
}
