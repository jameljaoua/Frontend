import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-show-subcategories',
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
  templateUrl: './show-subcategories.html',
  styleUrl: './show-subcategories.css',
})
export class ShowSubcategories implements OnInit{
    searchText: string = '';

subcategories: any[] = [];
  allProducts: any[] = [];

  searchSubCategoryForm!: FormGroup;
   currentPage: number = 1;
itemsPerPage: number = 6;
  displayedColumns: string[] = [
    'name',
    'description',
     'category',
    'products',
    'actions'
  ];
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.searchSubCategoryForm = this.fb.group({
      title: [null, Validators.required]
    });

    this.getAllSubCategories();
  }
  getAllSubCategories() {
    this.adminService.getAllSubCategories().subscribe({
      next: (subcategories) => {
        // Charger tous les produits
        this.adminService.getAllProducts().subscribe({
          next: (products) => {
            this.allProducts = products.map((product: any) => ({
              ...product,
            }));
            
            // Associer les produits à leurs sous-catégories
            this.subcategories = subcategories.map((subcategory: any) => ({
              ...subcategory,
              products: this.allProducts.filter(p => p.subcategoryId === subcategory.id)
            }));
            
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading products:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error loading subcategories:', err);
      }
    });
  }
 get filteredSubCategories() {
      let result = this.subcategories;

  // Correction de la condition : on filtre si searchText contient du texte
  if (this.searchText && this.searchText.trim() !== '') {
    result = this.subcategories.filter(subcategory =>
      subcategory.name_subcat && subcategory.name_subcat
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  // Application de la pagination directement sur la liste résultante
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return result.slice(startIndex, startIndex + this.itemsPerPage);
  
}
    submitForm() {
    const title = this.searchSubCategoryForm.value.title;
    this.adminService.getAllSubCategoriesByName(title).subscribe(res => {
      this.subcategories = res.map((sc: any) => ({
        ...sc,
      }));
    });
  }
  deleteSubCategory(subcategoryId: number) {
    this.adminService.deleteSubCategory(subcategoryId).subscribe(res => {
      if (!res.body) {
        this.snackBar.open('SubCategory Deleted Successfully!', 'Close', { duration: 3000 });
        this.getAllSubCategories();
      }
    });
  }
      // Méthode pour obtenir la liste filtrée selon la page active
get paginatedCategories() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  return this.subcategories.slice(startIndex, startIndex + this.itemsPerPage);
}

// Méthode pour obtenir le nombre total de pages
get totalPages(): number {
  const count = this.searchText && this.searchText.trim() !== ''
    ? this.subcategories.filter(subcategory => subcategory.name_subcat && subcategory.name_subcat.toLowerCase().includes(this.searchText.toLowerCase())).length 
    : this.subcategories.length;
    
  return Math.ceil(count / this.itemsPerPage) || 1;
}

// 3. Changement de page
changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}
}
