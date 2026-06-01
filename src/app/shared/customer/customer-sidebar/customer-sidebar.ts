import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';

@Component({
  selector: 'app-customer-sidebar',
    imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './customer-sidebar.html',
  styleUrl: './customer-sidebar.css',
})
export class CustomerSidebar implements OnInit{
  userName: string = ""; // Valeur par défaut
  userRole: string = "";
  userImg: string = "";
  isCustomerLoggedIn : boolean = UserStorageService.isCustomerLoggedIn();
  constructor(private router: Router, private cdRef: ChangeDetectorRef) {}
ngOnInit(): void {
    // Initialisation au premier chargement
    this.refreshUserInformation();

    // Mise à jour automatique à chaque changement de navigation
    this.router.events.subscribe(() => {
      this.refreshUserInformation();
      this.cdRef.detectChanges(); // Force Angular à voir les nouvelles valeurs
    });
  }
 // Méthode centralisée pour récupérer les infos
  private refreshUserInformation(): void {
    this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
    
    if (this.isCustomerLoggedIn) {
      const user = UserStorageService.getUser();
      if (user != null) {
        this.userName = user.name; // C'est ici que le nom est récupéré
        this.userRole = user.role;
        // Stockez l'image (qui est maintenant une string base64)
        this.userImg = 'data:image/jpeg;base64,' + user.img;
      }
    }
  }
  
  logout() {
      UserStorageService.signOut();
      this.router.navigateByUrl('login');
  }
}
