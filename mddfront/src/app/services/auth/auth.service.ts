import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, Observable, of, ReplaySubject, tap } from 'rxjs';
import { RegisterForm } from '../../models/form/auth/register/register-form';
import { LoginFormInterface } from '../../models/form/auth/login/login-form-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http : HttpClient
  ) { 
    this.isReadySubject.next(false);
  }

  private isReadySubject = new ReplaySubject<boolean>(1);
  isReady$ = this.isReadySubject.asObservable();
  private hasLoadedMe = false;
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private hasAttemptedMeLoad = false;

  private readonly API_URL = 'http://localhost:9000/api/auth';


  register(data : RegisterForm): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data, { withCredentials: true }).pipe(
      tap(response => {
        this.currentUserSubject.next(response);
        console.log('API /login succès, utilisateur:', response);
        try {
          localStorage.setItem('currentUser', JSON.stringify(response));
          console.log('Utilisateur enregistré dans localStorage.');
        } catch (e) {
          console.error('Erreur lors de l\'enregistrement dans localStorage:', e);
        }
      }),
      catchError(error => {
        console.warn("API /login erreur, utilisateur non authentifié:", error);
        this.currentUserSubject.next(null);
        return of(null);
      }
      )
    );
  }

  login(data : LoginFormInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data, { withCredentials: true }).pipe(
      tap(response => {
        this.currentUserSubject.next(response);
        console.log('API /login succès, utilisateur:', response);
        try {
          localStorage.setItem('currentUser', JSON.stringify(response));
          console.log('Utilisateur enregistré dans localStorage.');
        } catch (e) {
          console.error('Erreur lors de l\'enregistrement dans localStorage:', e);
        }
      }),
      catchError(error => {
        console.warn("API /login erreur, utilisateur non authentifié:", error);
        this.currentUserSubject.next(null);
        return of(null);
      }
      )
    );
  }

  me(): Observable<any> {
    if (this.currentUserSubject.value !== null) {
      return of(this.currentUserSubject.value);
    }
     return this.http.get<any>(`${this.API_URL}/me`, { withCredentials: true }).pipe(
      tap(user => {
        console.log('API /me succès, utilisateur:', user);
        this.currentUserSubject.next(user);
        this.hasLoadedMe = true;
        try {
          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log('Utilisateur enregistré dans localStorage.');
        } catch (e) {
          console.error('Erreur lors de l\'enregistrement dans localStorage:', e);
        }
      }),
      catchError(error => {
        console.warn("API /me erreur, utilisateur non authentifié ou session invalide:", error);
        this.currentUserSubject.next(null);
        this.hasLoadedMe = true;
        return of(null);
      })
    );
}

  init(): Promise<void> {
    if (this.hasAttemptedMeLoad) {
      console.log('AuthService: init() called, but me() already attempted. Signaling ready.');
      this.isReadySubject.next(true);
      this.isReadySubject.complete();
      return Promise.resolve();
    }

    this.hasAttemptedMeLoad = true;
    console.log('AuthService: init() starting initial me() call on browser platform.');
    return firstValueFrom(this.me()).then(() => {
      console.log('AuthService: init() finished on browser. Signaling ready.');
      this.isReadySubject.next(true);
      this.isReadySubject.complete();
    }).catch(error => {
      console.error('AuthService: init() encountered an error on browser. Signaling ready anyway.', error);
      this.isReadySubject.next(true);
      this.isReadySubject.complete();
    });
    
  }

  getUser(): Observable<any> {
    return this.currentUserSubject.value;
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        console.log('API /logout succès, utilisateur déconnecté');
        this.currentUserSubject.next(null);
      }),
      catchError(error => {
        console.warn("API /logout erreur:", error);
        return of(null);
      })
    );
  }
}
