import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  isUserLoggedIn!: boolean;
  public apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  register(body: any): Observable<any> {
    return this.http.post(this.apiUrl + '/api/auth/register', body);
  }

  getViewInfo(): Observable<any> {
    return this.http.get(this.apiUrl + `/api/user/UserInfo`);
  }

  updateInfo(body: any): Observable<any> {
    return this.http.patch(this.apiUrl + '/api/user/update-user', body)
  }

  forgotPassword(body: any): Observable<any> {
    return this.http.post(this.apiUrl + '/reset-password', body);
  }

  checkEmail(body: any): Observable<any> {
    return this.http.post(this.apiUrl + '/send-otp', body);
  }

  checkOTP(body: any): Observable<any> {
    return this.http.post(this.apiUrl + '/verify-otp', body);
  }

  disableAccount(id?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/user/disable-account/${id}`, {});
  }

  activeAccount(id?: any): Observable<any> {
    return this.http.put(this.apiUrl + `/api/user/active-account/${id}`, {});
  }

  changePassword(body: any): Observable<any> {
    return this.http.put(this.apiUrl + '/api/user/change-password', body);
  }

  checkPassword(body: any): Observable<any> {
    return this.http.post(this.apiUrl + '/api/user/check-password', body);
  }
}
