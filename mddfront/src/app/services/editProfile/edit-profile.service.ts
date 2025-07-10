import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInfo } from '../../models/user-info';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {

  constructor(
    private http : HttpClient,
    private authService: AuthService
  ) { }

  private readonly API_URL = 'http://localhost:9000/api/profile';

  editProfile(data: any): Observable<UserInfo> {
    return this.http.put<UserInfo>(`${this.API_URL}`, data, { withCredentials: true }).pipe(
          tap(response => {
            try {
              this.authService.updateCurrentUser(response);
              console.log('Utilisateur enregistré dans localStorage.');
            } catch (e) {
              console.error('Erreur lors de l\'enregistrement dans localStorage:', e);
            }
          }),
          catchError(error => {
            console.warn("API /login erreur, utilisateur non authentifié:", error);
            return throwError(() => error);
          }
          )
        );
  }
}
