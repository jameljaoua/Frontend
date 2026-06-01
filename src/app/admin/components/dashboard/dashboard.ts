import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { ChangeDetectorRef } from '@angular/core'; // Importez ceci

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
        CommonModule,
        RouterLink,

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
    products : any[] = [];
    categories : any[] = [];
    users : any[] = [];
    orders : any[] = [];
      constructor(private adminService :AdminService,private cdr: ChangeDetectorRef){}
    ngOnInit(){
      this.getAllProducts();
      this.getAllCategories();
      this.getAllUsers();
      this.getAllOrders();
    
      }
    getAllProducts(){
      this.products = [];
      this.adminService.getAllProducts().subscribe(res=>{
        res.forEach(element => {
          this.products.push(element);
        });
            this.cdr.detectChanges(); 

      })
    }
        getAllCategories(){
      this.categories = [];
      this.adminService.getAllCategories().subscribe(res=>{
        res.forEach(element => {
          this.categories.push(element);
        });
            this.cdr.detectChanges(); 

      })
    }
      getAllUsers(){
      this.users = [];
      this.adminService.getAllUsers().subscribe(res=>{
        res.forEach(element => {
          this.users.push(element);
        });
            this.cdr.detectChanges(); 

      })
    }
       getAllOrders(){
      this.orders = [];
      this.adminService.getAllOrders().subscribe(res=>{
        res.forEach(element => {
          this.orders.push(element);
        });
            this.cdr.detectChanges(); 

      })
    }
}
