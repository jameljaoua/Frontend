import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicService } from '../../../services/public/public.service';

const PLACEHOLDER_IMG = 'assets/dpmarket/images/thumbs/product-placeholder.png';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './category-products.html',
  styleUrl: './category-products.css',
})
export class CategoryProducts implements OnInit {
  categoryId!: number;
  category: any = null;
  products: any[] = [];
  subcategories: any[] = [];

  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private publicService: PublicService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['categoryId'];
      if (this.categoryId) {
        this.loadCategoryWithProducts();
        this.loadCategoryWithSubcategories();
      } else {
        this.errorMessage = 'Invalid category ID';
        this.isLoading = false;
      }
    });
  }

  loadCategoryWithSubcategories() {
    this.publicService.getCategoryWithSubCategories(this.categoryId).subscribe({
      next: (response) => {
        this.category = response.category || response;
        this.subcategories = response.subcategories || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading category with subcategories:', err);
        this.loadCategoryAndSubcategoriesSeparately();
      }
    });
  }

  loadCategoryAndSubcategoriesSeparately() {
    this.publicService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        this.publicService.getAllSubCategories().subscribe({
          next: (allSubCategories) => {
            this.subcategories = allSubCategories
              .filter((sub: any) => sub.categoryId === this.categoryId)
              .map((subcategory: any) => ({ ...subcategory }));
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading subcategories:', err);
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading category:', err);
      }
    });
  }

  loadCategoryWithProducts() {
    this.isLoading = true;
    this.errorMessage = null;

    this.publicService.getCategoryWithProducts(this.categoryId).subscribe({
      next: (response) => {
        this.category = response.category;
        this.products = response.products.map((product: any) => ({
          ...product,
          processedImg: product.byteImg ? 'data:image/jpeg;base64,' + product.byteImg : PLACEHOLDER_IMG
        }));

        this.isLoading = false;
        this.cdr.detectChanges();

        if (this.products.length === 0) {
          this.snackBar.open('No products found in this category', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error loading category with products:', err);
        this.errorMessage = 'Failed to load category products';
        this.isLoading = false;
        this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  loadCategoryAndProductsSeparately() {
    this.isLoading = true;
    this.errorMessage = null;

    this.publicService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        this.publicService.getProductsByCategory(this.categoryId).subscribe({
          next: (products) => {
            this.products = products.map((product: any) => ({
              ...product,
              processedImg: product.byteImg ? 'data:image/jpeg;base64,' + product.byteImg : PLACEHOLDER_IMG
            }));

            this.isLoading = false;
            this.cdr.detectChanges();

            if (this.products.length === 0) {
              this.snackBar.open('No products found in this category', 'Close', { duration: 3000 });
            }
          },
          error: (err) => {
            console.error('Error loading products:', err);
            this.errorMessage = 'Failed to load products';
            this.isLoading = false;
            this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading category:', err);
        this.errorMessage = 'Category not found';
        this.isLoading = false;
        this.snackBar.open('Category not found', 'Close', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/shop']);
  }
}