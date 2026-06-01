import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-post-coupon',
  imports: [
        CommonModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './post-coupon.html',
  styleUrl: './post-coupon.css',
})
export class PostCoupon {
couponForm !: FormGroup;
constructor(private fb:FormBuilder,
  private router: Router,
  private  snackBar : MatSnackBar,
  private adminService :AdminService
){}
  ngOnInit(): void {
    this.couponForm = this.fb.group({
        name_cpn: [null, [Validators.required]],
        code_cpn: [null, [Validators.required]],
        discount: [null, [Validators.required]],
        expirationDate: [null, [Validators.required]],
    });
}
  addCoupon(){
    if(this.couponForm.valid){
      this.adminService.addCoupon(this.couponForm.value).subscribe(res=>{
        if (res.id !=null){
          this.snackBar.open('Coupon Posted Successfully!','Close',{
            duration :5000
          });
          this.router.navigateByUrl('/admin/dashboard');
        }else{
          this.snackBar.open(res.message,'Close',{
            duration :5000,
            panelClass : 'error-snackbar'
          })
        }
      })
      }else {
          this.couponForm.markAllAsTouched();
      }
  }
}