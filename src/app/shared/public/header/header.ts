import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { FormsModule } from '@angular/forms';
import { PublicService } from '../../../services/public/public.service';

@Component({
  selector: 'app-header',
  standalone: true, // Assurez-vous que c'est bien un composant standalone
  imports: [
    
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule, // <--- 2. Ajoutez-le ici
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  searchQuery: string = "";
  selectedCategory: string = "All categories";
  products: any[] = []; // Liste des résultats
  categories: any[] = [];

    isCustomerLoggedIn : boolean = UserStorageService.isCustomerLoggedIn();
    isAdminLoggedIn : boolean = UserStorageService.isAdminLoggedIn();

  
constructor(private router: Router,private publicService: PublicService,    private cdr: ChangeDetectorRef
) {}
ngOnInit(): void {
    this.router.events.subscribe(event => {
      
        this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
        this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();

    })
    this.getAllCategories();

}
onSearch() {
    if (this.selectedCategory === "All categories") {
      // Recherche globale par titre
      this.publicService.getAllProductsByName(this.searchQuery).subscribe(res => {
        this.products = res;
      });
    } else {
      // Recherche filtrée par catégorie (utilise l'endpoint que nous avons créé)
      this.publicService.getProductsByCategoryName(this.selectedCategory).subscribe(res => {
        // Optionnel : filtrez aussi par nom localement si besoin
        this.products = res.filter((p: any) => 
          p.nameProd.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  }
    getAllCategories() {
    this.publicService.getAllCategories().subscribe(res => {
      this.categories = res.map((c: any) => ({
        ...c,
      }));
      this.cdr.detectChanges();
    });
  }

 }
