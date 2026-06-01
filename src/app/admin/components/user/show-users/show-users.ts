import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-show-users',
   standalone: true,
    imports: [
      FormsModule,
      CommonModule,
      RouterLink,
      ReactiveFormsModule,
      MatTableModule,
      MatButtonModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule
    ],
  templateUrl: './show-users.html',
  styleUrl: './show-users.css',
})
export class ShowUsers implements OnInit {
searchText: string = '';

  users: any[] = [];
  searchUserForm!: FormGroup;

  displayedColumns: string[] = [
    'image',
    'name',
    'email',
    'role',
    'actions'
  ];

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchUserForm = this.fb.group({
      title: [null, Validators.required]
    });

    this.getAllUsers();
  }

  getAllUsers() {
    this.adminService.getAllUsers().subscribe(res => {
      this.users = res.map((u: any) => ({
        ...u,
        processedImg: 'data:image/jpeg;base64,' + u.byteImg
      }));
      this.cdr.detectChanges(); 

    });
  }
get filteredUsers() {
  if (!this.searchText) {
    return this.users;
  }

  return this.users.filter(user =>
    user.name
      .toLowerCase()
      .includes(this.searchText.toLowerCase())
  );
}
  submitForm() {
    const title = this.searchUserForm.value.title;
    this.adminService.getAllUsersByName(title).subscribe(res => {
      this.users = res.map((u: any) => ({
        ...u,
        processedImg: 'data:image/jpeg;base64,' + u.byteImg
      }));
    });
  }

  deleteUser(userId: number) {
    this.adminService.deleteUser(userId).subscribe(res => {
      if (!res.body) {
        this.snackBar.open('User Deleted Successfully!', 'Close', { duration: 3000 });
        this.getAllUsers();
      }
    });
  }
}

