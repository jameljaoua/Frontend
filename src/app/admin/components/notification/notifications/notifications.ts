import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-notifications',
  imports: [
      FormsModule,
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
notifications : any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
itemsPerPage: number = 6;
constructor(private adminService :AdminService,private snackBar :MatSnackBar,private cdr: ChangeDetectorRef
){

}
ngOnInit(){
  this.loadNotifications();  
}
  loadNotifications() {
    this.adminService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.cdr.detectChanges(); // Force Angular à voir les nouvelles notifications
      },
      error: (err) => console.error("Erreur chargement notifications", err)
    });
  }
  searchNotifications() {
    if (this.searchQuery.trim() !== '') {
      this.adminService.getPaymentsByUserName(this.searchQuery).subscribe({
        next: (res) => {
          this.notifications = res;
          console.log("notifications trouvées :", this.notifications);
        },
        error: (err) => {
          console.error("Erreur lors de la recherche", err);
        }
      });
    } else {
      // Optionnel : recharger toutes les téléchargements si le champ est vide
      this.notifications = [];
    }
  }
  // Méthode pour obtenir la liste filtrée selon la page active
get paginatedNotifications() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.notifications.slice(startIndex, startIndex + this.itemsPerPage);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
  return Math.ceil(this.notifications.length / this.itemsPerPage);
}

// Méthode pour changer de page
changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}
}