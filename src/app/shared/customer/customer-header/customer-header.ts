import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { CustomerService } from '../../../customers/services/customer.service';

@Component({
  selector: 'app-customer-header',
  standalone: true,
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
  cartItems: any[] = [];
  order: any;
  products: any[] = [];
  categories: any[] = [];
  isCustomerLoggedIn: boolean = UserStorageService.isCustomerLoggedIn();

  isMobileMenuOpen: boolean = false;
  isNotifOpen: boolean = false;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadCustomerNotifications();
    this.getAllCategories();
    this.getCart();
    this.initDarkModeFromStorage();
    this.cdr.detectChanges();

    this.router.events.subscribe(() => {
      this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
      this.loadCustomerNotifications();
      this.cdr.detectChanges();
    });
  }

  loadCustomerNotifications() {
    this.customerService.getCustomerNotifications(this.userId).subscribe({
      next: (data) => {
        this.notifications = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur chargement notifications", err)
    });
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  toggleNotifDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.isNotifOpen = !this.isNotifOpen;
  }

  closeNotifDropdown() {
    this.isNotifOpen = false;
  }

  // Ferme le dropdown si on clique en dehors du composant
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isNotifOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isNotifOpen = false;
      this.cdr.detectChanges();
    }
  }

  markAsRead(notification: any) {
    this.customerService.markCustomerNotificationAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  getCart() {
    this.cartItems = [];
    this.customerService.getCartByUserId().subscribe(res => {
      this.order = res;
      res.cartItems.forEach((element: any) => {
        this.cartItems.push(element);
      });
      this.cdr.detectChanges();
    });
  }

  getAllCategories() {
    this.customerService.getAllCategories().subscribe(res => {
      this.categories = res.map((c: any) => ({ ...c }));
      this.cdr.detectChanges();
    });
  }

  onSearch() {
    if (this.selectedCategory === "All categories") {
      this.customerService.getAllProductsByName(this.searchQuery).subscribe(res => {
        this.products = res;
      });
    } else {
      this.customerService.getProductsByCategoryName(this.selectedCategory).subscribe(res => {
        this.products = res.filter((p: any) =>
          p.nameProd.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
    document.body.classList.add('mobile-menu-active');
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.classList.remove('mobile-menu-active');
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkMode', isDark ? '1' : '0');
  }

  private initDarkModeFromStorage() {
    const saved = localStorage.getItem('darkMode');
    if (saved === '1') {
      document.body.classList.add('dark-theme');
      setTimeout(() => {
        const checkbox = document.getElementById('checkbox') as HTMLInputElement;
        if (checkbox) checkbox.checked = true;
      });
    }
  }

  logout() {
    UserStorageService.signOut();
    this.router.navigateByUrl('login');
  }
}