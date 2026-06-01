import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-update-subcategory',
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
  templateUrl: './update-subcategory.html',
  styleUrl: './update-subcategory.css',
})
export class UpdateSubcategory implements OnInit{
    subcategoryId!: number;
subcategoryForm: FormGroup;
listOfCategories: any = [];

constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
){}
  ngOnInit(): void {
      console.log('UPDATE   SUBCATEGORY LOADED');

    this.subcategoryId = Number(this.activatedRoute.snapshot.paramMap.get('subcategoryId'));
    this.subcategoryForm = this.fb.group({
        categoryId: [null, [Validators.required]],
        name_subcat: [null, [Validators.required]],
        description_subcat: [null, [Validators.required]],
    });
    this.getAllCategories();
    this.getSubcategoryById();

}
getAllCategories(){
    this.adminService.getAllCategories().subscribe(res => {
        this.listOfCategories = res;
    })
}
getSubcategoryById(){
  this.adminService.getSubCategoryById(this.subcategoryId).subscribe({
    next: res => {
      this.subcategoryForm.patchValue(res);
    },
    error: err => {
      console.error(err);
      this.snackBar.open('Subcategory  not found','ERROR',{duration:3000});
    }
  });
}
updateSubcategory(): void {
    if (this.subcategoryForm.valid){
      const formData : FormData = new FormData();
      formData.append('categoryId',this.subcategoryForm.get('categoryId').value);

      formData.append('name_subcat',this.subcategoryForm.get('name_subcat').value);
      formData.append('description_subcat',this.subcategoryForm.get('description_subcat').value);
      this.adminService.updateSubCategory(this.subcategoryId, formData).subscribe((res)=>{
        if (res.id != null){
          this.snackBar.open('Subcategory Updated Successfully!','Close',{
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
      for (const i in this.subcategoryForm.controls){
          this.subcategoryForm.controls[i].markAsDirty();
          this.subcategoryForm.controls[i].updateValueAndValidity();
      }
    }
}
}

