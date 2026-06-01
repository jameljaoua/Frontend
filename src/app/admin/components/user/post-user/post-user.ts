import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-post-user',
    imports: [
      CommonModule,         // Résout l'erreur NG8103 (*ngIf)
      ReactiveFormsModule,  // Résout l'erreur NG8002 (formGroup)
      MatFormFieldModule, // Import individuel
      MatInputModule,     // Import individuel
      MatButtonModule,    // Import individuel
      MatSnackBarModule   // Import individuel
    ],
  templateUrl: './post-user.html',
  styleUrl: './post-user.css',
})
export class PostUser {
userForm!: FormGroup;
  hidePassword = true;

constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
) {}
ngOnInit(): void {
    this.userForm = this.fb.group({
    name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
}
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  addUser(): void {
    if (this.userForm.valid) {
        this.adminService.addUser(this.userForm.value).subscribe((res) => {
            if (res.id != null) {
                this.snackBar.open('User Posted Successfully!', 'Close', {
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
        this.userForm.markAllAsTouched();
    }
}

}
