import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-single-product',
   standalone: true,

  imports: [CommonModule,RouterLink],
  templateUrl: './single-product.html',
  styleUrl: './single-product.css',
})
export class SingleProduct implements OnInit {
  productId!: number;
  product: any;
constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.productId = Number(params.get('productId'));
      if (this.productId) {
        this.getProductDetails();
      } else {
        this.snackBar.open('Invalid product ID', 'ERROR', {duration: 3000});
      }
    });
  
  }
  getProductDetails() {
    this.customerService.getProductById(this.productId).subscribe({
      next: res => {
        if (res) {
          this.product = res;
          this.product.processedImg = 'data:image/jpeg;base64,' + res.byteImg;
          console.log('Product ID:', this.productId);
          console.log('Product details:', this.product);
          this.cdr.detectChanges(); 
        } else {
          this.snackBar.open('Product not found', 'ERROR', {duration: 3000});
        }
      },
      error: err => {
        console.error('Error fetching product:', err);
        this.snackBar.open('Error loading product details', 'ERROR', {duration: 3000});
      }
    });
  }
    addToCart(id:any){
    this.customerService.addToCart(id).subscribe(res=>{
      this.snackBar.open("Product added To cart Successfully","Close",{duration :5000})
    })
  }
}
