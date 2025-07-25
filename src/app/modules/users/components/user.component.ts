import { Card } from "primeng/card";
import { Button } from "primeng/button";
import { TabsModule } from "primeng/tabs";
import { TableModule } from "primeng/table";
import { BadgeModule } from "primeng/badge";
import { FormsModule } from '@angular/forms';
import { AvatarModule } from "primeng/avatar";
import { DialogModule } from "primeng/dialog";
import { RouterModule } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { FloatLabelModule } from "primeng/floatlabel";
import { environment } from '../../../../environments/environment';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormComponent, FormConfig } from "../../../components/form/form.component";

export interface User {
  nombre: string;
  email: string;
  id_user: number;
  apellido: string;
  telefono: string;
  fecha_nacimiento: string; // ISO string o formato YYYY-MM-DD
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user.component.html',
  imports: [DialogModule, InputTextModule, FormsModule, TableModule, Card, TabsModule, AvatarModule, BadgeModule, RouterModule, FloatLabelModule, FormComponent, Button],
})

export class UserComponent implements OnInit{
  public tabIndex = "0";

  public users: User[] = [];
  public loadingTable: boolean = true;
  public dialogVisible: boolean = false;
  public userToDelete: User | null = null;
  public deleteDialogVisible: boolean = false;
  public dialogMessage: string | null = null;
  @ViewChild('formUserComponent') formUserComponent!: FormComponent;

  constructor(private cdr: ChangeDetectorRef) {}

  public formConfig: FormConfig = {
    title: 'Registro de Usuario',
    icon: 'pi pi-user',
    fields: [
      { label: 'Nombres', name: 'nombre', type: 'text', required: true },
      { label: 'Apellidos', name: 'apellido', type: 'text', required: true },
      { label: 'Fecha de Nacimiento', name: 'fecha_nacimiento', type: 'date', required: true},
      { label: 'Teléfono', name: 'telefono', type: 'tel', required: true},
      { label: 'Email', name: 'email', type: 'email', required: true },
      { label: 'Contraseña', name: 'password', type: 'password', required: true }
    ]
  };

  public formDefaultValues:{[key: string]:any} = {};

  public editUser(customer:User){
    this.tabIndex = "1";
    this.formDefaultValues = {...customer, fecha_nacimiento: new Date(customer.fecha_nacimiento)}

    setTimeout(() => {
      document.getElementById('password')?.setAttribute('disabled', 'true');
    }, 0);
  }

  async ngOnInit(): Promise<void> {
    this.loadingTable = true;
    const token = localStorage.getItem('auth');
    try {
      const response = await fetch(`${environment.apiUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseData = await response.json();
      this.users = responseData.data;
    } catch (error) {
      this.users = [];
    } finally {
      this.cdr.detectChanges();
      this.loadingTable = false;
    }
  }

  async onFormSubmit(formData: any): Promise<void> {
    const token = localStorage.getItem('auth');
    try {
      const response = await fetch(`${environment.apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const responseData = await response.json();
      if (responseData.successful) {
        this.dialogMessage = 'Usuario creado correctamente';
        this.formUserComponent.resetForm();
        this.users.unshift(responseData.data);
        this.tabIndex = "0";
      } else {
        this.dialogMessage = responseData.message;
      }
      this.dialogVisible = true;
      this.cdr.detectChanges();
    } catch (error) {
      this.dialogMessage = 'Error al crear el usuario';
      this.dialogVisible = true;
      this.cdr.detectChanges();
    }
  }

  public deleteUserDialog(user: User): void {
    this.userToDelete = user;
    this.deleteDialogVisible = true;
    this.cdr.detectChanges();
  }

  async deleteUser(user: User): Promise<void> {
    this.deleteDialogVisible = false;
    const token = localStorage.getItem('auth');
    try {
      const response = await fetch(`${environment.apiUrl}/users/${user.id_user}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.successful) {
        this.users = this.users.filter(u => u.id_user !== user.id_user);
        console.log(this.users);
        this.dialogMessage = 'Usuario eliminado correctamente';
      } else {
        this.dialogMessage = result.message || 'No se pudo eliminar el usuario';
      }
      this.dialogVisible = true;
      this.userToDelete = null;
      this.cdr.detectChanges();
    } catch (error) {
      this.dialogMessage = 'Error al eliminar el usuario';
      this.dialogVisible = true;
      this.cdr.detectChanges();
      this.userToDelete = null;
    }
  }
}
