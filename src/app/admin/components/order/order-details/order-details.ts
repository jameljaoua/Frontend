import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit{
  orderId!: number;
  order: any;
constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
      if (this.orderId) {
        this.getOrderDetails();
      } else {
        this.snackBar.open('Invalid order ID', 'ERROR', {duration: 3000});
      }
    });
  
  }
 getOrderDetails() {
    this.adminService.getOrderById(this.orderId).subscribe({
      next: res => {
        if (res) {
          this.order = res;
          console.log('Order ID:', this.orderId);
          console.log('Order details:', this.order);
          this.cdr.detectChanges(); 
        } else {
          this.snackBar.open('Order not found', 'ERROR', {duration: 3000});
        }
      },
      error: err => {
        console.error('Error fetching order:', err);
        this.snackBar.open('Error loading order details', 'ERROR', {duration: 3000});
      }
    });
  }

}
