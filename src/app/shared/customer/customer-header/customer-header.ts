import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { CustomerService } from '../../../customers/services/customer.service';

@Component({
  selector: 'app-customer-header',
    standalone: true, // Assurez-vous que c'est bien un composant standalone

  imports: [
    
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule, 
  ],
  templateUrl: './customer-header.html',
  styleUrl: './customer-header.css',
})
export class CustomerHeader {
  notifications: any[] = [];
userId = Number(UserStorageService.getUserId());
  searchQuery: string = "";
  selectedCategory: string = "All categories";
  cartItems : any[] = [];
  order :any;
  products: any[] = []; // Liste des résultats
  categories: any[] = [];
    isCustomerLoggedIn : boolean = UserStorageService.isCustomerLoggedIn();

constructor(private router: Router,private customerService: CustomerService,    private cdr: ChangeDetectorRef
) {}
ngOnInit(): void {
  this.loadCustomerNotifications();
      this.getAllCategories();
    this.getCart();
    this.cdr.detectChanges();
    this.router.events.subscribe(event => {
      
        this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
          this.loadCustomerNotifications();
        this.cdr.detectChanges();

    })

} 
loadCustomerNotifications() {
  this.customerService.getCustomerNotifications(this.userId).subscribe({
      next: (data) => {
        this.notifications = data;
        this.cdr.detectChanges(); // Force Angular à voir les nouvelles notifications
      },
      error: (err) => console.error("Erreur chargement notifications", err)
    });
}

getUnreadCount(): number {
  return this.notifications.filter(n => !n.isRead).length;
}

markAsRead(notification: any) {
  this.customerService.markCustomerNotificationAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.cdr.detectChanges(); // Force Angular à voir le changement d'état
      },
      error: (err) => console.error(err)
    });
}
    getCart(){
      this.cartItems = [];
      this.customerService.getCartByUserId().subscribe(res=>{
      this.order = res;
        res.cartItems.forEach(element=>{
          this.cartItems.push(element);
        });
      })
    this.cdr.detectChanges(); // Déclenchez la détection des changements après la mise à jour des données
    }
onSearch() {
    if (this.selectedCategory === "All categories") {
      // Recherche globale par titre
      this.customerService.getAllProductsByName(this.searchQuery).subscribe(res => {
        this.products = res;
      });
    } else {
      // Recherche filtrée par catégorie (utilise l'endpoint que nous avons créé)
      this.customerService.getProductsByCategoryName(this.selectedCategory).subscribe(res => {
        // Optionnel : filtrez aussi par nom localement si besoin
        this.products = res.filter((p: any) => 
          p.nameProd.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  }
   getAllCategories() {
    this.customerService.getAllCategories().subscribe(res => {
      this.categories = res.map((c: any) => ({
        ...c,
      }));
      this.cdr.detectChanges();
    });
  }
logout() {
    UserStorageService.signOut();
    this.router.navigateByUrl('login');
}
}
