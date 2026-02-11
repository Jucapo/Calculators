import {
  Directive,
  ElementRef,
  HostListener,
  forwardRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Formatea el valor del input como moneda (separador de miles con punto) y solo permite enteros. */
@Directive({
  selector: 'input[appCurrencyInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputDirective),
      multi: true,
    },
  ],
})
export class CurrencyInputDirective implements ControlValueAccessor, OnInit, OnDestroy {
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};
  private lastFormatted = '';

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnInit(): void {
    this.el.nativeElement.type = 'text';
    this.el.nativeElement.setAttribute('inputmode', 'numeric');
    this.el.nativeElement.setAttribute('autocomplete', 'off');
  }

  ngOnDestroy(): void {}

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const raw = input.value.replace(/\D/g, '');
    const num = raw === '' ? 0 : Math.floor(parseInt(raw, 10));
    if (raw !== '' && Number.isNaN(num)) {
      this.onChange(0);
      input.value = this.format(0);
      this.lastFormatted = input.value;
      return;
    }
    this.onChange(num);
    this.lastFormatted = this.format(num);
    input.value = this.lastFormatted;
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
    const input = this.el.nativeElement;
    const raw = input.value.replace(/\D/g, '');
    const num = raw === '' ? 0 : Math.floor(parseInt(raw, 10));
    if (Number.isNaN(num)) {
      input.value = this.format(0);
      this.onChange(0);
    } else {
      input.value = this.format(num);
      this.onChange(num);
    }
  }

  writeValue(value: number | null | undefined): void {
    const num = value != null && !Number.isNaN(Number(value)) ? Math.floor(Number(value)) : 0;
    this.lastFormatted = this.format(num);
    this.el.nativeElement.value = this.lastFormatted;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private format(n: number): string {
    if (Number.isNaN(n) || n < 0) return '0';
    const s = String(Math.floor(n));
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
