import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { CustomerSidebar } from '../../../shared/customer/customer-sidebar/customer-sidebar';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-my-purchased-orders',
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
  templateUrl: './my-purchased-orders.html',
  styleUrl: './my-purchased-orders.css',
})
export class MyPurchasedOrders {
myPurchasedOrder:any;
constructor(private customerService :CustomerService,
  private cdr: ChangeDetectorRef){}
ngOnInit():void{
  this.MyPurchasedOrders();
}
  MyPurchasedOrders(){
    this.customerService.getPurchasedOrdersByUserId().subscribe(res=>{
      this.myPurchasedOrder = res;
      this.cdr.detectChanges(); // Force Angular à vérifier les changements
    })
}
}
