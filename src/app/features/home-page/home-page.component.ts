import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';

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
  listType: any = [
    { value: '1', label: 'Type 1' },
    { value: '2', label: 'Type 2' },
    { value: '3', label: 'Type 3' },
  ];
  listSanBong: any = [
    { 
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 1',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 2',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 3',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 4',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 5',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 6',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 7',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
  ];
  constructor(
    private fb: FormBuilder,
  ) {}

  public form: FormGroup = this.fb.group({
    type: [null],
    time: [null],
    address: [null],
  });

  search(): void {
    console.log(this.form.value);
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
