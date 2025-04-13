import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  isUserLoggedIn!: boolean;
  public apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }
  
  getCalendarId(id?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/booking/calendar/` + id);
  }

  getCalendarIdByCustomer(id?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/booking/calendar/guest?facilityId=${id}`);
  }

  getCalendarIdByCustomerLogin(id?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/booking/calendar/customer/` + id);
  }

  getSlotDetail(id?: any, date?: any, startTime?: any, endTime?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/booking/calendar/slot-detail?slotId=${encodeURIComponent(id)}&date=${encodeURIComponent(date)}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`);
  }

  createBooking(body?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/booking/create`, body);
  }

  updatedBooking(body?: any): Observable<any> {
    return this.http.put(this.apiUrl + `/api/booking/calendar/update-slot-detail`, body);
  }

  getAllManagement(page: number, pageSize: number): Observable<any> {
    return this.http.get(this.apiUrl + `/api/user/get-all-users?page=${page}&pageSize=${pageSize}`);
  }
}
