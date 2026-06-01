import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../service/admin.service';

@Component({
  selector: 'app-download-details',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],

  templateUrl: './download-details.html',
  styleUrl: './download-details.css',
})
export class DownloadDetails implements OnInit{
  downloadId!: number;
  download: any;
constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.downloadId = Number(params.get('downloadId'));
      if (this.downloadId) {
        this.getDownloadDetails();
      } else {
        this.snackBar.open('Invalid download ID', 'ERROR', {duration: 3000});
      }
    });
  
  }
 getDownloadDetails() {
    this.adminService.getDownloadById(this.downloadId).subscribe({
      next: res => {
        if (res) {
          this.download = res;
          console.log('Download ID:', this.downloadId);
          console.log('Download details:', this.download);
          this.cdr.detectChanges(); 
        } else {
          this.snackBar.open('Download not found', 'ERROR', {duration: 3000});
        }
      },
      error: err => {
        console.error('Error fetching download:', err);
        this.snackBar.open('Error loading download details', 'ERROR', {duration: 3000});
      }
    });
  }

}

