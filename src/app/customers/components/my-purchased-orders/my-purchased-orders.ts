import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomerSidebar } from '../../../shared/customer/customer-sidebar/customer-sidebar';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-my-purchased-orders',
  imports: [
    CommonModule,
    CustomerSidebar,
    RouterLink,
  ],
  templateUrl: './my-purchased-orders.html',
  styleUrl: './my-purchased-orders.css',
})
export class MyPurchasedOrders {
  myPurchasedOrder: any;

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.MyPurchasedOrders();
  }

  MyPurchasedOrders() {
    this.customerService.getPurchasedOrdersByUserId().subscribe(res => {
      this.myPurchasedOrder = res;
      this.cdr.detectChanges();
    });
  }
}