import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core'; // Importez ceci

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit{
  productId!: number;
  product: any;
constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
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
    this.adminService.getProductById(this.productId).subscribe({
      next: res => {
        if (res) {
          this.product = res;
          this.product.processedImg = 'data:image/jpeg;base64,' + res.byteImg;
          this.product.displaySubCategory = res.subcategoryName || 'No subcategory';
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

}
