import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-post-subcategory',
    imports: [
    CommonModule,         // Résout l'erreur NG8103 (*ngIf)
    ReactiveFormsModule,  // Résout l'erreur NG8002 (formGroup)
    MatFormFieldModule, // Import individuel
    MatInputModule,     // Import individuel
    MatButtonModule,    // Import individuel
    MatSnackBarModule,   // Import individuel
        MatIconModule,
    MatSelectModule
  ],
  templateUrl: './post-subcategory.html',
  styleUrl: './post-subcategory.css',
})
export class PostSubcategory {
subcategoryForm!: FormGroup;
listOfCategories: any = [];
constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
) {}

ngOnInit(): void {
    this.subcategoryForm = this.fb.group({
        name_subcat: [null, [Validators.required]],
        description_subcat: [null, [Validators.required]],
        categoryId: [null, [Validators.required]],

    });
    this.getAllCategories();
}
getAllCategories(){
    this.adminService.getAllCategories().subscribe(res => {
        this.listOfCategories = res;
    })
}

addSubcategory(): void {
 if (this.subcategoryForm.valid) {
        this.adminService.addSubCategory(this.subcategoryForm.value).subscribe((res) => {
            if (res.id != null) {
                this.snackBar.open('Subcategory Posted Successfully!', 'Close', {
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
        this.subcategoryForm.markAllAsTouched();
    }
}
}
