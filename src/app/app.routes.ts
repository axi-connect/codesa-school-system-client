import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { SystemPageComponent } from './pages/system/system-page';
import { UserComponent } from './modules/users/user.component';
import { TeacherComponent } from './modules/teachers/teacher.component';
import { StudentComponent } from './modules/students/student.component';

export const routes: Routes = [
    {
        path: 'system',
        component: LayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: SystemPageComponent,
            },
            {
                path: 'users',
                component: UserComponent
            },
            {
                path: 'teachers',
                component: TeacherComponent
            },
            {
                path: 'students',
                component: StudentComponent
            },
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth-routing-module').then(m => m.AuthRoutingModule)
    },
    {
        path: '**',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    }
];
