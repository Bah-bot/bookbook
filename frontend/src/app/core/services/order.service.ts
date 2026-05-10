import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../shared/models/cart.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  checkout(): Observable<any> {
    const userId = this.authService.currentUser?.id;
    return this.http.post(`${this.apiUrl}/orders/checkout`, { userId });
  }

  getOrderHistory(): Observable<Order[]> {
    const userId = this.authService.currentUser?.id;
    return this.http.get<Order[]>(`${this.apiUrl}/orders/user/${userId}`);
  }
}