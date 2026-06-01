import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
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
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
orders  : any;
constructor(private adminService :AdminService,private snackBar :MatSnackBar,private cdr: ChangeDetectorRef
){

}
ngOnInit(){
  this.getOrders();
}
getOrders(){
  this.adminService.getAllOrders().subscribe(res=>{
    this.orders = res;
   this.cdr.detectChanges(); 

  })
}
  deleteOrder(orderId: number) {
    this.adminService.deleteOrder(orderId).subscribe(res => {
      if (!res.body) {
        this.snackBar.open('Order Deleted Successfully!', 'Close', { duration: 3000 });
        this.getOrders();
      }
    });
  }
}
