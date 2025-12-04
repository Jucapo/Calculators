// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { InvestmentCalculatorComponent } from './components/investment-calculator/investment-calculator';

export const routes: Routes = [
  {
    path: '',
    component: InvestmentCalculatorComponent,
  },
  // si luego quieres más pantallas, las agregas aquí
];
