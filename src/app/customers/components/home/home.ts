import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule  // ← Importez le module
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  categories: any[] = [];
  allProducts: any[] = [];
 
  // Options du carousel
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: { items: 2 },
      600: { items: 3 },
      1000: { items: 6 }
    },
    nav: true
  };
  // Options pour le carousel des produits
  productCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['‹', '›'],
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
    private customerService: CustomerService,
    private snackBar:MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

    getAllCategories() {
this.customerService.getAllCategories().subscribe({
      next: (categories) => {
        // Charger tous les produits
        this.customerService.getAllProducts().subscribe({
          next: (products) => {
            this.allProducts = products.map((product: any) => ({
              ...product,
              processedImg: product.byteImg ? 'data:image/jpeg;base64,' + product.byteImg : null
            }));
            
            // Associer les produits à leurs catégories
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
  
    addToCart(id:any){
    this.customerService.addToCart(id).subscribe(res=>{
      this.snackBar.open("Product added To cart Successfully","Close",{duration :5000})
    })
  }
}