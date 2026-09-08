import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transactions',
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
  ],  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
transactions :  any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
itemsPerPage: number = 6;
constructor(private adminService :AdminService,private snackBar :MatSnackBar,private cdr: ChangeDetectorRef
){

}
ngOnInit(){
  this.getTransactions();
}
getTransactions(){
  this.adminService.getAllTransactions().subscribe(res=>{
    this.transactions = res;
   this.cdr.detectChanges(); 

  })
}
 searchTransactions() {
    if (this.searchQuery.trim() !== '') {
      this.adminService.getPaymentsByUserName(this.searchQuery).subscribe({
        next: (res) => {
          this.transactions = res;
          console.log("transactions trouvées :", this.transactions);
        },
        error: (err) => {
          console.error("Erreur lors de la recherche", err);
        }
      });
    } else {
      // Optionnel : recharger toutes les téléchargements si le champ est vide
      this.transactions = [];
    }
  }
  // Méthode pour obtenir la liste filtrée selon la page active
get paginatedTransactions() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.transactions.slice(startIndex, startIndex + this.itemsPerPage);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
  return Math.ceil(this.transactions.length / this.itemsPerPage);
}

// Méthode pour changer de page
changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}
}
