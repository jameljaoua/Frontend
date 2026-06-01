import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit{
  userId!: number;
  user: any;
constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = Number(params.get('userId'));
      if (this.userId) {
        this.getUserDetails();
      } else {
        this.snackBar.open('Invalid user ID', 'ERROR', {duration: 3000});
      }
    });
  
  }
 getUserDetails() {
    this.adminService.getUserById(this.userId).subscribe({
      next: res => {
        if (res) {
          this.user = res;
          this.user.processedImg = 'data:image/jpeg;base64,' + res.byteImg;
          console.log('User ID:', this.userId);
          console.log('User details:', this.user);
          this.cdr.detectChanges(); 
        } else {
          this.snackBar.open('User not found', 'ERROR', {duration: 3000});
        }
      },
      error: err => {
        console.error('Error fetching user:', err);
        this.snackBar.open('Error loading user details', 'ERROR', {duration: 3000});
      }
    });
  }

}

