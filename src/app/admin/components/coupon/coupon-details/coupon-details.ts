import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-coupon-details',
    standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './coupon-details.html',
  styleUrl: './coupon-details.css',
})
export class CouponDetails implements OnInit{
  couponId!: number;
  coupon: any;
constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.couponId = Number(params.get('couponId'));
      if (this.couponId) {
        this.getCouponDetails();
      } else {
        this.snackBar.open('Invalid coupon ID', 'ERROR', {duration: 3000});
      }
    });
  
  }
  getCouponDetails() {
    this.adminService.getCouponById(this.couponId).subscribe({
      next: res => {
        if (res) {
          this.coupon = res;
          console.log('Coupon ID:', this.couponId);
          console.log('Coupon details:', this.coupon);
          this.cdr.detectChanges(); 
        } else {
          this.snackBar.open('Coupon not found', 'ERROR', {duration: 3000});
        }
      },
      error: err => {
        console.error('Error fetching coupon:', err);
        this.snackBar.open('Error loading coupon details', 'ERROR', {duration: 3000});
      }
    });
  }

}
