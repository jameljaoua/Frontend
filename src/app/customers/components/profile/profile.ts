import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomerSidebar } from '../../../shared/customer/customer-sidebar/customer-sidebar';

@Component({
  selector: 'app-profile',
  standalone: true, // Recommandé pour Angular 21
  imports: [
        CommonModule, 
    FormsModule,
    CustomerSidebar
    
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
profileForm: any;
  userId: number;
// Pour l'image
selectedImage: File | null;
imagePreview: string | ArrayBuffer | null;
existingImage: string | null = null;
imgChanged: boolean = false;
 constructor(private customerService: CustomerService, private userStorage: UserStorageService,      private snackBar: MatSnackBar,
  private router: Router, private cdRef: ChangeDetectorRef) { }
    onImageSelected(event: any) {
      this.selectedImage = event.target.files[0];
      this.existingImage = null; // On cache l'ancienne image pour afficher l'aperçu
      this.previewImage();
      this.imgChanged = true;
  }
    previewImage(){
      const reader = new FileReader();
      reader.onload = () => {
          this.imagePreview = reader.result;
          this.cdRef.detectChanges(); // Important pour mettre à jour l'image à l'écran
      }
      reader.readAsDataURL(this.selectedImage);
  }
    ngOnInit() {
    this.userId = Number(UserStorageService.getUserId()); // Récupère l'ID de le client connecté
    this.loadProfile();
  }
    loadProfile() {
    this.customerService.getProfile(this.userId).subscribe(res => {
      this.profileForm = res; // Remplit les champs avec les données du backend
    if (res.byteImg) {
      // Utilisation d'un préfixe générique image/* ou détection du format
      this.existingImage = 'data:image/png;base64,' + res.byteImg; 
    }
      this.cdRef.detectChanges(); // Force la détection des changements
    });
  }
   updateProfile() {
        const formData = new FormData();
        formData.append('name', this.profileForm.name);
        formData.append('email', this.profileForm.email);
        if (this.selectedImage) {
          formData.append('img', this.selectedImage); // Le nom doit correspondre à @RequestPart dans le backend
        }

  this.customerService.updateProfile(this.userId, formData).subscribe({
    next: (res) => {
      if (res.body && res.body.id != null) {
        this.snackBar.open('Profile updated  successfully !', 'Close', { duration: 5000 });
        this.router.navigateByUrl('/customer/dashboard');
        //this.userStorage.saveUser(res.body);
      } else {
        this.snackBar.open(res.body?.message || 'Unknown Error', 'ERROR', { duration: 5000 });
      }
    },
    error: (err) => {
      console.error(' Update Error:', err);
      this.snackBar.open(`Error ${err.status}: ${err.statusText}`, 'ERROR', { duration: 5000 });
    }
  });
  }
    //  Supprimer l'image existante
  removeExistingFile() {
    if (confirm('Are you sure you want to remove the attached file?')) {
      this.existingImage = null;
      this.imagePreview = null;
      this.imgChanged = true; // Marquer comme changé pour indiquer la suppression
      this.selectedImage = null; // Aucun nouvelle image
      
      this.snackBar.open('File will be removed on update', 'Info', { duration: 3000 });
    }
  }
}
