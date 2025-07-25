import { Button } from "primeng/button";
import { Select } from 'primeng/select';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MessageModule } from "primeng/message";
import { InputTextModule } from "primeng/inputtext";
import { FloatLabelModule } from "primeng/floatlabel";
import { DatePickerModule } from "primeng/datepicker";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, inject } from '@angular/core';

export interface FormFieldConfig {
  name: string;
  type: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ text: string, id: any }>;
}
export interface FormConfig {
  title: string;
  icon?: string;
  fields: FormFieldConfig[];
}

@Component({
  selector: 'app-form',
  imports: [Select, InputTextModule, FormsModule, FloatLabelModule, CommonModule, Button, DatePickerModule, ReactiveFormsModule, MessageModule],
  templateUrl: './form.component.html',
})

export class FormComponent implements OnInit {
  @Input() config!: FormConfig;
  @Input() defaultValues!:{[key: string]:any};
  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;

  public loading = false;
  public submitted = false;
  public isEditMode = false;

  constructor(private fb: FormBuilder) {}

  public onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  public resetForm(): void {
    this.form.reset();
    this.submitted = false;
    this.isEditMode = false;
    this.enableFormFields();
  }

  public enableFormFields(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.enable();
    });
  }

  public disableField(fieldName: string): void {
    const control = this.form.get(fieldName);
    if (control) control.disable();
  }

  public isFieldDisabled(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.disabled : false;
  }

  public getErrorMessage(field: FormFieldConfig): string {
    const control = this.form.get(field.name);
    if (!control) return '';
    if (control.hasError('required')) {
      return `${field.label ?? field.placeholder} es obligatorio.`;
    }
    if (field.type === 'email' && control.hasError('email')) {
      return `Introduce un correo electrónico válido.`;
    }
    return `Campo inválido.`;
  }

  public buildForm(){
    const group: any = {};
    this.config.fields.forEach(field => {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.type === 'email') validators.push(Validators.email);
      group[field.name] = [
        this.defaultValues && this.defaultValues[field.name] ? this.defaultValues[field.name] : '',
        validators
      ];
    });
    this.form = this.fb.group(group);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultValues'] && this.form) {
      this.form.patchValue(this.defaultValues || {});
    }

    if (changes['config'] && this.form) this.buildForm();
  }
}
