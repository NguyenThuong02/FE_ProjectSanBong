import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FacilityService } from '../../core/api/facility.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    NzSelectModule,
    ReactiveFormsModule,
    RouterOutlet
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  @ViewChild('scroller') scroller!: ElementRef;
  isLoading: boolean = false;
  listType: any = [
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
  listSanBong: any = [];
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private facilityService: FacilityService,
    private message: NzMessageService,
  ) {}

  public form: FormGroup = this.fb.group({
    type: [null],
    time: [null],
    address: [null],
  });

  search(): void {
    console.log(this.form.value);
  }

  viewListFacilityGeneral() {
    this.isLoading = true;
    this.facilityService.getAllFacility(1, 999).subscribe(res => {
      this.isLoading = false;
      this.listSanBong = res.data;
    })
  }

  scrollLeft() {
    if (this.scroller?.nativeElement) {
      this.scroller.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }
  
  scrollRight() {
    if (this.scroller?.nativeElement) {
      this.scroller.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
  
}
