import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart } from '../../shared/models/cart.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {

  private apiUrl = 'http://localhost:8080/api';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCart(): Observable<Cart> {
    const userId = this.authService.currentUser?.id;
    return this.http.get<Cart>(`${this.apiUrl}/cart/user/${userId}`).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    const userId = this.authService.currentUser?.id;
    return this.http.post<any>(`${this.apiUrl}/cart/user/${userId}/add`, {
      productId, quantity
    }).pipe(tap(res => this.cartSubject.next(res.data)));
  }

  updateQuantity(itemId: number, quantity: number): Observable<any> {
    const userId = this.authService.currentUser?.id;
    return this.http.put<any>(`${this.apiUrl}/cart/user/${userId}/items/${itemId}`, {
      quantity
    }).pipe(tap(res => this.cartSubject.next(res.data)));
  }

  removeItem(itemId: number): Observable<any> {
    const userId = this.authService.currentUser?.id;
    return this.http.delete<any>(`${this.apiUrl}/cart/user/${userId}/items/${itemId}`)
      .pipe(tap(res => this.cartSubject.next(res.data)));
  }

  get itemCount(): number {
    return this.cartSubject.value?.itemCount || 0;
  }
}