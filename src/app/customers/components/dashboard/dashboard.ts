import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
//import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core'; // Importez ceci
import { CustomerSidebar } from '../../../shared/customer/customer-sidebar/customer-sidebar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Assurez-vous d'être en mode standalone si vous utilisez 'imports'
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
    CustomerSidebar,
    RouterLink,
      FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
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