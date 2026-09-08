import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStorageService } from '../../../../services/storage/user-storage.service';
import { CustomerSidebar } from '../../../../shared/customer/customer-sidebar/customer-sidebar';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-my-notifications',
  imports: [
    CommonModule,
    CustomerSidebar,
    RouterLink,
  ],
  templateUrl: './my-notifications.html',
  styleUrl: './my-notifications.css',
})
export class MyNotifications {
  myNotifications: any[] = [];
  userId = Number(UserStorageService.getUserId());

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomerNotifications();
    this.cdr.detectChanges();
  }

  loadCustomerNotifications() {
    this.customerService.getCustomerNotifications(this.userId).subscribe({
      next: (data) => {
        this.myNotifications = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur chargement notifications", err)
    });
  }
}