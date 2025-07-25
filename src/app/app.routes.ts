import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { SystemPageComponent } from './pages/system/system-page';

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
                loadChildren: () => import('./modules/users/users-module').then(m => m.UsersModule)
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
