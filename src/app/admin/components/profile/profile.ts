import { Component, OnInit } from '@angular/core';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // 1. L'importation précise
import { ChangeDetectorRef } from '@angular/core'; // Importez ceci
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true, // Recommandé pour Angular 21
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
profileForm: any;
  userId: number;

selectedFile: File | null;
imagePreview: string | ArrayBuffer | null;
existingImage: string | null = null;

imgChanged: boolean = false;
  constructor(private adminService: AdminService, private userStorage: UserStorageService,      private snackBar: MatSnackBar,
  private router: Router, private cdRef: ChangeDetectorRef) { }

  onFileSelected(event: any) {
      this.selectedFile = event.target.files[0];
      this.previewImage();
      this.existingImage = null; // On cache l'ancienne image pour afficher l'aperçu
      this.imgChanged = true;
  }

  previewImage(){
      const reader = new FileReader();
      reader.onload = () => {
          this.imagePreview = reader.result;
      }
      reader.readAsDataURL(this.selectedFile);
  }
  ngOnInit() {
    this.userId = Number(UserStorageService.getUserId()); // Récupère l'ID de l'admin connecté
    this.loadProfile();
  }
  loadProfile() {
    this.adminService.getProfile(this.userId).subscribe(res => {
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
        if (this.selectedFile) {
          formData.append('img', this.selectedFile); // Le nom doit correspondre à @RequestPart dans le backend
        }

  this.adminService.updateProfile(this.userId, formData).subscribe({
    next: (res) => {
      if (res.body && res.body.id != null) {
        this.snackBar.open('Profile updated  successfully !', 'Close', { duration: 5000 });
        this.router.navigateByUrl('/admin/dashboard');
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
}
