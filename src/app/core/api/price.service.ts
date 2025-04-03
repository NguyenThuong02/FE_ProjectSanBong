import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  isUserLoggedIn!: boolean;
  public apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  createPrice(body?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/facility-price/create-price`, body);
  }

  getAllPrice(page: number, pageSize: number, name: string = ''): Observable<any> {
    let url = this.apiUrl + `/api/facility-price/list-price?pageNumber=${page}&pageSize=${pageSize}`;
    if (name && name.trim() !== '') {
      url += `&title=${name}`;
    }
    
    return this.http.get(url);
  }
  
  getPriceById(id?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/facility-price/get-price-by-id/` + id);
  }

  deletePrice(id?: any): Observable<any> {
    return this.http.delete(this.apiUrl + `/api/facility-price/` + id);
  }
}
