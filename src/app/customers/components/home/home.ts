import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
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
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.customerService.getAllCategories().subscribe({
      next: (categories) => {
        this.customerService.getAllProducts().subscribe({
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
    this.router.navigate(['/customer/shop'], { queryParams: { q: this.searchQuery } });
  }

  addToCart(id: any) {
    this.customerService.addToCart(id).subscribe(res => {
      this.snackBar.open('Product added To cart Successfully', 'Close', { duration: 5000 });
    });
  }
}