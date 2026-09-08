import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { FormsModule } from '@angular/forms';
import { PublicService } from '../../../services/public/public.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  categories: any[] = [];
  cartCount: number = 0;

  isCustomerLoggedIn: boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn: boolean = UserStorageService.isAdminLoggedIn();

  isMobileMenuOpen: boolean = false;

  constructor(
    private router: Router,
    private publicService: PublicService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
      this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
    });
    this.getAllCategories();
    this.initDarkModeFromStorage();
  }

  getAllCategories() {
    this.publicService.getAllCategories().subscribe(res => {
      this.categories = res.map((c: any) => ({ ...c }));
      this.cdr.detectChanges();
    });
  }

  onCategoryClick(category: any) {
    // Redirige vers /shop avec la catégorie en query param (adapte selon ta route shop)
    this.router.navigate(['/shop'], { queryParams: { category: category.name_cat } });
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
      // Coche la checkbox si elle existe déjà dans le DOM
      setTimeout(() => {
        const checkbox = document.getElementById('checkbox') as HTMLInputElement;
        if (checkbox) checkbox.checked = true;
      });
    }
  }

  logout() {
    UserStorageService.signOut();
    this.isCustomerLoggedIn = false;
    this.isAdminLoggedIn = false;
    this.router.navigate(['/login']);
  }
}