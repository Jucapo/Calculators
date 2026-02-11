// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { InvestmentCalculatorComponent } from './features/calculators/compound-interest/compound-interest.component';
import { HousingCreditComponent } from './features/calculators/housing-credit/housing-credit.component';
import { InterestRateConverterComponent } from './features/calculators/interest-rate-converter/interest-rate-converter.component';
import { CreditPaymentPlanComponent } from './features/calculators/credit-payment-plan/credit-payment-plan.component';
import { SavingsGoalComponent } from './features/calculators/savings-goal/savings-goal.component';
import { CreditComparatorComponent } from './features/calculators/credit-comparator/credit-comparator.component';
import { InflationComponent } from './features/calculators/inflation/inflation.component';
import { ExtraPaymentComponent } from './features/calculators/extra-payment/extra-payment.component';
import { EmergencyFundComponent } from './features/calculators/emergency-fund/emergency-fund.component';
import { RetirementComponent } from './features/calculators/retirement/retirement.component';
import { CurrencyInflationComponent } from './features/calculators/currency-inflation/currency-inflation.component';
import { RealRateComponent } from './features/calculators/real-rate/real-rate.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'compound-interest' },
  { path: 'compound-interest', component: InvestmentCalculatorComponent, title: 'Simulador de Interés Compuesto' },
  { path: 'housing-credit', component: HousingCreditComponent, title: 'Simulador Crédito de Vivienda' },
  { path: 'interest-rate-converter', component: InterestRateConverterComponent, title: 'Convertidor de Tasas de Interés' },
  { path: 'credit-payment-plan', component: CreditPaymentPlanComponent, title: 'Plan de Pago de Créditos' },
  { path: 'savings-goal', component: SavingsGoalComponent, title: 'Meta de Ahorro' },
  { path: 'credit-comparator', component: CreditComparatorComponent, title: 'Comparador de Créditos' },
  { path: 'inflation', component: InflationComponent, title: 'Inflación y Poder Adquisitivo' },
  { path: 'extra-payment', component: ExtraPaymentComponent, title: 'Amortización con Abono Extra' },
  { path: 'emergency-fund', component: EmergencyFundComponent, title: 'Fondo de Emergencias' },
  { path: 'retirement', component: RetirementComponent, title: 'Proyección de Retiro' },
  { path: 'currency-inflation', component: CurrencyInflationComponent, title: 'Dolarización e Inflación' },
  { path: 'real-rate', component: RealRateComponent, title: 'Tasa Real' },
];
