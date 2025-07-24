import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.gard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'auth' },
    {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
            { path: 'feed', loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent) },
            { path: 'topic-feed/:id', loadComponent: () => import('./pages/topic-feed/topic-feed.component').then(m => m.TopicFeedComponent) },
            { path: 'details/:id', loadComponent: () => import('./pages/post-detail/post-detail.component').then(m => m.PostDetailComponent) },
            { path: 'topics', loadComponent: () => import('./pages/topic/topic.component').then(m => m.TopicComponent) },
            { path: 'profile', loadComponent: () => import('./pages/profil-page/profil-page.component').then(m => m.ProfilPageComponent) },
        ]
    },
    { path: 'auth', loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent) },
    { path: '**', redirectTo: 'feed' },
    { path: '', redirectTo: 'feed', pathMatch: 'full' },
];
