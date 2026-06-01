import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AdminHeader } from '../../shared/admin/admin-header/admin-header';
import { AdminSidebar } from '../../shared/admin/admin-sidebar/admin-sidebar';
import { AdminFooter } from '../../shared/admin/admin-footer/admin-footer';

@Component({
  selector: 'app-admin-layout',
  imports: [
        CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,  
    MaterialModule,
    AdminHeader,
    AdminSidebar,
    AdminFooter

  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements AfterViewInit{
  ngAfterViewInit() {
    // Force AdminLTE JS init
    (window as any).dispatchEvent(new Event('resize'));
  }
}
