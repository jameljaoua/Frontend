import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../service/admin.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core'; // Importez ceci

@Component({
  selector: 'app-show-products',
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
  templateUrl: './show-products.html',
  styleUrl: './show-products.css',
})
export class ShowProducts implements OnInit {
searchText: string = '';

  products: any[] = [];
  searchProductForm!: FormGroup;

  displayedColumns: string[] = [
    'image',
    'name',
    'category',
    'price',
      'file',
    'actions'
  ];

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchProductForm = this.fb.group({
      title: [null, Validators.required]
    });

    this.getAllProducts();
  }

  getAllProducts() {
    this.adminService.getAllProducts().subscribe(res => {
      this.products = res.map((p: any) => ({
        ...p,
        processedImg: 'data:image/jpeg;base64,' + p.byteImg,
        hasFile: p.productFileName != null && p.productFileName !== '',
        displaySubCategory: p.subcategoryName || 'No subcategory'
      }));
      this.cdr.detectChanges(); 

    });
  }
get filteredProducts() {
  if (!this.searchText) {
    return this.products;
  }

  return this.products.filter(product =>
    product.name_prod
      .toLowerCase()
      .includes(this.searchText.toLowerCase())
  );
}
  submitForm() {
    const title = this.searchProductForm.value.title;
    this.adminService.getAllProductsByName(title).subscribe(res => {
      this.products = res.map((p: any) => ({
        ...p,
        processedImg: 'data:image/jpeg;base64,' + p.byteImg,
        hasFile: p.productFileName != null && p.productFileName !== '',
      }));
    });
  }
 // Méthode pour télécharger le fichier
  downloadProductFile(productId: number, fileName: string) {
    // Validation de base
    if (!productId) {
      this.showErrorMessage('Invalid product ID');
      return;
    }

    // Afficher un indicateur de chargement (optionnel)
    const snackBarRef = this.snackBar.open('Downloading file...', 'Close', { duration: 0 });

    this.adminService.downloadProductFile(productId).subscribe({
      next: (blob: Blob) => {
        snackBarRef.dismiss(); // Fermer l'indicateur

        // Vérifier que le blob n'est pas vide
        if (blob.size === 0) {
          this.showErrorMessage('File is empty');
          return;
        }

        // Déterminer le nom du fichier
        const finalFileName = fileName || `product-${productId}.bin`;
        
        // Démarrer le téléchargement
        this.downloadBlob(blob, finalFileName);
        
        this.snackBar.open('Download completed!', 'SUCCESS', { 
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (err) => {
        snackBarRef.dismiss();
        console.error('Download error:', err);
        this.handleDownloadError(err);
      }
    });
  }

  // Méthode utilitaire pour télécharger le blob
  private downloadBlob(blob: Blob, fileName: string): void {
    // Créer une URL temporaire pour le blob
    const url = window.URL.createObjectURL(blob);
    
    // Créer un élément <a> temporaire
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    // Ajouter au DOM, cliquer, puis retirer
    document.body.appendChild(link);
    link.click();
    
    // Nettoyer après un délai
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  // Gérer les erreurs de téléchargement
  private handleDownloadError(err: any): void {
    let errorMessage = 'Error downloading file';
    
    if (err.status === 404) {
      errorMessage = 'File not found';
    } else if (err.status === 500) {
      errorMessage = 'Server error';
    } else if (err.status === 0) {
      errorMessage = 'Network error - check your connection';
    }
    
    this.showErrorMessage(errorMessage);
  }

  // Afficher un message d'erreur
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'ERROR', { 
      duration: 4000,
      panelClass: 'error-snackbar'
    });
  }
  deleteProduct(productId: number) {
    this.adminService.deleteProduct(productId).subscribe(res => {
      if (!res.body) {
        this.snackBar.open('Product Deleted Successfully!', 'Close', { duration: 3000 });
        this.getAllProducts();
      }
    });
  }
}
