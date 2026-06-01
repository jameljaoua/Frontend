import { NgModule } from "@angular/core";
import { RouterModule,Routes } from "@angular/router";
import { Admin } from "./admin";
import { Dashboard } from "./components/dashboard/dashboard";
import { PostCategory } from "./components/post-category/post-category";
import { PostProduct } from "./components/post-product/post-product";
import { ShowProducts } from "./components/product/show-products/show-products";
import { ProductDetails } from "./components/product/product-details/product-details";
import { UpdateProduct } from "./components/product/update-product/update-product";
import { AdminLayout } from "../layouts/admin-layout/admin-layout";
import { ShowCategories } from "./components/categorie/show-categories/show-categories";
import { CategoryDetails } from "./components/categorie/category-details/category-details";
import { UpdateCategory } from "./components/categorie/update-category/update-category";
import { PostCoupon } from "./components/coupon/post-coupon/post-coupon";
import { Coupons } from "./components/coupon/coupons/coupons";
import { Profile } from "./components/profile/profile";
import { UpdateCoupon } from "./components/coupon/update-coupon/update-coupon";
import { CouponDetails } from "./components/coupon/coupon-details/coupon-details";
import { Orders } from "./components/order/orders/orders";
import { UserDetails } from "./components/user/user-details/user-details";
import { UpdateUser } from "./components/user/update-user/update-user";
import { ShowUsers } from "./components/user/show-users/show-users";
import { OrderDetails } from "./components/order/order-details/order-details";
import { PostUser } from "./components/user/post-user/post-user";
import { SubcategoryDetails } from "./components/subcategorie/subcategory-details/subcategory-details";
import { UpdateSubcategory } from "./components/subcategorie/update-subcategory/update-subcategory";
import { ShowSubcategories } from "./components/subcategorie/show-subcategories/show-subcategories";
import { PostSubcategory } from "./components/subcategorie/post-subcategory/post-subcategory";
import { Downloads } from "./components/download/downloads/downloads";
import { DownloadDetails } from "./components/download/download-details/download-details";
import { Analytics } from "./components/analytics/analytics";
import { Transactions } from "./components/transaction/transactions/transactions";
import { TransactionDetails } from "./components/transaction/transaction-details/transaction-details";
import { Notifications } from "./components/notification/notifications/notifications";
const routes : Routes =[
  {
    path: '', 
    component: AdminLayout, // Le composant qui contient le <router-outlet> pour les enfants
    children: [
      { path: 'dashboard', component: Dashboard },
          { path: 'category/:categoryId/details', component: CategoryDetails},
      { path: 'category/:categoryId/edit', component: UpdateCategory},
      { path: 'categories', component: ShowCategories },
            { path: 'add-category', component: PostCategory },

         { path: 'subcategory/:subcategoryId/details', component: SubcategoryDetails},
      { path: 'subcategory/:subcategoryId/edit', component: UpdateSubcategory},
      { path: 'subcategories', component: ShowSubcategories },
            { path: 'add-subcategory', component: PostSubcategory },

      { path: 'product/:productId/details', component: ProductDetails},
      { path: 'product/:productId/edit', component: UpdateProduct},
      { path: 'products', component: ShowProducts },
      { path: 'add-product', component: PostProduct },

      { path: 'add-coupon', component: PostCoupon },
      { path: 'coupons', component: Coupons },
          { path: 'coupon/:couponId/details', component: CouponDetails},
      { path: 'coupon/:couponId/edit', component: UpdateCoupon},
      {path :'profile', component: Profile},
      {path : 'orders', component : Orders},
      {path : 'downloads', component : Downloads},
      {path : 'transactions', component : Transactions},
            { path: 'user/:userId/details', component: UserDetails},
      { path: 'user/:userId/edit', component: UpdateUser},
      { path: 'users', component: ShowUsers },
      {path : 'add-user', component: PostUser},
       { path: 'order/:orderId/details', component: OrderDetails},
       { path: 'download/:downloadId/details', component: DownloadDetails},
       { path: 'transaction/:paymentId/details', component: TransactionDetails},
       {path : 'analytics', component : Analytics},
       {path : 'notifications', component : Notifications}

    ]
  }
];
@NgModule({
    imports :[RouterModule.forChild(routes)],
    exports :[RouterModule]
})
export class AdminRoutingModule{}