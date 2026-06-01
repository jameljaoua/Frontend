import { ChangeDetectorRef, Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [CommonModule,RouterLink, FormsModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
    categories: any[] = [];
      products: any[] = [];
  filteredProducts: any[] = []; // Produits filtrés
  
  // Variables pour le filtre par prix
  minPrice: number = 0;
  maxPrice: number = 1000;
  priceRangeMin: number = 0;
  priceRangeMax: number = 1000;
  
  // Prix min et max réels des produits
  actualMinPrice: number = 0;
  actualMaxPrice: number = 1000;

constructor(private customerService: CustomerService,private snackBar:MatSnackBar, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();
  }
  getAllCategories() {
    this.customerService.getAllCategories().subscribe(res => {
      this.categories = res.map((c: any) => ({
        ...c,
      }));
      this.cdr.detectChanges();
    });
  }
    getAllProducts() {
    this.customerService.getAllProducts().subscribe(res => {
      this.products = res.map((p: any) => ({
        ...p,
        processedImg: 'data:image/jpeg;base64,' + p.byteImg
      }));
            // Initialiser les produits filtrés
      this.filteredProducts = [...this.products];
      
      // Calculer les prix min et max réels
      this.calculatePriceRange();
      
      this.cdr.detectChanges(); 

    });
  }
  
  calculatePriceRange() {
    if (this.products.length > 0) {
      const prices = this.products.map(p => p.price);
      this.actualMinPrice = Math.min(...prices);
      this.actualMaxPrice = Math.max(...prices);
      
      // Initialiser les filtres avec les valeurs réelles
      this.priceRangeMin = this.actualMinPrice;
      this.priceRangeMax = this.actualMaxPrice;
      this.minPrice = this.actualMinPrice;
      this.maxPrice = this.actualMaxPrice;
    }
  }

  // Filtrer par prix
  filterByPrice() {
    this.filteredProducts = this.products.filter(product => 
      product.price >= this.minPrice && product.price <= this.maxPrice
    );
    
    // Afficher un message si aucun produit trouvé
    if (this.filteredProducts.length === 0) {
      this.snackBar.open('No products found in this price range', 'Close', {
        duration: 3000
      });
    }
  }

  // Réinitialiser les filtres
  resetPriceFilter() {
    this.minPrice = this.actualMinPrice;
    this.maxPrice = this.actualMaxPrice;
    this.filteredProducts = [...this.products];
  }

  // Filtrer par catégorie (si vous voulez l'ajouter)
  filterByCategory(categoryId: number) {
    this.filteredProducts = this.products.filter(p => p.categoryId === categoryId);
    
    if (this.filteredProducts.length === 0) {
      this.snackBar.open('No products in this category', 'Close', {
        duration: 3000
      });
    }
  }

  // Méthode pour mettre à jour le prix min
  updateMinPrice(event: any) {
    this.minPrice = event.target.value;
    this.filterByPrice();
  }

  // Méthode pour mettre à jour le prix max
  updateMaxPrice(event: any) {
    this.maxPrice = event.target.value;
    this.filterByPrice();
  }

      addToCart(id:any){
    this.customerService.addToCart(id).subscribe(res=>{
      this.snackBar.open("Product added To cart Successfully","Close",{duration :5000})
    })
  }
}
