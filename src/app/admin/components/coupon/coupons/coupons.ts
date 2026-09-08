import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { ChangeDetectorRef } from '@angular/core'; // Importez ceci
@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [
        CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
     FormsModule,
    
  ],
  templateUrl: './coupons.html',
  styleUrl: './coupons.css',
})
export class Coupons implements OnInit {
    searchText: string = '';

  coupons: any[] = [];
    searchCouponForm!: FormGroup;
 currentPage: number = 1;
itemsPerPage: number = 6;
  displayedColumns: string[] = [
    'name',
    'code',
    'discount',
    'expirationDate',
  ];
    constructor(
      private adminService: AdminService,
      private fb: FormBuilder,
      private snackBar: MatSnackBar,
      private cdr: ChangeDetectorRef // Injectez ceci
  ) {}
  ngOnInit(): void {
        this.searchCouponForm = this.fb.group({
      title: [null, Validators.required]
    });

    this.getAllCoupons();
  }
getAllCoupons() {
  this.adminService.getCoupons().subscribe(res => {
    this.coupons = res; 
    this.cdr.detectChanges(); 
  });
}
 get filteredCoupons() {
      let result = this.coupons;

  // Correction de la condition : on filtre si searchText contient du texte
  if (this.searchText && this.searchText.trim() !== '') {
    result = this.coupons.filter(coupon =>
      coupon.name_cpn && coupon.name_cpn
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  // Application de la pagination directement sur la liste résultante
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return result.slice(startIndex, startIndex + this.itemsPerPage);
  
}
    submitForm() {
    const title = this.searchCouponForm.value.title;
    this.adminService.getAllCouponsByName(title).subscribe(res => {
      this.coupons = res.map((c: any) => ({
        ...c,
      }));
    });
  }
    deleteCoupon(couponId: number) {
    this.adminService.deleteCoupon(couponId).subscribe(res => {
      if (!res.body) {
        this.snackBar.open('Coupon Deleted Successfully!', 'Close', { duration: 3000 });
        this.getAllCoupons();
      }
    });
  }
        // Méthode pour obtenir la liste filtrée selon la page active
get paginatedCoupons() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.coupons.slice(startIndex, startIndex + this.itemsPerPage);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
  const count = this.searchText && this.searchText.trim() !== ''
    ? this.coupons.filter(coupon => coupon.name_cpn && coupon.name_cpn.toLowerCase().includes(this.searchText.toLowerCase())).length 
    : this.coupons.length;
    
  return Math.ceil(count / this.itemsPerPage) || 1;
}

// 3. Changement de page
changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}
}
