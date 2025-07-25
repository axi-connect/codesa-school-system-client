import { Card } from "primeng/card";
import { Button } from "primeng/button";
import { TabsModule } from "primeng/tabs";
import { TableModule } from "primeng/table";
import { BadgeModule } from "primeng/badge";
import { FormsModule } from '@angular/forms';
import { AvatarModule } from "primeng/avatar";
import { DialogModule } from "primeng/dialog";
import { RouterModule } from "@angular/router";
import { User } from "../users/user.component";
import { InputTextModule } from "primeng/inputtext";
import { FloatLabelModule } from "primeng/floatlabel";
import { environment } from '../../../environments/environment';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormComponent, FormConfig } from "../../components/form/form.component";

export interface Teacher extends User {
  id_user: number;
  especialidad: string;
  fecha_contratacion: string; // ISO string o formato YYYY-MM-DD
}

@Component({
  selector: 'app-teacher-form',
  templateUrl: './student.component.html',
  imports: [DialogModule, InputTextModule, FormsModule, TableModule, Card, TabsModule, AvatarModule, BadgeModule, RouterModule, FloatLabelModule, FormComponent, Button],
})

export class StudentComponent implements OnInit{
  public tabIndex = "0";

  public users: User[] = [];
  public teachers: Teacher[] = [];
  public loadingTable: boolean = true;
  public dialogVisible: boolean = false;
  public teacherToEdit: User | null = null;
  public teacherToDelete: User | null = null;
  public deleteDialogVisible: boolean = false;
  public dialogMessage: string | null = null;
  @ViewChild('TeachersFormComponent') formTeacherComponent!: FormComponent;

  constructor(private cdr: ChangeDetectorRef) {}

  public formConfig: FormConfig = {
    title: 'Registro de Estudiantes',
    icon: 'pi pi-user-graduate',
    fields: []
  };

  public formDefaultValues:{[key: string]:any} = {};

  public editTeacher(teacher:Teacher){
    this.tabIndex = "1";
    this.formDefaultValues = {...teacher, fecha_contratacion: new Date(teacher.fecha_contratacion)}

    this.teacherToEdit = teacher;
    this.formTeacherComponent.isEditMode = true;
    this.cdr.detectChanges();
  }

  async ngOnInit(): Promise<void> {
    this.loadingTable = true;
    const token = localStorage.getItem('auth');
    try {
      const teachersResponse = await fetch(`${environment.apiUrl}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const usersResponse = await fetch(`${environment.apiUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const users = await usersResponse.json();
      const teachers = await teachersResponse.json();

      this.users = users.data;
      this.teachers = teachers.data;

      this.formConfig = {
        ...this.formConfig,
        fields: [
          { placeholder: 'Usuario', name: 'id_user', type: 'select', required: true, options: this.users.map((u:any) => ({id: u.id_user, text: `${u.nombre} ${u.apellido}`})) },
          { label: 'Grado', name: 'grado', type: 'text', required: true },
          { label: 'Número de Matrícula', name: 'numero_matricula', type: 'number', required: true},
        ]
      }
    } catch (error) {
      this.users = [];
    } finally {
      this.loadingTable = false;
      this.cdr.detectChanges();
    }
  }

  async onFormSubmit(formData: any): Promise<void> {
    if(this.formTeacherComponent.isEditMode) this.updateTeacher(formData);
    else this.createTeacher(formData);
  }

  async createTeacher(formData: any): Promise<void> {
    this.formTeacherComponent.loading = true;
    const token = localStorage.getItem('auth');
    try {
      const response = await fetch(`${environment.apiUrl}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const responseData = await response.json();
      if (responseData.successful) {
        this.dialogMessage = responseData.message || 'Registro creado correctamente';
        this.formTeacherComponent.resetForm();
        this.teachers.unshift(responseData.data);
        this.tabIndex = "0";
      } else {
        this.dialogMessage = responseData.message;
      }
      this.dialogVisible = true;
      this.cdr.detectChanges();
    } catch (error) {
      this.dialogMessage = 'Error al crear el registro';
      this.dialogVisible = true;
      this.cdr.detectChanges();
    } finally {
      this.formTeacherComponent.loading = false;
    }
  }

  async updateTeacher(formData: any): Promise<void> {
    this.formTeacherComponent.loading = true;
    const token = localStorage.getItem('auth');
    // Clonar y eliminar el campo password si existe
    const dataToUpdate = { ...formData };
    delete dataToUpdate.password;
    try {
      const response = await fetch(`${environment.apiUrl}/students/${this.teacherToEdit?.id_user}`, {
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
        this.teachers = this.teachers.map(u =>
          u.id_user === responseData.data.id_user ? responseData.data : u
        );
        this.dialogMessage = responseData.message || 'Registro actualizado correctamente';
        this.formTeacherComponent.resetForm();
        this.tabIndex = "0";
        this.teacherToEdit = null;
      } else {
        this.dialogMessage = responseData.message || 'No se pudo actualizar el registro';
      }
      this.dialogVisible = true;
      this.cdr.detectChanges();
    } catch (error) {
      this.dialogMessage = 'Error al actualizar el registro';
      this.dialogVisible = true;
      this.cdr.detectChanges();
    } finally {
      this.formTeacherComponent.loading = false;
    }
  }

  public deleteUserDialog(user: User): void {
    this.teacherToDelete = user;
    this.deleteDialogVisible = true;
    this.cdr.detectChanges();
  }

  async deleteUser(user: User): Promise<void> {
    this.deleteDialogVisible = false;
    const token = localStorage.getItem('auth');
    try {
      const response = await fetch(`${environment.apiUrl}/students/${user.id_user}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.successful) {
        this.teachers = this.teachers.filter(u => u.id_user !== user.id_user);
        this.dialogMessage = result.message || 'Registro eliminado correctamente';
      } else {
        this.dialogMessage = result.message || 'No se pudo eliminar el registro';
      }
      this.dialogVisible = true;
      this.teacherToDelete = null;
      this.cdr.detectChanges();
    } catch (error) {
      this.dialogMessage = 'Error al eliminar el registro';
      this.dialogVisible = true;
      this.cdr.detectChanges();
      this.teacherToDelete = null;
    }
  }
}