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
import { environment } from '../../../environments/environment';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormComponent, FormConfig } from "../../components/form/form.component";

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
  public userToEdit: User | null = null;
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

    this.userToEdit = customer;
    this.formUserComponent.isEditMode = true;
    this.formUserComponent.disableField('password');
    this.cdr.detectChanges();
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
      this.loadingTable = false;
      this.cdr.detectChanges();
    }
  }

  async onFormSubmit(formData: any): Promise<void> {
    if(this.formUserComponent.isEditMode) this.updateUser(formData);
    else this.createUser(formData);
  }

  async createUser(formData: any): Promise<void> {
    this.formUserComponent.loading = true;
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
    } finally {
      this.formUserComponent.loading = false;
    }
  }

  async updateUser(formData: any): Promise<void> {
    this.formUserComponent.loading = true;
    const token = localStorage.getItem('auth');
    // Clonar y eliminar el campo password si existe
    const dataToUpdate = { ...formData };
    delete dataToUpdate.password;
    try {
      const response = await fetch(`${environment.apiUrl}/users/${this.userToEdit?.id_user}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToUpdate)
      });
      
      const responseData = await response.json();
      if (responseData.successful) {
        // Actualizar el usuario en la lista
        this.users = this.users.map(u =>
          u.id_user === responseData.data.id_user ? responseData.data : u
        );
        this.dialogMessage = 'Usuario actualizado correctamente';
        this.formUserComponent.resetForm();
        this.tabIndex = "0";
        this.userToEdit = null;
      } else {
        this.dialogMessage = responseData.message || 'No se pudo actualizar el usuario';
      }
      this.dialogVisible = true;
      this.cdr.detectChanges();
    } catch (error) {
      this.dialogMessage = 'Error al actualizar el usuario';
      this.dialogVisible = true;
      this.cdr.detectChanges();
    } finally {
      this.formUserComponent.loading = false;
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