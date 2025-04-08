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
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FacilityService } from '../../../../core/api/facility.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TextEditorComponent } from '../../../../shared/components/text-editor/text-editor.component';

@Component({
  selector: 'app-add-facility',
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
    TextEditorComponent, // Add the TextEditorComponent to imports
  ],
  templateUrl: './add-facility.component.html',
  styleUrl: './add-facility.component.scss'
})
export class AddFacilityComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  idOwner: any;
  isEdit: boolean = false;
  idFacility: any;
  imagePreview: string | null = null;
  uploadProgress: number = 0;
  selectedFileName: string = '';
  
  public listType: any = [
    {
      value: 'Football',
      label: 'Football',
    },
    {
      value: 'Pickerball',
      label: 'Pickerball',
    },
    {
      value: 'Tenis',
      label: 'Tenis',
    },
    {
      value: 'Bóng rổ',
      label: 'Bóng rổ',
    },
    {
      value: 'Cầu lông',
      label: 'Cầu lông',
    },
  ];
  
  constructor(
      private fb: FormBuilder,
      private notification: NzNotificationService,
      private cdr: ChangeDetectorRef,
      private facilityService: FacilityService,
      private route: ActivatedRoute,
      private router: Router,
      private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    this.idFacility = this.route.snapshot.paramMap.get('id');
    this.idOwner = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.sub;
    if(this.idFacility) {
      this.getViewInfo();
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
  }
  
  public form: FormGroup = this.fb.group({
    name: [null, Validators.required],
    type: ['Football', Validators.required],
    address: [null, Validators.required],
    description: [null],
    imageUrl: [null],
    imageName: [null]
  });

  getViewInfo(): void {
    if (!this.idFacility) return;
    
    this.facilityService.getFacilityById(this.idFacility).subscribe({
      next: (res) => {
        this.form.patchValue({
          name: res.name,
          type: res.facilityType,
          address: res.address,
          description: res.description,
          imageUrl: res.imageUrl
        });
        
        if (res.imageUrl) {
          this.imagePreview = res.imageUrl;
          // this.selectedFileName = res.data.imageName || this.extractFileNameFromUrl(res.data.imageUrl);
        }
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Không thể lấy thông tin sân!'
        );
      }
    });
  }

  extractFileNameFromUrl(url: string): string {
    if (!url) return '';
    // Lấy phần cuối của URL sau dấu '/'
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.form.patchValue({
        imageName: file.name
      });
      
      // Hiển thị preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
      
      // Upload file
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
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
            this.form.patchValue({
              imageUrl: response[0]
            });
            this.notification.create(
              'success',
              'Thành công!',
              'Tải ảnh lên thành công!'
            );
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
        this.cdr.detectChanges();
      }
    });
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
        
    if(!this.isEdit) {
      const body = {
        name: this.form.get('name')?.value,
        address: this.form.get('address')?.value,
        description: this.form.get('description')?.value,
        facilityType: this.form.get('type')?.value,
        imageUrl: this.form.get('imageUrl')?.value,
        status: 1
      };
      this.facilityService.createFacility(body).subscribe({
        next: (res) => {
          this.notification.create(
            'success',
            'Thành công!',
            'Tạo sân mới thành công!'
          );
          this.cdr.detectChanges();
          this.router.navigate(['/facility/list']);
        },
        error: (err) => {
          this.notification.create(
            'error',
            'Thất bại!',
            'Tạo sân mới thất bại!'
          );
        }
      });
    } else {
      const body = {
        id: this.idFacility,
        name: this.form.get('name')?.value,
        address: this.form.get('address')?.value,
        description: this.form.get('description')?.value,
        facilityType: this.form.get('type')?.value,
        imageUrl: this.form.get('imageUrl')?.value,
        status: 1
      };
      this.facilityService.updateFacility(body).subscribe({
        next: (res) => {
          this.notification.create(
            'success',
            'Thành công!',
            'Cập nhật sân thành công!'
          );
          this.cdr.detectChanges();
          this.router.navigate(['/facility/list']);
        },
        error: (err) => {
          this.notification.create(
            'error',
            'Thất bại!',
            'Cập nhật sân thất bại!'
          );
        }
      });
    }
  }

  // Add this method to handle content changes from the editor
  onEditorContentChanged(content: string): void {
    this.form.patchValue({
      description: content
    });
  }
}