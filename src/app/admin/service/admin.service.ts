import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';
const BASIC_URL= "http://localhost:8081/"

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http:HttpClient){ }
    addCategory(categoryDto:any):Observable<any>{
      return this.http.post(BASIC_URL +'api/admin/category',categoryDto,{
        headers: this.createAuthorizationHeader(),
      })
    }
        addSubCategory(subcategoryDto:any):Observable<any>{
      return this.http.post(BASIC_URL +'api/admin/subcategory',subcategoryDto,{
        headers: this.createAuthorizationHeader(),
      })
    }
    addProduct(productDto:any):Observable<any>{
      return this.http.post(BASIC_URL +'api/admin/product',productDto,{
        headers: this.createAuthorizationHeader(),
      })
    }
    getAllCategories():Observable<any>{
      return this.http.get(BASIC_URL +'api/admin/categories',{
        headers: this.createAuthorizationHeader(),
      })
    }
        getAllSubCategories():Observable<any>{
      return this.http.get(BASIC_URL +'api/admin/subcategories',{
        headers: this.createAuthorizationHeader(),
      })
    }
    getAllProducts():Observable<any>{
      return this.http.get(BASIC_URL +'api/admin/products',{
        headers: this.createAuthorizationHeader(),
      })
    }
     getAllProductsByName(name_prod:any):Observable<any>{
      return this.http.get(BASIC_URL +`api/admin/product/search/${name_prod}`,{
        headers: this.createAuthorizationHeader(),
      })
    }
      deleteProduct(productId:any):Observable<any>{
      return this.http.delete(BASIC_URL +`api/admin/product/${productId}`,{
        headers: this.createAuthorizationHeader(),
        observe: 'response'
      })
    }
    // Récupérer un produit spécifique pour charger le formulaire d'édition
getProductById(productId:number): Observable<any> {
  return this.http.get(BASIC_URL + `api/admin/product/${productId}`, {
    headers: this.createAuthorizationHeader(),
  });
}

// Mettre à jour le produit (Utilise PUT car défini avec @PutMapping dans le Controller)
updateProduct(productId: any, productDto: any): Observable<any> {
  return this.http.put(BASIC_URL + `api/admin/product/${productId}`, productDto, {
    headers: this.createAuthorizationHeader(),
  });
}
downloadProductFile(productId: number): Observable<Blob> {
  return this.http.get(BASIC_URL+`api/admin/product/${productId}/download`, {
    headers: this.createAuthorizationHeader(),
    responseType: 'blob'
  });
}
     getAllCategoriesByName(name_cat:any):Observable<any>{
      return this.http.get(BASIC_URL +`api/admin/category/search/${name_cat}`,{
        headers: this.createAuthorizationHeader(),
      })
    }
         getAllSubCategoriesByName(name_subcat:any):Observable<any>{
      return this.http.get(BASIC_URL +`api/admin/subcategory/search/${name_subcat}`,{
        headers: this.createAuthorizationHeader(),
      })
    }
     deleteCategory(categoryId:any):Observable<any>{
      return this.http.delete(BASIC_URL +`api/admin/category/${categoryId}`,{
        headers: this.createAuthorizationHeader(),
        observe: 'response'
      })
    }
        deleteSubCategory(subcategoryId:any):Observable<any>{
      return this.http.delete(BASIC_URL +`api/admin/subcategory/${subcategoryId}`,{
        headers: this.createAuthorizationHeader(),
        observe: 'response'
      })
    }
        // Récupérer une categorie spécifique pour charger le formulaire d'édition
getCategoryById(categoryId:number): Observable<any> {
  return this.http.get(BASIC_URL + `api/admin/category/${categoryId}`, {
    headers: this.createAuthorizationHeader(),
  });
}
// Mettre à jour la catégorie (Utilise PUT car défini avec @PutMapping dans le Controller)
updateCategory(categoryId: any, categoryDto: any): Observable<any> {
  return this.http.put(BASIC_URL + `api/admin/category/${categoryId}`, categoryDto, {
    headers: this.createAuthorizationHeader(),
  });
}
        // Récupérer une sous categorie spécifique pour charger le formulaire d'édition
