import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  isUserLoggedIn!: boolean;
  public apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  createFacility(body?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/facility/create-facility`, body);
  }

  getAllFacilityOwner(page: number, pageSize: number, name: string = ''): Observable<any> {
    let url = this.apiUrl + `/api/facility/get-all-facility-by-owner?page=${page}&pageSize=${pageSize}`;
    if (name && name.trim() !== '') {
      url += `&name=${name}`;
    }
    
    return this.http.get(url);
  }

  getAllFacility(page: number, pageSize: number, name: string = ''): Observable<any> {
    let url = this.apiUrl + `/api/facility/get-all-facility?page=${page}&pageSize=${pageSize}`;
    if (name && name.trim() !== '') {
      url += `&name=${name}`;
    }
    
    return this.http.get(url);
  }

  getFacilityById(id?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/facility/get-facility-by-id/` + id);
  }

  updateFacility(body?: any): Observable<any> {
    return this.http.put(this.apiUrl + `/api/facility/update-facility`, body);
  }

  deleteFacilityById(id?: any): Observable<any> {
    return this.http.delete(this.apiUrl + `/api/facility/delete-facility/` + id);
  }
}
