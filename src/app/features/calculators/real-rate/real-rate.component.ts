import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-real-rate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './real-rate.component.html',
  styleUrl: './real-rate.component.scss',
})
export class RealRateComponent {
  nominalRate = 12;
  inflationRate = 5;

  realRate = 0;
  showForm = signal(true);

  constructor() {
    this.calculate();
  }

  toggleForm(): void {
    this.showForm.update((v) => !v);
  }

  calculate(): void {
    const nom = (this.nominalRate || 0) / 100;
    const inf = (this.inflationRate || 0) / 100;
    this.realRate = (1 + nom) / (1 + inf) - 1;
  }
}
