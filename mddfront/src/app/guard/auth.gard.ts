import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { catchError, filter, map, Observable, of, switchMap, take } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}
  canActivateChild(): Observable<boolean | UrlTree> {
    return this.authService.isReady$.pipe(
      filter(isReady => {
        console.log(`AuthGuard: isReady$ emitted: ${isReady}`);
        return isReady;
      }),
      take(1),
      switchMap(() => {
        console.log('AuthGuard: isReady$ is true, checking user authentication');
        const user = this.authService.getUser();
        if (user) {
            console.log('AuthGuard: User is authenticated, allowing access');
            return of(true);
        } else {
            console.warn('AuthGuard: User not authenticated, redirecting to /auth');
            return of(this.router.createUrlTree(['/auth']));
        }
      })
    );
  }

}