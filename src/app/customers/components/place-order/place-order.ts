import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-place-order',
  imports: [
            CommonModule,
            ReactiveFormsModule,
            MatSnackBarModule,
            MatButtonModule,
            MatFormFieldModule,
            MatInputModule,
            MatIconModule,
            MatSelectModule,
        MatNativeDateModule,
        MatCard,
        MatCardTitle,
        MatCardContent
  ],
  templateUrl: './place-order.html',
  styleUrl: './place-order.css',
})
export class PlaceOrder {
  orderForm !: FormGroup;
  constructor(private customerService :CustomerService,
    private snackbar :MatSnackBar,
    private fb : FormBuilder,
    private router : Router,
    public dialog :Dialog,
      private cdr: ChangeDetectorRef // Injectez ceci
){}
    ngOnInit():void{
      this.orderForm = this.fb.group({
        phone : [null,[Validators.required]],
        orderDescription : [null],
      })
    }
    placeOrder(){ 
      this.customerService.placeOrder(this.orderForm.value).subscribe(res=>{
        if (res.id != null) {
          this.snackbar.open("Order placed successfully","Close",{duration:5000});
          this.router.navigate(['/customer/dashboard']);
          this.closeForm();
        }else{
          this.snackbar.open("Something went wrong","Close",{duration:5000});
        }
    })
}
closeForm(){
  this.dialog.closeAll();
}
}
