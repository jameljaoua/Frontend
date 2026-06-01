import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PublicService } from '../../../services/public/public.service';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule
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

  // Options pour le carousel des produits
  productCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: { items: 1 },
      480: { items: 2 },
      768: { items: 3 },
      992: { items: 4 }
    },
    nav: true,
    margin: 20
  };

  constructor(
    private publicService: PublicService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de la catégorie depuis l'URL
    this.route.params.subscribe(params => {
      this.categoryId = +params['categoryId']; // Le '+' convertit en nombre
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
    this.isLoading = true;
    
    // OPTION 1: Si votre API a un endpoint combiné
    this.publicService.getCategoryWithSubCategories(this.categoryId).subscribe({
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
    this.publicService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        
        // Ensuite charger tous les sous catégories et filtrer
        this.publicService.getAllSubCategories().subscribe({
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
  loadCategoryWithProducts() {
    this.isLoading = true;
    this.errorMessage = null;

    // OPTION 1: Utiliser l'endpoint spécialisé qui retourne catégorie + produits
    this.publicService.getCategoryWithProducts(this.categoryId).subscribe({
      next: (response) => {
        this.category = response.category;
        this.products = response.products.map((product: any) => ({
          ...product,
          processedImg: product.byteImg ? 'data:image/jpeg;base64,' + product.byteImg : 'assets/images/placeholder.jpg'
        }));
        
        this.isLoading = false;
        this.cdr.detectChanges();
        
        if (this.products.length === 0) {
          this.snackBar.open('No products found in this category', 'Close', {
            duration: 3000
          });
        }
      },
      error: (err) => {
        console.error('Error loading category with products:', err);
        this.errorMessage = 'Failed to load category products';
        this.isLoading = false;
        this.snackBar.open('Error loading products', 'Close', {
          duration: 3000
        });
        this.cdr.detectChanges();
      }
    });
  }

  // OPTION 2: Alternative avec deux appels séparés (si l'endpoint combiné n'existe pas)
  loadCategoryAndProductsSeparately() {
    this.isLoading = true;
    this.errorMessage = null;

    // Charger d'abord la catégorie
    this.publicService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        
        // Ensuite charger les produits de cette catégorie
        this.publicService.getProductsByCategory(this.categoryId).subscribe({
          next: (products) => {
            this.products = products.map((product: any) => ({
              ...product,
              processedImg: product.byteImg ? 'data:image/jpeg;base64,' + product.byteImg : 'assets/images/placeholder.jpg'
            }));
            
            this.isLoading = false;
            this.cdr.detectChanges();
            
            if (this.products.length === 0) {
              this.snackBar.open('No products found in this category', 'Close', {
                duration: 3000
              });
            }
          },
          error: (err) => {
            console.error('Error loading products:', err);
            this.errorMessage = 'Failed to load products';
            this.isLoading = false;
            this.snackBar.open('Error loading products', 'Close', {
              duration: 3000
            });
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading category:', err);
        this.errorMessage = 'Category not found';
        this.isLoading = false;
        this.snackBar.open('Category not found', 'Close', {
          duration: 3000
        });
        this.cdr.detectChanges();
      }
    });
  }

 

  goBack() {
    this.router.navigate(['/shop']);
  }
}