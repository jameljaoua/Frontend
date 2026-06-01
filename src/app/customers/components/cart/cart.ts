import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core'; // Importez ceci
import {  MatInputModule } from '@angular/material/input'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { PlaceOrder } from '../place-order/place-order';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true, // Assurez-vous d'être en mode standalone si vous utilisez 'imports'
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatInputModule,     // Remplace MatError, MatLabel, etc. pour plus de simplicité
    MatFormFieldModule,
    RouterLink
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartItems : any[] = [];
  order :any;
  couponForm !: FormGroup;

  constructor(private customerService :CustomerService,
    private snackbar :MatSnackBar,
    private fb : FormBuilder,
    public dialog :Dialog,
      private cdr: ChangeDetectorRef // Injectez ceci
){}
    ngOnInit():void{
      this.couponForm = this.fb.group({
        code_cpn : [null,[Validators.required]]
      })
      this.getCart();
    }
    applyCoupon(){
      this.customerService.applyCoupon(this.couponForm.get('code_cpn')?.value).subscribe(res=>{
        this.snackbar.open("Coupon applied successfully","Close",{duration:5000});
        this.getCart();
      },error=>{  
        this.snackbar.open(error.error,"Close",{duration:5000});
      })
    }
    getCart(){
      this.cartItems = [];
      this.customerService.getCartByUserId().subscribe(res=>{
        this.order = res;
        res.cartItems.forEach(element=>{
          element.processedImg ='data:image/jpeg;base64,' + element.returnedImg;
          this.cartItems.push(element);
        });
        this.cdr.detectChanges(); // Déclenchez la détection des changements après la mise à jour des données
      })
    }
    increaseQuantity(productId:any){
      this.customerService.increaseProductQuantity(productId).subscribe(res=>{
        this.snackbar.open("Product quantity increased ","Close",{duration:5000});
        this.getCart();
    })
  }
      decreaseQuantity(productId:any){
      this.customerService.decreaseProductQuantity(productId).subscribe(res=>{
        this.snackbar.open("Product quantity decreased ","Close",{duration:5000});
        this.getCart();
    })
  }
      placeOrder(){
        this.dialog.open(PlaceOrder);
      }
      removeProduct(productId: any) {
  this.customerService.removeProductFromCart(productId).subscribe(res => {
    this.snackbar.open("Product removed from cart", "Close", { duration: 5000 });
    this.getCart(); // Rafraîchir le panier
  });
}
}
