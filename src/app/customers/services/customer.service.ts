import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserStorageService } from '../../services/storage/user-storage.service';
const BASIC_URL= "http://localhost:8081/"

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
    constructor(private http:HttpClient){ }

      getAllProducts():Observable<any>{
        return this.http.get(BASIC_URL +'api/customer/products',{
          headers: this.createAuthorizationHeader(),
        })
      }
       getAllProductsByName(name_prod:any):Observable<any>{
        return this.http.get(BASIC_URL +`api/customer/search/${name_prod}`,{
          headers: this.createAuthorizationHeader(),
        })
      }
      getProductById(productId:number): Observable<any> {
        return this.http.get(BASIC_URL + `api/customer/product/${productId}`, {
          headers: this.createAuthorizationHeader(),
        });
      }
      getCategoryById(categoryId:number): Observable<any> {
        return this.http.get(BASIC_URL + `api/customer/category/${categoryId}`, {
          headers: this.createAuthorizationHeader(),
        });
      }
getProductsByCategory(categoryId: number): Observable<any[]> {
  return this.http.get<any[]>(`${BASIC_URL}api/customer/categories/${categoryId}/products`, {
          headers: this.createAuthorizationHeader(),
        });

}
// Pour récupérer catégorie + produits en une seule requête
getCategoryWithProducts(categoryId: number): Observable<any> {
  return this.http.get<any>(`${BASIC_URL}api/customer/categories/${categoryId}/with-products`, {
          headers: this.createAuthorizationHeader(),
        });
}
      addToCart(productId:any): Observable<any>{
    const cartDto = {
        productId : productId,
        userId: UserStorageService.getUserId()
    }
    return this.http.post(BASIC_URL + `api/customer/cart`, cartDto , {
        headers: this.createAuthorizationHeader(),
    })
    }
          increaseProductQuantity(productId:any): Observable<any>{
    const cartDto = {
        productId : productId,
        userId: UserStorageService.getUserId()
    }
    return this.http.post(BASIC_URL + `api/customer/addition`, cartDto , {
        headers: this.createAuthorizationHeader(),
    })
    }
    decreaseProductQuantity(productId:any): Observable<any>{
    const cartDto = {
        productId : productId,
        userId: UserStorageService.getUserId()
    }
    return this.http.post(BASIC_URL + `api/customer/deduction`, cartDto , {
        headers: this.createAuthorizationHeader(),
    })
    }
    getCartByUserId(): Observable<any>{
      const userId = UserStorageService.getUserId()
      return this.http.get(BASIC_URL + `api/customer/cart/${userId}`, {
        headers: this.createAuthorizationHeader(),
      })
    }
      applyCoupon(code_cpn:any): Observable<any>{
      const userId = UserStorageService.getUserId()
      return this.http.get(BASIC_URL + `api/customer/coupon/${userId}/${code_cpn}`, {
        headers: this.createAuthorizationHeader(),
      })
    } 
         placeOrder(orderDto:any): Observable<any>{
      orderDto.userId = UserStorageService.getUserId()
      return this.http.post(BASIC_URL + `api/customer/placeOrder`, orderDto, {
        headers: this.createAuthorizationHeader(),
      })
    } 
    getProductsByCategoryName(categoryName: string): Observable<any> {
  return this.http.get(BASIC_URL + `api/customer/category/${categoryName}`, {
    headers: this.createAuthorizationHeader()
  });
}
   getAllCategories():Observable<any>{
      return this.http.get(BASIC_URL +'api/customer/categories',{
        headers: this.createAuthorizationHeader(),
      })
    }
    getOrdersByUserId(): Observable<any>{
      const userId = UserStorageService.getUserId()
      return this.http.get(BASIC_URL + `api/customer/myOrders/${userId}`, {
        headers: this.createAuthorizationHeader(),
      })
    }
        getPurchasedOrdersByUserId(): Observable<any>{
      const userId = UserStorageService.getUserId()
      return this.http.get(BASIC_URL + `api/customer/billing/${userId}`, {
        headers: this.createAuthorizationHeader(),
      })
    }
    getOrderedProducts(orderId: number): Observable<any>{
      return this.http.get(BASIC_URL + `api/customer/ordered-products/${orderId}`, {
        headers: this.createAuthorizationHeader(),
      })
    }
        getPurchasedOrderedProducts(orderId: number): Observable<any>{
      return this.http.get(BASIC_URL + `api/customer/purchased-orders/${orderId}`, {
        headers: this.createAuthorizationHeader(),
      })
    }
    downloadProductFile(productId: number,userId : number): Observable<Blob> {
      return this.http.get(BASIC_URL+`api/customer/product/${productId}/${userId}/download`, {
        headers: this.createAuthorizationHeader(),
        responseType: 'blob'
      });
    }
    removeProductFromCart(productId: any): Observable<any> {
  const addProductInCartDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  }
  return this.http.post(BASIC_URL + `api/customer/remove`, addProductInCartDto, {
    headers: this.createAuthorizationHeader(),
  });
}
    getProfile(userId: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/profile/${userId}`, {
      headers: this.createAuthorizationHeader()
    });
  }
  updateProfile(userId: number, profileDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/customer/profile/${userId}`, profileDto, {
      headers: this.createAuthorizationHeader(),
       observe: 'response'

    });
  }
  // customer.service.ts
Pay(paymentDto : any): Observable<any> {
  return this.http.post(`${BASIC_URL}api/customer/payment`, 
    paymentDto,
    { headers: this.createAuthorizationHeader() }
  );
}
  sendMessage(message: string): Observable<any> {
    return this.http.post(`${BASIC_URL}api/customer/chatbot/message`, 
      { message },
      { headers: this.createAuthorizationHeader() }
    );
  }
  getCustomerNotifications(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${BASIC_URL}api/customer/notifications/${userId}`, {
    headers: this.createAuthorizationHeader() // Si sécurisé par JWT
  });
}

markCustomerNotificationAsRead(id: number): Observable<any> {
  return this.http.put(`${BASIC_URL}api/customer/notifications/${id}/read`, {}, {
    headers: this.createAuthorizationHeader()
  });
}
      private createAuthorizationHeader():HttpHeaders{
          return new HttpHeaders().set(
            'Authorization','Bearer '+UserStorageService.getToken()
           )
      }
}