getSubCategoryById(subcategoryId:number): Observable<any> {
  return this.http.get(BASIC_URL + `api/admin/subcategory/${subcategoryId}`, {
    headers: this.createAuthorizationHeader(),
  });
}
// Mettre à jour la sous catégorie (Utilise PUT car défini avec @PutMapping dans le Controller)
updateSubCategory(subcategoryId: any, subcategoryDto: any): Observable<any> {
  return this.http.put(BASIC_URL + `api/admin/subcategory/${subcategoryId}`, subcategoryDto, {
    headers: this.createAuthorizationHeader(),
  });
}
    addCoupon(couponDto:any):Observable<any>{
      return this.http.post(BASIC_URL +'api/admin/coupon',couponDto,{
        headers: this.createAuthorizationHeader(),
      })
    }
        getCoupons():Observable<any>{
      return this.http.get(BASIC_URL +'api/admin/coupons',{
        headers: this.createAuthorizationHeader(),
      })
    }
    getProfile(userId: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/profile/${userId}`, {
      headers: this.createAuthorizationHeader()
    });
  }
  updateProfile(userId: number, profileDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/admin/profile/${userId}`, profileDto, {
      headers: this.createAuthorizationHeader(),
       observe: 'response'

    });
  }
  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${BASIC_URL}api/admin/categories/${categoryId}/products`, {
            headers: this.createAuthorizationHeader(),
          });
  
  }
  // Pour récupérer catégorie + produits en une seule requête
  getCategoryWithProducts(categoryId: number): Observable<any> {
    return this.http.get<any>(`${BASIC_URL}api/admin/categories/${categoryId}/with-products`, {
            headers: this.createAuthorizationHeader(),
          });
  }
    getSubCategoriesByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${BASIC_URL}api/admin/categories/${categoryId}/subcategories`, {
            headers: this.createAuthorizationHeader(),
          });
  
  }
  // Pour récupérer catégorie + sous-catégories en une seule requête
  getCategoryWithSubCategories(categoryId: number): Observable<any> {
    return this.http.get<any>(`${BASIC_URL}api/admin/categories/${categoryId}/with-subcategories`, {
            headers: this.createAuthorizationHeader(),
          });
  }
    getProductsBySubCategory(subcategoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${BASIC_URL}api/admin/subcategories/${subcategoryId}/products`, {
            headers: this.createAuthorizationHeader(),
          });
  
  }
  // Pour récupérer sous-catégorie + produits en une seule requête
  getSubCategoryWithProducts(subcategoryId: number): Observable<any> {
    return this.http.get<any>(`${BASIC_URL}api/admin/subcategories/${subcategoryId}/with-products`, {
            headers: this.createAuthorizationHeader(),
          });
  }
      getAllCouponsByName(name_cpn:any):Observable<any>{
      return this.http.get(BASIC_URL +`api/admin/coupon/search/${name_cpn}`,{
        headers: this.createAuthorizationHeader(),
      })
    }
          deleteCoupon(couponId:any):Observable<any>{
      return this.http.delete(BASIC_URL +`api/admin/coupon/${couponId}`,{
        headers: this.createAuthorizationHeader(),
        observe: 'response'
      })
    }
           // Récupérer une coupon spécifique pour charger le formulaire d'édition
getCouponById(couponId:number): Observable<any> {
  return this.http.get(BASIC_URL + `api/admin/coupon/${couponId}`, {
    headers: this.createAuthorizationHeader(),
  });
}
// Mettre à jour  coupon (Utilise PUT car défini avec @PutMapping dans le Controller)
updateCoupon(couponId: any, couponDto: any): Observable<any> {
  return this.http.put(BASIC_URL + `api/admin/coupon/${couponId}`, couponDto, {
    headers: this.createAuthorizationHeader(),
  });
}
    addUser(userDto:any):Observable<any>{
      return this.http.post(BASIC_URL +'api/admin/user',userDto,{
        headers: this.createAuthorizationHeader(),
      })
    }
   getAllOrders():Observable<any>{
      return this.http.get(BASIC_URL +'api/admin/orders',{
        headers: this.createAuthorizationHeader(),
      })
    }
       getAllPurchasedOrders():Observable<any>{
      return this.http.get(BASIC_URL +'api/admin/purchased-orders',{
        headers: this.createAuthorizationHeader(),
      })
    }
     getAllDownloads():Observable<any>{
      return this.http.get(BASIC_URL +'api/admin/downloads',{
        headers: this.createAuthorizationHeader(),
      })
    }
    getAllUsers():Observable<any>{
      return this.http.get(BASIC_URL +'api/admin/users',{
        headers: this.createAuthorizationHeader(),
      })
    }
    getAllUsersByName(name:any):Observable<any>{
      return this.http.get(BASIC_URL +`api/admin/user/search/${name}`,{
        headers: this.createAuthorizationHeader(),
      })
    }
      deleteUser(userId:any):Observable<any>{
      return this.http.delete(BASIC_URL +`api/admin/user/${userId}`,{
        headers: this.createAuthorizationHeader(),
        observe: 'response'
      })
    }
    // Récupérer un utilisateur spécifique pour charger le formulaire d'édition
getUserById(userId:number): Observable<any> {
  return this.http.get(BASIC_URL + `api/admin/user/${userId}`, {
    headers: this.createAuthorizationHeader(),
  });
}
getAllTransactions():Observable<any>{
   return this.http.get(BASIC_URL +'api/admin/transactions',{
     headers: this.createAuthorizationHeader(),
  })
}
getTransactionById(paymentId:number): Observable<any> {
  return this.http.get(BASIC_URL + `api/admin/transaction/${paymentId}`, {
    headers: this.createAuthorizationHeader(),
  });
}
// Mettre à jour le utilisateur (Utilise PUT car défini avec @PutMapping dans le Controller)
updateUser(userId: any, userDto: any): Observable<any> {
  return this.http.put(BASIC_URL + `api/admin/user/${userId}`, userDto, {
    headers: this.createAuthorizationHeader(),
  });
}
changeUserRole(userId:number,role:string): Observable<any> {
  return this.http.get(BASIC_URL + `api/admin/user/${userId}/${role}`, {
    headers: this.createAuthorizationHeader(),
  });
}
getDownloadById(downloadId:number): Observable<any> {
  return this.http.get(BASIC_URL + `api/admin/download/${downloadId}`, {
    headers: this.createAuthorizationHeader(),
  });
}
    // Récupérer une commande spécifique 
getOrderById(orderId:number): Observable<any> {
  return this.http.get(BASIC_URL + `api/admin/order/${orderId}`, {
    headers: this.createAuthorizationHeader(),
  });
}
      deleteOrder(orderId:any):Observable<any>{
      return this.http.delete(BASIC_URL +`api/admin/order/${orderId}`,{
        headers: this.createAuthorizationHeader(),
        observe: 'response'
      })
    }
      getOrdersReport(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/orders/report', {
      headers: this.createAuthorizationHeader()
    });
    }
    getNotifications(): Observable<any[]> {
      return this.http.get<any[]>(`${BASIC_URL}api/admin/notifications`, {
        headers: this.createAuthorizationHeader()
      });
    }
    markAsRead(id: number): Observable<any> {
      return this.http.put(`${BASIC_URL}api/admin/notifications/${id}/read`, {}, {
          headers: this.createAuthorizationHeader()
        });
  }
  getOrdersByUserName(userName: string): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/orders/search/${userName}`, {
      headers: this.createAuthorizationHeader()
    });
  }
    getDownloadsByUserName(userName: string): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/downloads/search/${userName}`, {
      headers: this.createAuthorizationHeader()
    });
  }
    getPaymentsByUserName(userName: string): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/transactions/search/${userName}`, {
      headers: this.createAuthorizationHeader()
    });
  }
     getNotificationsByUserName(userName: string): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/notifications/search/${userName}`, {
      headers: this.createAuthorizationHeader()
    });
  }
  
    private createAuthorizationHeader():HttpHeaders{
      return new HttpHeaders().set(
        'Authorization','Bearer '+UserStorageService.getToken()
      )
    }

}
