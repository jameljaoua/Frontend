import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { ChangeDetectorRef } from '@angular/core'; // Importez ceci
import { AdminService } from '../../../admin/service/admin.service';

@Component({
  selector: 'app-admin-header',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader implements OnInit{
  notifications: any[] = [];
  userName: string = ""; // Valeur par défaut
  userRole: string = "";
  userImg: string = "";
  isAdminLoggedIn : boolean = UserStorageService.isAdminLoggedIn();
  constructor(private router: Router, private adminService: AdminService, private cdRef: ChangeDetectorRef) {}
ngOnInit(): void {
    // 1. Initialisation au premier chargement (AJOUT DE L'APPEL ICI)
    this.refreshUserInformation();
    this.loadNotifications(); //  charge les données immédiatement dès l'affichage du header

    // 2. Recharger les notifications toutes les 30 secondes pour simuler le temps réel
    setInterval(() => {
      this.loadNotifications();
    }, 30000);

    // 3. Mise à jour automatique à chaque changement de navigation
    this.router.events.subscribe(() => {
      this.refreshUserInformation();
      this.loadNotifications();
      this.cdRef.detectChanges(); // Force Angular à voir les nouvelles valeurs
    });
}
  loadNotifications() {
    this.adminService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.cdRef.detectChanges(); // Force Angular à voir les nouvelles notifications
      },
      error: (err) => console.error("Erreur chargement notifications", err)
    });
  }
  // Calcule le nombre exact de notifications non lues pour le badge
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;

  }
  markAsRead(notification: any) {
    this.adminService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.cdRef.detectChanges(); // Force Angular à voir le changement d'état
      },
      error: (err) => console.error(err)
    });
  }
 // Méthode centralisée pour récupérer les infos
  private refreshUserInformation(): void {
    this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
    
    if (this.isAdminLoggedIn) {
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
