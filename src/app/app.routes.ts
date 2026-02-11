// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { InvestmentCalculatorComponent } from './features/calculators/compound-interest/compound-interest.component';
import { HousingCreditComponent } from './features/calculators/housing-credit/housing-credit.component';
import { InterestRateConverterComponent } from './features/calculators/interest-rate-converter/interest-rate-converter.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'compound-interest' },
  {
    path: 'compound-interest',
    component: InvestmentCalculatorComponent,
    title: 'Simulador de Interés Compuesto',
  },
  {
    path: 'housing-credit',
    component: HousingCreditComponent,
    title: 'Simulador Crédito de Vivienda',
  },
  {
    path: 'interest-rate-converter',
    component: InterestRateConverterComponent,
    title: 'Convertidor de Tasas de Interés',
  },
];
