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

  getSlotDetail(id?: any, date?: any, startTime?: any, endTime?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/booking/calendar/slot-detail
      ?slotId=${id}
      &date=${date}
      &startTime=${startTime}
      &endTime=${endTime}
      `);
  }

  getAllManagement(page: number, pageSize: number): Observable<any> {
    return this.http.get(this.apiUrl + `/api/user/get-all-users?page=${page}&pageSize=${pageSize}`);
  }
}
