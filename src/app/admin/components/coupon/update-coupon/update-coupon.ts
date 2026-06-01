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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-update-coupon',
    standalone: true,
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
  templateUrl: './update-coupon.html',
  styleUrl: './update-coupon.css',
})
export class UpdateCoupon implements OnInit{
 couponId!: number;
couponForm: FormGroup;
constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
){}
  ngOnInit(): void {
      console.log('UPDATE COUPON LOADED');

    this.couponId = Number(this.activatedRoute.snapshot.paramMap.get('couponId'));
    this.couponForm = this.fb.group({
        name_cpn: [null, [Validators.required]],
        code_cpn: [null, [Validators.required]],
        discount: [null, [Validators.required]],
        expirationDate: [null, [Validators.required]],
    });
    this.getCouponById();

}
getCouponById(){
  this.adminService.getCouponById(this.couponId).subscribe({
    next: res => {
      this.couponForm.patchValue(res);
    },
    error: err => {
      console.error(err);
      this.snackBar.open('Coupon not found','ERROR',{duration:3000});
    }
  });
}
updateCoupon(): void {
    if (this.couponForm.valid){
      const formData : FormData = new FormData();

      formData.append('name_cpn',this.couponForm.get('name_cpn').value);
      formData.append('code_cpn',this.couponForm.get('code_cpn').value);
      formData.append('discount',this.couponForm.get('discount').value);
           // Formater la date au format attendu par Spring (yyyy-MM-dd)
      const dateValue = this.couponForm.get('expirationDate')?.value;
      const formattedDate = this.formatDate(dateValue);
      formData.append('expirationDate', formattedDate);

      this.adminService.updateCoupon(this.couponId, formData).subscribe((res)=>{
        if (res.id != null){
          this.snackBar.open('Coupon Updated Successfully!','Close',{
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
      for (const i in this.couponForm.controls){
          this.couponForm.controls[i].markAsDirty();
          this.couponForm.controls[i].updateValueAndValidity();
      }
    }
}
// Méthode utilitaire pour formater la date
  private formatDate(date: any): string {
    if (!date) return '';
    
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // Si c'est déjà une string, extraire la partie date
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

