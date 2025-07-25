import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    imports: [RouterOutlet, CommonModule, SidebarComponent],
})

export class LayoutComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit(): void {
        const auth = localStorage.getItem('auth');
        if (!auth) {
            this.router.navigate(['auth/login']);
        }
    }
}
