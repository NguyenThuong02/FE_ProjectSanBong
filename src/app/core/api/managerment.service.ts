import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagermentService {
  isUserLoggedIn!: boolean;
  public apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }


  getAllManagement(page: number, pageSize: number): Observable<any> {
    return this.http.get(this.apiUrl + `/api/user/get-all-users?page=${page}&pageSize=${pageSize}`);
  }

  updateUsers(body?: any): Observable<any> {
    return this.http.patch(this.apiUrl + `/api/user/update-user`, body);
  }

  changeRole(id: any, role?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/user/update-account/${id}?role=${role}`, {});
  }

  disableAccount(id?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/user/disable-account/${id}`, {});
  }

  activeAccount(id?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api-user/active-account/${id}`, {});
  }

  getUserById(id?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/user/get-user-by-id/${id}`);
  }

  uploadImage(formData: FormData): Observable<{ filename: string }> {
    return this.http.post<{ filename: string }>('https://be.youth.com.vn/api/upload/UploadImage', formData);
  }  
}
