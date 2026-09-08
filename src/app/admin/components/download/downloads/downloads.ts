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
  selector: 'app-downloads',
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
    templateUrl: './downloads.html',
  styleUrl: './downloads.css',
})
export class Downloads {
downloads : any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
itemsPerPage: number = 6;
constructor(private adminService :AdminService,private snackBar :MatSnackBar,private cdr: ChangeDetectorRef
){

}
ngOnInit(){
  this.getDownloads();
}
getDownloads(){
  this.adminService.getAllDownloads().subscribe(res=>{
    this.downloads = res;
   this.cdr.detectChanges(); 

  })
}
 searchDownloads() {
    if (this.searchQuery.trim() !== '') {
      this.adminService.getDownloadsByUserName(this.searchQuery).subscribe({
        next: (res) => {
          this.downloads = res;
          console.log("Téléchargemenets trouvées :", this.downloads);
        },
        error: (err) => {
          console.error("Erreur lors de la recherche", err);
        }
      });
    } else {
      // Optionnel : recharger toutes les téléchargements si le champ est vide
      this.downloads = [];
    }
  }
  // Méthode pour obtenir la liste filtrée selon la page active
get paginatedDownloads() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.downloads.slice(startIndex, startIndex + this.itemsPerPage);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
  return Math.ceil(this.downloads.length / this.itemsPerPage);
}

// Méthode pour changer de page
changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}
}
