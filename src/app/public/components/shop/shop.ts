import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicService } from '../../../services/public/public.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  categories: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];

  searchTerm: string = '';
  selectedCategoryId: number | null = null;

  minPrice: number = 0;
  maxPrice: number = 1000;
  actualMinPrice: number = 0;
  actualMaxPrice: number = 1000;

  sidebarOpen: boolean = false;

  constructor(
    private publicService: PublicService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();
  }

  getAllCategories() {
    this.publicService.getAllCategories().subscribe(res => {
      this.categories = res.map((c: any) => ({ ...c }));
      this.linkCategoriesToProducts();
      this.cdr.detectChanges();
    });
  }

  getAllProducts() {
    this.publicService.getAllProducts().subscribe(res => {
      this.products = res.map((p: any) => ({
        ...p,
        processedImg: p.byteImg ? 'data:image/jpeg;base64,' + p.byteImg : null
      }));

      this.filteredProducts = [...this.products];
      this.calculatePriceRange();
      this.linkCategoriesToProducts();
      this.cdr.detectChanges();
    });
  }

  // Associe les produits à chaque catégorie pour afficher les compteurs dans la sidebar
  private linkCategoriesToProducts() {
    if (this.categories.length && this.products.length) {
      this.categories = this.categories.map(c => ({
        ...c,
        products: this.products.filter(p => p.categoryId === c.id)
      }));
    }
  }

  calculatePriceRange() {
    if (this.products.length > 0) {
      const prices = this.products.map(p => p.price);
      this.actualMinPrice = Math.min(...prices);
      this.actualMaxPrice = Math.max(...prices);
      this.minPrice = this.actualMinPrice;
      this.maxPrice = this.actualMaxPrice;
    }
  }

  // Applique tous les filtres actifs en même temps (catégorie + prix + recherche)
  private applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchCategory = this.selectedCategoryId ? p.categoryId === this.selectedCategoryId : true;
      const matchPrice = p.price >= this.minPrice && p.price <= this.maxPrice;
      const matchSearch = this.searchTerm
        ? p.name_prod?.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      return matchCategory && matchPrice && matchSearch;
    });

    if (this.filteredProducts.length === 0) {
      this.snackBar.open('Aucun produit ne correspond à ces filtres', 'Fermer', { duration: 3000 });
    }
  }

  filterByCategory(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  filterByPrice() {
    this.applyFilters();
  }

  filterBySearch() {
    this.applyFilters();
  }

  resetPriceFilter() {
    this.minPrice = this.actualMinPrice;
    this.maxPrice = this.actualMaxPrice;
    this.selectedCategoryId = null;
    this.searchTerm = '';
    this.filteredProducts = [...this.products];
  }

  updateMinPrice(event: any) {
    this.minPrice = +event.target.value;
    this.applyFilters();
  }

  updateMaxPrice(event: any) {
    this.maxPrice = +event.target.value;
    this.applyFilters();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}