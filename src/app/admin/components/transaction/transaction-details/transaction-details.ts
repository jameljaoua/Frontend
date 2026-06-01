import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-transaction-details',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './transaction-details.html',
  styleUrl: './transaction-details.css',
})
export class TransactionDetails implements OnInit{
  paymentId!: number;
  transaction: any;
constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }
ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.paymentId = Number(params.get('paymentId'));
      if (this.paymentId) {
        this.getTransactionDetails();
      } else {
        this.snackBar.open('Invalid payment ID', 'ERROR', {duration: 3000});
      }
    });
  
  }
 getTransactionDetails() {
    this.adminService.getTransactionById(this.paymentId).subscribe({
      next: res => {
        if (res) {
          this.transaction = res;
          console.log('Transaction ID:', this.paymentId);
          console.log('Transaction details:', this.transaction);
          this.cdr.detectChanges(); 
        } else {
          this.snackBar.open('Transaction not found', 'ERROR', {duration: 3000});
        }
      },
      error: err => {
        console.error('Error fetching transaction:', err);
        this.snackBar.open('Error loading transaction details', 'ERROR', {duration: 3000});
      }
    });
  }
}
