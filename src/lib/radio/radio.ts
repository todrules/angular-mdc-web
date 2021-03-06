import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Provider,
  Renderer2,
  SimpleChange,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, RadioControlValueAccessor } from '@angular/forms';
import { toBoolean, EventRegistry } from '@angular-mdc/web/common';
import { MdcRipple } from '@angular-mdc/web/ripple';

import { MDCRadioAdapter } from './adapter';
import { MDCRadioFoundation } from '@material/radio';

let nextUniqueId = 0;

export const MD_RADIO_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MdcRadio),
  multi: true
};

@Component({
  moduleId: module.id,
  selector: 'mdc-radio',
  host: {
    '[id]': 'id',
  },
  template:
    `
  <input type="radio"
    #inputEl
    class="mdc-radio__native-control"
    [id]="inputId"
    [name]="name"
    [tabIndex]="tabIndex"
    [attr.aria-label]="ariaLabel"
    [attr.aria-labelledby]="ariaLabelledby"
    [disabled]="disabled"
    [checked]="checked"
    [value]="value"
    (change)="onChange($event)"
    (blur)="onTouched()" />
    <div class="mdc-radio__background">
      <div class="mdc-radio__outer-circle"></div>
      <div class="mdc-radio__inner-circle"></div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  providers: [
    MD_RADIO_CONTROL_VALUE_ACCESSOR,
    MdcRipple,
    EventRegistry,
  ]
})
export class MdcRadio implements AfterViewInit, OnChanges, OnDestroy {
  private _mdcAdapter: MDCRadioAdapter = {
    addClass: (className: string) => {
      this._renderer.addClass(this.elementRef.nativeElement, className);
    },
    removeClass: (className: string) => {
      this._renderer.removeClass(this.elementRef.nativeElement, className);
    },
    getNativeControl: () => {
      return this.inputEl.nativeElement;
    }
  };

  private _foundation: {
    init: Function,
    destroy: Function,
    isChecked: Function,
    setChecked: Function,
    setDisabled: Function,
    isDisabled: Function,
    getValue: Function,
    setValue: Function
  } = new MDCRadioFoundation(this._mdcAdapter);

  private _uniqueId: string = `mdc-radio-${++nextUniqueId}`;
  private _disableRipple: boolean = false;

  @Input() id: string = this._uniqueId;
  @Input() name: string | null = null;
  @Input() tabIndex: number = 0;
  @Input('aria-label') ariaLabel: string = '';
  @Input('aria-labelledby') ariaLabelledby: string | null = null;
  @Output() change: EventEmitter<Event> = new EventEmitter<Event>();
  @HostBinding('class.mdc-radio') isHostClass = true;
  @ViewChild('inputEl') inputEl: ElementRef;

  private _controlValueAccessorChangeFn: (value: any) => void = () => { };
  onTouched: () => any = () => { };

  get inputId(): string { return `${this.id || this._uniqueId}-input`; }
  @Input()
  get checked(): boolean { return this._foundation.isChecked(); }
  set checked(value: boolean) {
    this._foundation.setChecked(toBoolean(value));
  }
  @Input()
  get value(): any { return this._foundation.getValue(); }
  set value(value: any) {
    this._foundation.setValue(value);
  }
  @Input()
  get disabled(): boolean { return this._foundation.isDisabled(); }
  set disabled(value: boolean) {
    this.setDisabledState(toBoolean(value));
  }
  @Input()
  get disableRipple(): boolean { return this._disableRipple; }
  set disableRipple(value: boolean) {
    this._disableRipple = toBoolean(value);
  }

  constructor(
    private _renderer: Renderer2,
    public elementRef: ElementRef,
    public ripple: MdcRipple) { }

  ngOnChanges(changes: { [key: string]: SimpleChange }): void {
    const disableRipple = changes['disableRipple'];

    if (disableRipple) {
      disableRipple.currentValue ? this.ripple.destroy() : this.ripple.init(true);
    }
  }

  ngAfterViewInit(): void {
    this._foundation.init();

    if (!this._disableRipple) {
      this.ripple.init(true);
    }
  }

  ngOnDestroy(): void {
    this._foundation.destroy();
  }

  onChange(evt: Event): void {
    evt.stopPropagation();
    this._controlValueAccessorChangeFn((<any>evt.target).value);
    this.change.emit(evt);
  }

  writeValue(value: any): void {
    if (this.value === value) {
      this.checked = true;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._foundation.setDisabled(isDisabled);
  }

  focus(): void {
    this.inputEl.nativeElement.focus();
  }
}
