import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestmentCalculatorComponent } from './compound-interest.component';

describe('InvestmentCalculatorComponent (Compound Interest)', () => {
  let component: InvestmentCalculatorComponent;
  let fixture: ComponentFixture<InvestmentCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentCalculatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
