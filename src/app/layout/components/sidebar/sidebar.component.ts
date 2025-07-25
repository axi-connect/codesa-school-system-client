import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
    label: string;
    icon: string;
    route?: string;
    badge?: string;
}

@Component({
    selector: 'app-sidebar',
    imports: [RouterModule, CommonModule],
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent {
    public menuItems: MenuItem[] = [
        { label: 'Inicio', icon: 'pi pi-home', route: '/system' },
        { label: 'Usuarios', icon: 'pi pi-user', route: 'users' },
        { label: 'Estudiantes', icon: 'pi pi-address-book', route: '/students', badge: '5' },
        { label: 'Profesores', icon: 'pi pi-graduation-cap', route: '/teachers', badge: '8' },
        { label: 'Cursos', icon: 'pi pi-bookmark', route: '/courses' },
        { label: 'Inscripciones', icon: 'pi pi-receipt', route: '/inscriptions', badge: '25' },
    ];
}