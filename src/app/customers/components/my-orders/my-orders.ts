import { ChangeDetectorRef, Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { CustomerSidebar } from '../../../shared/customer/customer-sidebar/customer-sidebar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  imports: [
    CommonModule,
    CustomerSidebar,
    RouterLink,
  ],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders {
  myOrder: any;

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getMyOrders();
  }

  getMyOrders() {
    this.customerService.getOrdersByUserId().subscribe(res => {
      this.myOrder = res;
      this.cdr.detectChanges();
    });
  }
}