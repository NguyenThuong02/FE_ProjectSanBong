import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { ConcertService } from '../../../core/api/concert.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-concert-by-owner-add',
  standalone: true,
  imports: [
    FormsModule,
    MatInput,
    MatInputModule,
    CommonModule,
    RouterModule,
    NzModalModule,
    NzIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    TranslateModule,
    NzButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './concert-by-owner-add.component.html',
  styleUrl: './concert-by-owner-add.component.scss'
})
export class ConcertByOwnerAddComponent implements OnInit{
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
      private message: NzMessageService,
      private cdr: ChangeDetectorRef,
      private concertService: ConcertService,
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
    startDate: [null, Validators.required],
    startTime: ['00:00', Validators.required],
    endDate: [null, Validators.required],
    endTime: ['00:00', Validators.required],
    description: [null],
    imageUrl: [null],
    imageName: [null]
  });

  getViewInfo(): void {
    if (!this.idFacility) return;
    
    this.concertService.getEventById(this.idFacility).subscribe({
      next: (res) => {
        // Parse the time string if it exists
        if (res.data.time) {
          const timeParts = this.parseTimeString(res.data.time);
          
          this.form.patchValue({
            name: res.data.name,
            type: res.data.facilityType,
            address: res.data.address,
            startDate: timeParts.startDate,
            startTime: timeParts.startTime,
            endDate: timeParts.endDate,
            endTime: timeParts.endTime,
            description: res.data.description,
            imageUrl: res.data.image
          });
        } else {
          this.form.patchValue({
            name: res.data.name,
            type: res.data.facilityType,
            address: res.data.address,
            description: res.data.description,
            imageUrl: res.data.image
          });
        }
        
        if (res.data.image) {
          this.imagePreview = res.data.image;
        }
      },
      error: (err) => {
        this.message.error('Không thể lấy thông tin sự kiện!');
      }
    });
  }

  // Parse time string in format "HH:mm yyyy-MM-dd to HH:mm yyyy-MM-dd"
  parseTimeString(timeString: string): any {
    try {
      const parts = timeString.split(' to ');
      
      if (parts.length === 2) {
        const startParts = parts[0].split(' ');
        const endParts = parts[1].split(' ');
        
        if (startParts.length === 2 && endParts.length === 2) {
          const startTime = startParts[0];
          const startDate = new Date(startParts[1]);
          
          const endTime = endParts[0];
          const endDate = new Date(endParts[1]);
          
          return {
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime
          };
        }
      }
      
      // Return default values if parsing fails
      return {
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null
      };
    } catch (error) {
      console.error('Error parsing time string:', error);
      return {
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null
      };
    }
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
            console.log("OK: ", this.form.get('imageUrl')?.value);
            this.message.success('Tải ảnh lên thành công!');
          }
        }
      },
      error: (err) => {
        this.message.error('Tải ảnh lên thất bại!');
        this.uploadProgress = 0;
        this.cdr.detectChanges();
      }
    });
  }

  // Format the datetime values for the API
  formatDateTimeValues(): { startTime: string, endTime: string } {
    try {
      const startDate = this.form.get('startDate')?.value;
      const startTime = this.form.get('startTime')?.value;
      const endDate = this.form.get('endDate')?.value;
      const endTime = this.form.get('endTime')?.value;
      
      if (!startDate || !startTime || !endDate || !endTime) {
        return { startTime: '', endTime: '' };
      }
      
      // Format dates to yyyy-MM-dd
      const formattedStartDate = formatDate(startDate, 'dd-MM-yyyy', 'en-US');
      const formattedEndDate = formatDate(endDate, 'dd-MM-yyyy', 'en-US');
      
      // Combine dates and times
      const formattedStartTime = `${startTime} ${formattedStartDate}`;
      const formattedEndTime = `${endTime} ${formattedEndDate}`;
      
      return {
        startTime: formattedStartTime,
        endTime: formattedEndTime
      };
    } catch (error) {
      console.error('Error formatting date time values:', error);
      return { startTime: '', endTime: '' };
    }
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
      this.message.warning('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    
    // Format date and time fields
    const { startTime, endTime } = this.formatDateTimeValues();
        
    if(!this.isEdit) {
      const body = {
        name: this.form.get('name')?.value,
        address: this.form.get('address')?.value,
        description: this.form.get('description')?.value,
        facilityType: this.form.get('type')?.value,
        startTime: startTime,
        endTime: endTime,
        image: this.form.get('imageUrl')?.value,
        status: 1
      };
      // this.concertService.createEvent(body).subscribe({
      //   next: (res) => {
      //     this.message.success('Tạo sự kiện mới thành công');
      //     this.cdr.detectChanges();
      //     this.router.navigate(['/facility/list']);
      //   },
      //   error: (err) => {
      //     this.message.error('Tạo sự kiện mới thất bại!');
      //   }
      // });
      console.log("ROOOCC: ", body);
    } else {
      const body = {
        id: this.idFacility,
        ownerId: this.idOwner,
        name: this.form.get('name')?.value,
        address: this.form.get('address')?.value,
        description: this.form.get('description')?.value,
        facilityType: this.form.get('type')?.value,
        startTime: startTime,
        endTime: endTime,
        image: this.form.get('imageUrl')?.value,
        status: 1
      };
      // this.concertService.updateEvent(body).subscribe({
      //   next: (res) => {
      //     this.message.success('Cập nhật sự kiện thành công');
      //     this.cdr.detectChanges();
      //     this.router.navigate(['/facility/list']);
      //   },
      //   error: (err) => {
      //     this.message.error('Cập nhật sự kiện thất bại!');
      //   }
      // });
    }
  }
}