import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-update-product',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './update-product.html',
  styleUrl: './update-product.css',
})
export class UpdateProduct implements OnInit{
  productId!: number;
productForm: FormGroup;
listOfCategories: any = [];
listOfSubCategories: any = []; // Pour stocker les sous-catégories dynamiques
// Pour l'image
selectedImage: File | null;
imagePreview: string | ArrayBuffer | null;
existingImage: string | null = null;
imgChanged: boolean = false;
  //  Pour le fichier produit
  selectedProductFile: File | null = null;
  existingProductFile: any = null;
  productFileName: string = '';
  productFileSize: string = '';
  fileChanged: boolean = false;
  // Types de fichiers acceptés
  acceptedFileTypes = "*/*";
constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
){}

  onImageSelected(event: any) {
      this.selectedImage = event.target.files[0];
      this.previewImage();
      this.imgChanged = true;
  }
 // NOUVEAU: Gestionnaire pour le fichier produit
  onProductFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    
    this.selectedProductFile = file;
    this.productFileName = file.name;
    this.fileChanged = true;
    
    // Formater la taille
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeInGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
    
    if (file.size > 1024 * 1024 * 1024) { // Plus de 1GB
      this.productFileSize = `${sizeInGB} GB`;
    } else {
      this.productFileSize = `${sizeInMB} MB`;
    }
    
    console.log('New product file selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
  }
  previewImage(){
      const reader = new FileReader();
      reader.onload = () => {
          this.imagePreview = reader.result;
      }
      reader.readAsDataURL(this.selectedImage);
  }
  ngOnInit(): void {
      console.log('UPDATE PRODUCT LOADED');

    this.productId = Number(this.activatedRoute.snapshot.paramMap.get('productId'));
    this.productForm = this.fb.group({
        categoryId: [null, [Validators.required]],
        subcategoryId: [null], // NON obligatoire
        name_prod: [null, [Validators.required]],
        price: [null, [Validators.required]],
        description_prod: [null, [Validators.required]],
        code_prod: [null],
    });
    this.getAllCategories();
    this.getProductById();
// Détecter le changement de catégorie pour mettre à jour les sous-catégories
    this.productForm.get('categoryId')?.valueChanges.subscribe(categoryId => {
      if (categoryId) {
        this.loadSubCategories(categoryId);
      }
    });
}
// Charger les sous-catégories en fonction de la catégorie
  loadSubCategories(categoryId: number, patchValue?: number) {
    this.adminService.getSubCategoriesByCategory(categoryId).subscribe(res => {
      this.listOfSubCategories = res;
      if (patchValue) {
        this.productForm.get('subcategoryId')?.setValue(patchValue);
      }
    });
  }
getAllCategories(){
    this.adminService.getAllCategories().subscribe(res => {
        this.listOfCategories = res;
    })
}
getProductById(){
  this.adminService.getProductById(this.productId).subscribe({
    next: res => {
      this.productForm.patchValue(res);
      this.existingImage = 'data:image/jpeg;base64,' + res.byteImg;
      // Charger les sous-catégories de la catégorie actuelle du produit
        if (res.categoryId) {
          this.loadSubCategories(res.categoryId, res.subcategoryId);
        }
              if (res.file_prod) {
          this.existingProductFile = {
            fileName: res.productFileName,
            fileSize: res.productFileSize,
            fileType: res.productFileType,
          };
          this.productFileName = res.productFileName;
        }
    },
    error: err => {
      console.error(err);
      this.snackBar.open('Product not found','ERROR',{duration:3000});
    }
  });
}
 //  Effacer le nouveau fichier sélectionné
  clearNewProductFile() {
    this.selectedProductFile = null;
    this.productFileName = this.existingProductFile?.fileName || '';
    this.productFileSize = '';
    this.fileChanged = false;
    
    const fileInput = document.getElementById('productFileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  //  Supprimer le fichier existant
  removeExistingFile() {
    if (confirm('Are you sure you want to remove the attached file?')) {
      this.existingProductFile = null;
      this.productFileName = '';
      this.fileChanged = true; // Marquer comme changé pour indiquer la suppression
      this.selectedProductFile = null; // Aucun nouveau fichier
      
      this.snackBar.open('File will be removed on update', 'Info', { duration: 3000 });
    }
  }
updateProduct(): void {
    if (this.productForm.valid){
      const formData : FormData = new FormData();
      if (this.imgChanged && this.selectedImage){
        formData.append('img',this.selectedImage);

      }
          // NOUVEAU: Ajouter le fichier produit si changé
      if (this.fileChanged) {
        if (this.selectedProductFile) {
          // Nouveau fichier sélectionné
          formData.append('file_prod', this.selectedProductFile);
        } 
      }
      formData.append('categoryId',this.productForm.get('categoryId').value);
      // Ajouter la sous-catégorie si elle est sélectionnée
      const subId = this.productForm.get('subcategoryId')?.value;
      if (subId !== null && subId !== undefined) {
        formData.append('subcategoryId', subId.toString());
      }
      formData.append('name_prod',this.productForm.get('name_prod').value);
      formData.append('description_prod',this.productForm.get('description_prod').value);
      formData.append('price',this.productForm.get('price').value);
      if (this.productForm.get('code_prod')?.value) {
        formData.append('code_prod', this.productForm.get('code_prod').value);
      }
      this.adminService.updateProduct(this.productId, formData).subscribe((res)=>{
        if (res.id != null){
          this.snackBar.open('Product Updated Successfully!','Close',{
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
