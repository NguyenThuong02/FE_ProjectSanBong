import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConcertService {
  isUserLoggedIn!: boolean;
  public apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  createEvent(body?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/event/create-event`, body);
  }

  updateEvent(body?: any): Observable<any> {
    return this.http.put(this.apiUrl + `/api/event/update-event`, body);
  }
  
  getAllEventOwner(page: number, pageSize: number, name: string = ''): Observable<any> {
    let url = this.apiUrl + `/api/event/get-event-by-owner?page=${page}&pageSize=${pageSize}`;
    if (name && name.trim() !== '') {
      url += `&name=${name}`;
    }
    
    return this.http.get(url);
  }
  
  getAllEvent(page: number, pageSize: number, name: string = ''): Observable<any> {
    let url = this.apiUrl + `/api/event/get-all-event?page=${page}&pageSize=${pageSize}`;
    if (name && name.trim() !== '') {
      url += `&name=${name}`;
    }
    
    return this.http.get(url);
  }
  
  getEventById(id?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/event/get-event-by-id/` + id);
  }

  deleteEvent(id?: any): Observable<any> {
    return this.http.delete(this.apiUrl + `/api/event/delete-event/` + id);
  }
}
