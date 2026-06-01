import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-subcategory-details',
    standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './subcategory-details.html',
  styleUrl: './subcategory-details.css',
})
export class SubcategoryDetails implements OnInit {
  subcategoryId!: number;
  subcategory: any = null;
  products: any[] = [];
  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.subcategoryId = Number(params.get('subcategoryId'));
      if (this.subcategoryId) {
        this.loadSubCategoryWithProducts();
      } else {
        this.snackBar.open('Invalid subcategory ID', 'ERROR', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadSubCategoryWithProducts() {
    this.isLoading = true;
    
    // OPTION 1: Si votre API a un endpoint combiné
    this.adminService.getSubCategoryWithProducts(this.subcategoryId).subscribe({
      next: (response) => {
        this.subcategory = response.subcategory || response;
        this.products = response.products || [];
        this.processProductImages();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading subcategory with products:', err);
        // OPTION 2: Fallback vers deux appels séparés
        this.loadSubCategoryAndProductsSeparately();
      }
    });
  }

  loadSubCategoryAndProductsSeparately() {
    // Charger d'abord la sous-catégorie
    this.adminService.getSubCategoryById(this.subcategoryId).subscribe({
      next: (subcategory) => {
        this.subcategory = subcategory;
        
        // Ensuite charger tous les produits et filtrer
        this.adminService.getAllProducts().subscribe({
          next: (allProducts) => {
            this.products = allProducts
              .filter((p: any) => p.subcategoryId === this.subcategoryId)
              .map((product: any) => ({
                ...product,
                processedImg: product.byteImg ? 'data:image/jpeg;base64,' + product.byteImg : null
              }));
            this.isLoading = false;
            this.cdr.detectChanges();
            
            if (this.products.length === 0) {
              this.snackBar.open('No products in this subcategory', 'INFO', { duration: 3000 });
            }
          },
          error: (err) => {
            console.error('Error loading products:', err);
            this.isLoading = false;
            this.snackBar.open('Error loading products', 'ERROR', { duration: 3000 });
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading subcategory:', err);
        this.isLoading = false;
        this.snackBar.open('Subcategory not found', 'ERROR', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  processProductImages() {
    if (this.products && this.products.length > 0) {
      this.products = this.products.map((product: any) => ({
        ...product,
        processedImg: product.byteImg ? 'data:image/jpeg;base64,' + product.byteImg : 
                      product.imageUrl || 'assets/images/placeholder.jpg'
      }));
    }
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(productId).subscribe({
        next: (res) => {
          if (!res.body) {
            this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
            // Recharger les produits
            this.loadSubCategoryWithProducts();
          }
        },
        error: (err) => {
          this.snackBar.open('Error deleting product', 'ERROR', { duration: 3000 });
        }
      });
    }
  }
}
