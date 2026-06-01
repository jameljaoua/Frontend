import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transactions',
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
  ],  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
transactions : any;
constructor(private adminService :AdminService,private snackBar :MatSnackBar,private cdr: ChangeDetectorRef
){

}
ngOnInit(){
  this.getTransactions();
}
getTransactions(){
  this.adminService.getAllTransactions().subscribe(res=>{
    this.transactions = res;
   this.cdr.detectChanges(); 

  })
}
}
