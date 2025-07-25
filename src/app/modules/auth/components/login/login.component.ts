import { Card } from "primeng/card";
import { Button } from "primeng/button";
import { FormsModule } from '@angular/forms';
import { InputText } from "primeng/inputtext";
import { DialogModule } from 'primeng/dialog';
import { FloatLabel } from "primeng/floatlabel";
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { environment } from '../../../../../environments/environment';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [DialogModule, RouterModule, Card, Button, FloatLabel, InputText, FormsModule, ReactiveFormsModule],
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  public dialogVisible: boolean = false;
  public dialogMessage: string | null = null;

  constructor(private router: Router, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  private redirectIfLoggedIn(): void {
    const auth = localStorage.getItem('auth');
    if (auth) {
      this.router.navigate(['/system']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.dialogMessage = null;
      try {
        const response = await fetch(`${environment.apiUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (result.successful) {
          localStorage.setItem('auth', result.data.access_token);
          this.router.navigate(['/system']);
        } else {
          this.dialogMessage = result.message || 'Error en el login';
          this.dialogVisible = true;
          this.cdr.detectChanges();
        }
      } catch (error) {
        this.dialogVisible = true;
        this.dialogMessage = 'Error de conexión con el servidor';
        this.cdr.detectChanges();
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.redirectIfLoggedIn();
  }
}