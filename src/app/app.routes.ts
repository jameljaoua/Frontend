import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Home } from './home/home';
import { SingleProduct } from './public/components/single-product/single-product';
import { Shop } from './public/components/shop/shop';
import { About } from './public/components/about/about';
import { Contact } from './public/components/contact/contact';
import { CategoryProducts } from './public/components/category-products/category-products';
import { adminGuard } from './services/auth/admin-guard';
import { customerGuard } from './services/auth/customer-guard';


export const routes: Routes = [{
      path: '',
    component: PublicLayout, // Le composant qui contient le <router-outlet> pour les enfants
    children: [
 { path: '', component: Home },
 { path: 'shop', component: Shop },
 { path: 'about', component: About },
 { path: 'contact', component: Contact },
 {path :'category-products/:categoryId', component : CategoryProducts},
 {path :'single-product/:productId',component : SingleProduct},
{path :"login",component : Login},
{path :"register",component : Signup}]
,},{
    path: 'admin',
    canActivate: [adminGuard], // Protéger les routes admin avec un guard
    loadChildren: () => import('./admin/admin-routing') // Charge le module de routage
      .then(m => m.AdminRoutingModule)
  },{
    path: 'customer',
    canActivate: [customerGuard], // Protéger les routes customer avec un guard
    loadChildren: () => import('./customers/customer-routing') // Charge le module de routage
      .then(m => m.CustomerRoutingModule)
  },

];
