import { Component, HostListener, OnInit } from '@angular/core';
import { ButtonsComponent } from '../buttons/buttons.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MobileNavBarComponent } from './mobile-nav-bar/mobile-nav-bar.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    ButtonsComponent,
    CommonModule,
    MobileNavBarComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  constructor(
    private router : Router,
    private authService: AuthService
  ) { }

  isLargeScreen: boolean = window.innerWidth > 768;

  openNavBarMobile: boolean = false;

  @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.isLargeScreen = event.target.innerWidth >= 768;
    }

  ngOnInit() {
    this.isLargeScreen = window.innerWidth >= 768;
  }

  redirectToFeed(){
    this.router.navigate(['/feed']);
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
    this.router.navigate(['/topics']);
  }
}
