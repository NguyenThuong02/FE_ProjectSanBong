import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {
  isUserLoggedIn!: boolean;
  public apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getAllTemplates(): Observable<any> {
    return this.http.get(this.apiUrl + `/api/email-templates`);
  }

  createTemplate(body?: any): Observable<any> {
    return this.http.post(this.apiUrl + `/api/email-templates`, body);
  }
  
  getTemplateById(id?: any): Observable<any> {
    return this.http.get(this.apiUrl + `/api/email-templates/` + id);
  }

  updatedTemplate(body?: any): Observable<any> {
    return this.http.put(this.apiUrl + `/api/email-templates`, body);
  }

  deleteTemplate(id?: any): Observable<any> {
    return this.http.delete(this.apiUrl + `/api/email-templates/` + id);
  }
}
