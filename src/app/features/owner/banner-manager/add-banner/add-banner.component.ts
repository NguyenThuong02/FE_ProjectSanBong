import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FacilityService } from '../../../../core/api/facility.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-add-banner',
  standalone: true,
  imports: [
    FormsModule,
    MatInput,
    CommonModule,
    RouterModule,
    NzModalModule,
    NzIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    TranslateModule,
    NzButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-banner.component.html',
  styleUrl: './add-banner.component.scss'
})
export class AddBannerComponent implements OnInit{
  @ViewChild('fileInput') fileInput!: ElementRef;
  idOwner: any;
  isEdit: boolean = false;
  idBanner: any;
  uploadProgress: number = 0;
  bannerImages: { url: string, preview: string, name: string }[] = [];
  currentUploadingFile: string | null = null;
  
  
  constructor(
      private fb: FormBuilder,
      private notification: NzNotificationService,
      private cdr: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router,
      private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    this.idBanner = this.route.snapshot.paramMap.get('id');
    this.idOwner = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.sub;
    if(this.idBanner) {
      this.getViewInfo();
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
  }
  
  public form: FormGroup = this.fb.group({
    name: [null, Validators.required],
    description: [null],
    bannerUrls: [[]] 
  });

  getViewInfo(): void {
    if (!this.idBanner) return;
    
  }

  extractFileNameFromUrl(url: string): string {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Process each selected file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.currentUploadingFile = file.name;

        const reader = new FileReader();
        reader.onload = (e: any) => {
          const preview = e.target.result;
          this.uploadFile(file, preview);
        };
        reader.readAsDataURL(file);
      }
    }
    this.fileInput.nativeElement.value = '';
  }

  uploadFile(file: File, preview: string): void {
    const formData = new FormData();
    formData.append('file', file);
    
    this.http.post('https://cdn-test.eztek.net/gateway/Media/Upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
          this.cdr.detectChanges();
        } else if (event.type === HttpEventType.Response) {
          const response = event.body as any;
          if (response && Array.isArray(response) && response.length > 0) {
            this.addImageToList(response[0], preview, file.name);
            
            this.notification.create(
              'success',
              'Thành công!',
              'Tải ảnh lên thành công!'
            );
            this.uploadProgress = 0;
            this.currentUploadingFile = null;
          }
        }
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Tải ảnh lên thất bại!'
        );
        this.uploadProgress = 0;
        this.currentUploadingFile = null;
        this.cdr.detectChanges();
      }
    });
  }

  addImageToList(url: string, preview: string, name: string = ''): void {
    if (!name) {
      name = this.extractFileNameFromUrl(url);
    }

    this.bannerImages.push({
      url: url,
      preview: preview,
      name: name
    });

    const urls = this.bannerImages.map(img => img.url);
    this.form.patchValue({
      bannerUrls: urls
    });
    
    this.cdr.detectChanges();
  }

  removeImage(index: number): void {
    this.bannerImages.splice(index, 1);
    const urls = this.bannerImages.map(img => img.url);
    this.form.patchValue({
      bannerUrls: urls
    });
    this.cdr.detectChanges();
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.markAsDirty();
          control.markAsTouched();
        }
      });
      this.notification.create(
        'warning',
        'Lỗi!',
        'Vui lòng nhập đầy đủ thông tin bắt buộc!'
      );
      return;
    }
    if (this.bannerImages.length === 0) {
      this.notification.create(
        'warning',
        'Lỗi!',
        'Vui lòng tải lên ít nhất một ảnh banner!'
      );
      return;
    }
        
    const body = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      imageUrl: this.form.get('bannerUrls')?.value
    };

    console.log("Body: ", body);
  }

  onEditorContentChanged(content: string): void {
    this.form.patchValue({
      description: content
    });
  }
}
