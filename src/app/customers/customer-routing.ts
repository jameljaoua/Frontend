import { NgModule } from "@angular/core";
import { RouterModule,Routes } from "@angular/router";
import { Dashboard } from "./components/dashboard/dashboard";
import { Cart } from "./components/cart/cart";
import { PublicLayout } from "../layouts/public-layout/public-layout";
import { CustomerLayout } from "../layouts/customer-layout/customer-layout";
import { Home } from "./components/home/home";
import { SingleProduct } from "./components/single-product/single-product";
import { Shop } from "./components/shop/shop";
import { About } from "./components/about/about";
import { Contact } from "./components/contact/contact";
import { CategoryProducts } from "./components/category-products/category-products";
import { MyOrders } from "./components/my-orders/my-orders";
import { ViewOrderedProducts } from "./components/view-ordered-products/view-ordered-products";
import { Profile } from "./components/profile/profile";
import { Checkout } from "./components/checkout/checkout";
import { MyPurchasedOrders } from "./components/my-purchased-orders/my-purchased-orders";
import { ViewPurchasedOrderedProducts } from "./components/view-purchased-ordered-products/view-purchased-ordered-products";
import { MyNotifications } from "./components/notification/my-notifications/my-notifications";
const routes : Routes =[
    {
    path: '', 
    component: CustomerLayout, // Le composant qui contient le <router-outlet> pour les enfants
    children: [
    {path : '',component : Home},
    {path : 'dashboard',component : Dashboard},
    {path : 'cart',component :Cart},
    {path : 'shop',component :Shop},
    {path : 'about',component :About},
    {path : 'contact',component :Contact},
    { path: 'single-product/:productId', component: SingleProduct},
    { path: 'category-products/:categoryId', component: CategoryProducts},
    {path : 'my-orders',component : MyOrders},
    {path:'ordered-products/:orderId',component : ViewOrderedProducts},
    {path :'profile', component : Profile},
    {path : 'checkout/:orderId', component : Checkout},
    {path : 'billing', component : MyPurchasedOrders},
    {path : 'purchased-orders/:orderId', component : ViewPurchasedOrderedProducts},
        {path : 'my-notifications', component : MyNotifications},
    ]
    }
];
@NgModule({
    imports :[RouterModule.forChild(routes)],
    exports :[RouterModule]
})
export class CustomerRoutingModule{}