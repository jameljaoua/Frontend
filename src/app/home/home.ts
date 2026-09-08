import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { PublicService } from '../services/public/public.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CarouselModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  categories: any[] = [];
  allProducts: any[] = [];
  searchQuery: string = '';

  // Carousel des catégories populaires (style DPmarket)
  popularCategoryOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    nav: true,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    margin: 20,
    responsive: {
      0: { items: 2 },
      480: { items: 3 },
      768: { items: 4 },
      992: { items: 6 }
    }
  };

  constructor(
    private publicService: PublicService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.publicService.getAllCategories().subscribe({
      next: (categories) => {
        this.publicService.getAllProducts().subscribe({
          next: (products) => {
            this.allProducts = products.map((product: any) => ({
              ...product,
              processedImg: product.byteImg ? 'data:image/jpeg;base64,' + product.byteImg : null
            }));

            this.categories = categories.map((category: any) => ({
              ...category,
              products: this.allProducts.filter(p => p.categoryId === category.id)
            }));

            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading products:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/shop'], { queryParams: { q: this.searchQuery } });
  }
}