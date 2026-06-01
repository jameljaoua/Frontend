import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './category-details.html',
  styleUrl: './category-details.css',
})
export class CategoryDetails implements OnInit {
  categoryId!: number;
  category: any = null;
  products: any[] = [];
  subcategories: any[] = [];
  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.categoryId = Number(params.get('categoryId'));
      if (this.categoryId) {
        this.loadCategoryWithProducts();
        this.loadCategoryWithSubcategories();
      } else {
        this.snackBar.open('Invalid category ID', 'ERROR', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadCategoryWithProducts() {
    this.isLoading = true;
    
    // OPTION 1: Si votre API a un endpoint combiné
    this.adminService.getCategoryWithProducts(this.categoryId).subscribe({
      next: (response) => {
        this.category = response.category || response;
        this.products = response.products || [];
        this.processProductImages();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading category with products:', err);
        // OPTION 2: Fallback vers deux appels séparés
        this.loadCategoryAndProductsSeparately();
      }
    });
  }
  loadCategoryWithSubcategories() {
    this.isLoading = true;
    
    // OPTION 1: Si votre API a un endpoint combiné
    this.adminService.getCategoryWithSubCategories(this.categoryId).subscribe({
      next: (response) => {
        this.category = response.category || response;
        this.subcategories = response.subcategories || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading category with subcategories:', err);
        // OPTION 2: Fallback vers deux appels séparés
        this.loadCategoryAndSubcategoriesSeparately();
      }
    });
  }
  loadCategoryAndSubcategoriesSeparately() {
    // Charger d'abord la catégorie
    this.adminService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        
        // Ensuite charger tous les produits et filtrer
        this.adminService.getAllSubCategories().subscribe({
          next: (allSubCategories) => {
            this.subcategories = allSubCategories
              .filter((sub: any) => sub.categoryId === this.categoryId)
              .map((subcategory: any) => ({
                ...subcategory,
              }));
            this.isLoading = false;
            this.cdr.detectChanges();
            
            if (this.subcategories.length === 0) {
              this.snackBar.open('No subcategories in this category', 'INFO', { duration: 3000 });
            }
          },
          error: (err) => {
            console.error('Error loading subcategories:', err);
            this.isLoading = false;
            this.snackBar.open('Error loading subcategories', 'ERROR', { duration: 3000 });
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading category:', err);
        this.isLoading = false;
        this.snackBar.open('Category not found', 'ERROR', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  loadCategoryAndProductsSeparately() {
    // Charger d'abord la catégorie
    this.adminService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        
        // Ensuite charger tous les produits et filtrer
        this.adminService.getAllProducts().subscribe({
          next: (allProducts) => {
            this.products = allProducts
              .filter((p: any) => p.categoryId === this.categoryId)
              .map((product: any) => ({
                ...product,
                processedImg: product.byteImg ? 'data:image/jpeg;base64,' + product.byteImg : null
              }));
            this.isLoading = false;
            this.cdr.detectChanges();
            
            if (this.products.length === 0) {
              this.snackBar.open('No products in this category', 'INFO', { duration: 3000 });
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
        console.error('Error loading category:', err);
        this.isLoading = false;
        this.snackBar.open('Category not found', 'ERROR', { duration: 3000 });
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
            this.loadCategoryWithProducts();
          }
        },
        error: (err) => {
          this.snackBar.open('Error deleting product', 'ERROR', { duration: 3000 });
        }
      });
    }
  }
}