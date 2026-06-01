import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-post-product',
imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],  templateUrl: './post-product.html',
  styleUrl: './post-product.css',
})
export class PostProduct {
productForm: FormGroup;
listOfCategories: any = [];
listOfSubCategories: any = []; // Nouveau : stocker les sous-catégories
  selectedImage: File | null = null;
imagePreview: string | ArrayBuffer | null;
  selectedProductFile: File | null = null;
  productFileName : string | null = null;
  productFileSize :string | null = null;
  acceptedFileTypes = "*/*";

constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
){}

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
    if (this.selectedImage) {
      this.previewImage();
    }
  }
  previewImage(){
      const reader = new FileReader();
      reader.onload = () => {
          this.imagePreview = reader.result;
      }
      reader.readAsDataURL(this.selectedImage);
  }
    onProductFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedProductFile = file; 
    this.productFileName = file.name;
        // Formater la taille du fichier
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeInGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
    
    if (file.size > 1024 * 1024 * 1024) { // Plus de 1GB
      this.productFileSize = `${sizeInGB} GB`;
    } else {
      this.productFileSize = `${sizeInMB} MB`;
    }
    this.productFileSize = file.size;
  }
    // NOUVEAU: Effacer le fichier produit sélectionné
  clearProductFile() {
    this.selectedProductFile = null;
    
    // Réinitialiser l'input file
    const fileInput = document.getElementById('productFileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
    clearImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    const fileInput = document.getElementById('imageFileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
  ngOnInit(): void {
    this.productForm = this.fb.group({
        categoryId: [null, [Validators.required]],
        subcategoryId: [null], // Nouveau : Pas de Validators.required ici
        name_prod: [null, [Validators.required]],
        price: [null, [Validators.required]],
        description_prod: [null, [Validators.required]],
        code_prod: [null],
    });

    this.getAllCategories();
    // Détecter le changement de catégorie pour charger les sous-catégories
    this.productForm.get('categoryId')?.valueChanges.subscribe(categoryId => {
      if (categoryId) {
        this.getSubCategoriesByCategory(categoryId);
      }
    });
}

getAllCategories(){
    this.adminService.getAllCategories().subscribe(res => {
        this.listOfCategories = res;
    })
}
// Appeler votre service pour récupérer les sous-catégories par ID de catégorie
  getSubCategoriesByCategory(categoryId: number) {
    this.adminService.getSubCategoriesByCategory(categoryId).subscribe(res => {
      this.listOfSubCategories = res;
      this.productForm.get('subcategoryId')?.setValue(null); // Réinitialiser le choix
    });
  }
addProduct(): void {
    if (this.productForm.valid){
      const formData : FormData = new FormData();
      formData.append('img',this.selectedImage);
      if (this.selectedProductFile) {
      formData.append('file_prod', this.selectedProductFile);
      }
      formData.append('categoryId',this.productForm.get('categoryId').value);
      formData.append('name_prod',this.productForm.get('name_prod').value);
      formData.append('description_prod',this.productForm.get('description_prod').value);
      formData.append('price',this.productForm.get('price').value);
      // Nouveau : Envoyer l'ID de la sous-catégorie s'il existe
      const subId = this.productForm.get('subcategoryId')?.value;
              if (subId !== null && subId !== undefined) {
                  formData.append('subcategoryId', subId.toString());
              }
      if (this.productForm.get('code_prod')?.value) {
        formData.append('code_prod', this.productForm.get('code_prod').value);
      }
      this.adminService.addProduct(formData).subscribe((res)=>{
        if (res.id != null){
          this.snackBar.open('Product Posted Successfully!','Close',{
            duration :5000
          });
          this.router.navigateByUrl('/admin/dashboard');
        }else{
          this.snackBar.open(res.message,'ERROR',{
            duration :5000
          })
        }
      })
    }else{
      for (const i in this.productForm.controls){
          this.productForm.controls[i].markAsDirty();
          this.productForm.controls[i].updateValueAndValidity();
      }
    }
}
}
