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
  selector: 'app-update-user',
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
  templateUrl: './update-user.html',
  styleUrl: './update-user.css',
})
export class UpdateUser implements OnInit{
  userId!: number;
userForm: FormGroup;
selectedFile: File | null;
imagePreview: string | ArrayBuffer | null;
existingImage: string | null = null;

imgChanged: boolean = false;
constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
){}

  onFileSelected(event: any) {
      this.selectedFile = event.target.files[0];
      this.previewImage();
      this.imgChanged = true;
  }

  previewImage(){
      const reader = new FileReader();
      reader.onload = () => {
          this.imagePreview = reader.result;
      }
      reader.readAsDataURL(this.selectedFile);
  }
  ngOnInit(): void {
      console.log('UPDATE USER LOADED');

    this.userId = Number(this.activatedRoute.snapshot.paramMap.get('userId'));
    this.userForm = this.fb.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required]],
        userrole: [null, [Validators.required]],

    });
    this.getUserById();

}


getUserById(){
  this.adminService.getUserById(this.userId).subscribe({
    next: res => {
      this.userForm.patchValue(res);
      this.existingImage = 'data:image/jpeg;base64,' + res.byteImg;
    },
    error: err => {
      console.error(err);
      this.snackBar.open('User not found','ERROR',{duration:3000});
    }
  });
}

updateUser(): void {
    if (this.userForm.valid){
      const formData : FormData = new FormData();
      if (this.imgChanged && this.selectedFile){
        formData.append('img',this.selectedFile);

      }
      formData.append('name',this.userForm.get('name').value);
      formData.append('email',this.userForm.get('email').value);
      formData.append('userrole',this.userForm.get('userrole').value);
      this.adminService.updateUser(this.userId, formData).subscribe((res)=>{
        if (res.id != null){
          this.snackBar.open('User Updated Successfully!','Close',{
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
      for (const i in this.userForm.controls){
          this.userForm.controls[i].markAsDirty();
          this.userForm.controls[i].updateValueAndValidity();
      }
    }
}
changeUserRole(userId:number,userrole:string){
  this.adminService.changeUserRole(userId,userrole).subscribe(res=>{
    if (res.id != null){
      this.snackBar.open('User Role Updated Successfully!','Close',{
        duration :5000
      });
      this.updateUser();
    }else{
      this.snackBar.open("Something went wrong",'Close', { duration :5000 })
    }
  })
}
}