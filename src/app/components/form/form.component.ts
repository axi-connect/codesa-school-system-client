import { Button } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { InputTextModule } from "primeng/inputtext";
import { FloatLabelModule } from "primeng/floatlabel";
import { DatePickerModule } from "primeng/datepicker";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, inject } from '@angular/core';
import { MessageService } from "primeng/api";

export interface FormFieldConfig {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}

export interface FormConfig {
  title: string;
  icon?: string;
  fields: FormFieldConfig[];
}

@Component({
  selector: 'app-form',
  imports: [InputTextModule, FormsModule, FloatLabelModule, CommonModule, Button, DatePickerModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
})

export class FormComponent implements OnInit {
  @Input() config!: FormConfig;
  @Input() defaultValues!:{[key: string]:any};
  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    console.log('execute')
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.form.reset();
    console.log('activate')
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.enable();
    });
  }

  ngOnInit(): void {
    const group: any = {};
    if (this.config && this.config.fields) {
      this.config.fields.forEach(field => {
        group[field.name] = [
          this.defaultValues && this.defaultValues[field.name] ? this.defaultValues[field.name] : '',
          field.required ? Validators.required : []
        ];
      });
      this.form = this.fb.group(group);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultValues'] && this.form) {
      this.form.patchValue(this.defaultValues || {});
    }
  }
}
