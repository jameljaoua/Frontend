import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-update-category',
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
    templateUrl: './update-category.html',
  styleUrl: './update-category.css',
})
export class UpdateCategory implements OnInit{
    categoryId!: number;
categoryForm: FormGroup;
constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
){}
  ngOnInit(): void {
      console.log('UPDATE CATEGORY LOADED');

    this.categoryId = Number(this.activatedRoute.snapshot.paramMap.get('categoryId'));
    this.categoryForm = this.fb.group({
        name_cat: [null, [Validators.required]],
        description_cat: [null, [Validators.required]],
    });
    this.getCategoryById();

}
getCategoryById(){
  this.adminService.getCategoryById(this.categoryId).subscribe({
    next: res => {
      this.categoryForm.patchValue(res);
    },
    error: err => {
      console.error(err);
      this.snackBar.open('Category not found','ERROR',{duration:3000});
    }
  });
}
updateCategory(): void {
    if (this.categoryForm.valid){
      const formData : FormData = new FormData();

      formData.append('name_cat',this.categoryForm.get('name_cat').value);
      formData.append('description_cat',this.categoryForm.get('description_cat').value);
      this.adminService.updateCategory(this.categoryId, formData).subscribe((res)=>{
        if (res.id != null){
          this.snackBar.open('Category Updated Successfully!','Close',{
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
      for (const i in this.categoryForm.controls){
          this.categoryForm.controls[i].markAsDirty();
          this.categoryForm.controls[i].updateValueAndValidity();
      }
    }
}
}
