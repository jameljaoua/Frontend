import { ChangeDetectorRef, Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CustomerSidebar } from '../../../shared/customer/customer-sidebar/customer-sidebar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  imports: [
            CommonModule,
    MatCardModule,
    MatDividerModule,
   // RouterLink,
    MatButtonModule,
    ReactiveFormsModule, // Pour [formGroup] et formControlName
    MatFormFieldModule,  // Pour <mat-form-field>
    MatInputModule,      // Pour l'attribut matInput
    MatIconModule ,
    CustomerSidebar,FormsModule,RouterLink
  ],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders {
myOrder:any;
constructor(private customerService :CustomerService,
  private cdr: ChangeDetectorRef){}
ngOnInit():void{
  this.getMyOrders();
}
  getMyOrders(){
    this.customerService.getOrdersByUserId().subscribe(res=>{
      this.myOrder = res;
      this.cdr.detectChanges(); // Force Angular à vérifier les changements
    })
}
}