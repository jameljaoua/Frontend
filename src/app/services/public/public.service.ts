import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const BASIC_URL= "http://localhost:8081/"

@Injectable({
  providedIn: 'root',
})
export class PublicService {
    constructor(private http:HttpClient){ }
  getAllCategories():Observable<any>{
        return this.http.get(BASIC_URL +'category/all')
      }
          getProductsByCategoryName(categoryName: string): Observable<any> {
        return this.http.get(BASIC_URL + `product/category/${categoryName}`);
      }
      getAllProducts():Observable<any>{
              return this.http.get(BASIC_URL +'product/all')
            }
    getAllProductsByName(name_prod:any):Observable<any>{
      return this.http.get(BASIC_URL +`product/search/${name_prod}`)
      }
          // Récupérer un produit spécifique pour charger le formulaire d'édition
      getProductById(productId:number): Observable<any> {
        return this.http.get(BASIC_URL + `product/${productId}`);
      }
            getCategoryById(categoryId:number): Observable<any> {
        return this.http.get(BASIC_URL + `category/${categoryId}`);
      }
      getProductsByCategory(categoryId: number): Observable<any[]> {
        return this.http.get<any[]>(`${BASIC_URL}product/categories/${categoryId}/products`);
      
      }
      // Pour récupérer catégorie + produits en une seule requête
      getCategoryWithProducts(categoryId: number): Observable<any> {
        return this.http.get<any>(`${BASIC_URL}category/${categoryId}/with-products`);
      }
      getSubCategoryById(subcategoryId:number): Observable<any> {
        return this.http.get(BASIC_URL + `subcategory/${subcategoryId}`);
      }
         getSubCategoriesByCategory(categoryId: number): Observable<any[]> {
          return this.http.get<any[]>(`${BASIC_URL}category/${categoryId}/subcategories`);
        
        }
        // Pour récupérer catégorie + sous-catégories en une seule requête
        getCategoryWithSubCategories(categoryId: number): Observable<any> {
          return this.http.get<any>(`${BASIC_URL}category/${categoryId}/with-subcategories`);
        }
       getAllSubCategories():Observable<any>{
          return this.http.get(BASIC_URL +'subcategory/all')
            }
              sendMessage(message: string): Observable<any> {
    return this.http.post(`${BASIC_URL}chatbot/message`, 
      { message },
    );
  }
}
