import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.gard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'auth' },
    {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
            { path: 'feed', loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent) },
            { path: 'details/:id', loadComponent: () => import('./pages/post-detail/post-detail.component').then(m => m.PostDetailComponent) },
            {path: 'topics', loadComponent: () => import('./pages/topic/topic.component').then(m => m.TopicComponent) },
        ]
    },
    { path: 'auth', loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent) },
    { path: '**', redirectTo: 'feed' },
    { path: '', redirectTo: 'feed', pathMatch: 'full' },
];
