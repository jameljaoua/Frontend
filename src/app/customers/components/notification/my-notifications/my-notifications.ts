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
import { UserStorageService } from '../../../../services/storage/user-storage.service';
import { CustomerSidebar } from '../../../../shared/customer/customer-sidebar/customer-sidebar';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-my-notifications',
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
  templateUrl: './my-notifications.html',
  styleUrl: './my-notifications.css',
})
export class MyNotifications {
    myNotifications: any[] = [];
    userId = Number(UserStorageService.getUserId());
    
  constructor(private customerService :CustomerService,
  private cdr: ChangeDetectorRef){}
ngOnInit(): void {
  this.loadCustomerNotifications();
      this.cdr.detectChanges();

}
loadCustomerNotifications() {
  this.customerService.getCustomerNotifications(this.userId).subscribe({
      next: (data) => {
        this.myNotifications = data;
        this.cdr.detectChanges(); // Force Angular à voir les nouvelles notifications
      },
      error: (err) => console.error("Erreur chargement notifications", err)
    });
}

}
