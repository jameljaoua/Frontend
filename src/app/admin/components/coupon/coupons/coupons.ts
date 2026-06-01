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
  if (!this.searchText) {
    return this.coupons;
  }

  return this.coupons.filter(coupon =>
    coupon.name_cpn
      .toLowerCase()
      .includes(this.searchText.toLowerCase())
  );
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
}
