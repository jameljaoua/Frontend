import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { ChangeDetectorRef } from '@angular/core'; // Importez ceci
@Component({
  selector: 'app-show-categories',
    standalone: true,

    imports: [
    FormsModule,

    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './show-categories.html',
  styleUrl: './show-categories.css',
})
export class ShowCategories implements OnInit{
  searchText: string = '';

  categories: any[] = [];
  allProducts: any[] = [];
  allSubCategories: any[] = [];
  searchCategoryForm!: FormGroup;
   currentPage: number = 1;
itemsPerPage: number = 6;
  displayedColumns: string[] = [
    'name',
    'description',
    'products',
    'subcategories',
    'actions'
  ];
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.searchCategoryForm = this.fb.group({
      title: [null, Validators.required]
    });

    this.getAllCategories();
  }
  loadSubCategoriesForCategory(category: any) {
  this.adminService.getSubCategoriesByCategory(category.id).subscribe({
    next: (subcats) => {
      category.subcategories = subcats;
      this.cdr.detectChanges();
    },
    error: (err) => console.error(`Erreur sous-catégories pour catégorie ${category.id}`, err)
  });
}
 getAllCategories() {
  this.adminService.getAllCategories().subscribe({
    next: (categories) => {
      this.adminService.getAllProducts().subscribe({
        next: (products) => {
          this.allProducts = products;
          this.categories = categories.map(cat => ({
            ...cat,
            products: this.allProducts.filter(p => p.categoryId === cat.id),
            subcategories: [] // initialisation
          }));
          // Pour chaque catégorie, chargez ses sous-catégories
          this.categories.forEach(cat => this.loadSubCategoriesForCategory(cat));
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur produits', err)
      });
    },
    error: (err) => console.error('Erreur catégories', err)
  });
}
  get filteredCategories() {
      let result = this.categories;

  // Correction de la condition : on filtre si searchText contient du texte
  if (this.searchText && this.searchText.trim() !== '') {
    result = this.categories.filter(category =>
      category.name_cat && category.name_cat
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  // Application de la pagination directement sur la liste résultante
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return result.slice(startIndex, startIndex + this.itemsPerPage);
  
}
    submitForm() {
    const title = this.searchCategoryForm.value.title;
    this.adminService.getAllCategoriesByName(title).subscribe(res => {
      this.categories = res.map((c: any) => ({
        ...c,
      }));
    });
  }
  deleteCategory(categoryId: number) {
    this.adminService.deleteCategory(categoryId).subscribe(res => {
      if (!res.body) {
        this.snackBar.open('Category Deleted Successfully!', 'Close', { duration: 3000 });
        this.getAllCategories();
      }
    });
  }
      // Méthode pour obtenir la liste filtrée selon la page active
get paginatedCategories() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.categories.slice(startIndex, startIndex + this.itemsPerPage);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
  const count = this.searchText && this.searchText.trim() !== ''
    ? this.categories.filter(category => category.name_cat && category.name_cat.toLowerCase().includes(this.searchText.toLowerCase())).length 
    : this.categories.length;
    
  return Math.ceil(count / this.itemsPerPage) || 1;
}

// 3. Changement de page
changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}
}
