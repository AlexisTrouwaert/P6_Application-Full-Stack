import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonsComponent } from '../../buttons/buttons.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-mobile-nav-bar',
  standalone: true,
  imports: [
    ButtonsComponent
  ],
  templateUrl: './mobile-nav-bar.component.html',
  styleUrl: './mobile-nav-bar.component.scss'
})
export class MobileNavBarComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  @Output() closeNavBar = new EventEmitter<void>();

  onBackgroundClick(): void {
    this.closeNavBar.emit();
  }

  onNavigationClick(event: Event): void {
    event.stopPropagation();
  }


  redirectToProfile(){
    this.router.navigate(['/profile']);
  }

  logOut() {
    console.log("Déconnexion en cours...");
    this.authService.logout().subscribe({
      next: () => {
        console.log("Déconnexion réussie");
        this.router.navigate(['/auth']);
      }
      ,
      error: (err) => {
        console.error("Erreur lors de la déconnexion:", err);
      }
    });
  }

  redirecttoArticles(){
    this.router.navigate(['/articles']);
  }

  redirectToTopic(){
    this.router.navigate(['/topic']);
  }
}
