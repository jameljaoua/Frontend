import { Component } from '@angular/core';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-footer',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './customer-footer.html',
  styleUrl: './customer-footer.css',
})
export class CustomerFooter {
  isCustomerLoggedIn: boolean = UserStorageService.isCustomerLoggedIn();
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
    });
  }
}