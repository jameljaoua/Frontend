import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-category',
  imports: [
    CommonModule,         // Résout l'erreur NG8103 (*ngIf)
    ReactiveFormsModule,  // Résout l'erreur NG8002 (formGroup)
    MatFormFieldModule, // Import individuel
    MatInputModule,     // Import individuel
    MatButtonModule,    // Import individuel
    MatSnackBarModule   // Import individuel
  ],
  templateUrl: './post-category.html',
  styleUrl: './post-category.css',
})
export class PostCategory {
categoryForm!: FormGroup;

constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
) {}

ngOnInit(): void {
    this.categoryForm = this.fb.group({
        name_cat: [null, [Validators.required]],
        description_cat: [null, [Validators.required]],
    });
}
addCategory(): void {
    if (this.categoryForm.valid) {
        this.adminService.addCategory(this.categoryForm.value).subscribe((res) => {
            if (res.id != null) {
                this.snackBar.open('Category Posted Successfully!', 'Close', {
                    duration: 5000
                });
                this.router.navigateByUrl('/admin/dashboard');
            } else {
                this.snackBar.open(res.message, 'Close', {
                    duration: 5000,
                    panelClass: 'error-snackbar'
                });
            }
        });
    } else {
        this.categoryForm.markAllAsTouched();
    }
}
}
