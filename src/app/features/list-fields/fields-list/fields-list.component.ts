import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-fields-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzPaginationModule,
  ],
  templateUrl: './fields-list.component.html',
  styleUrl: './fields-list.component.scss'
})
export class FieldsListComponent {
  nameFeildCheck: any = 'Sân thể thao';
  selectedFieldId: any; 
  pageSize = 6; 
  currentPage = 1;
  pagedListSanBong: any[] = [];
  listFeilds: any = [
    {
      id: 0,
      count: 5,
      name: 'Sân Bóng đá',
    },
    {
      id: 1,
      count: 3,
      name: 'Sân PickerBall',
    },
    {
      id: 2,
      count: 6,
      name: 'Sân cầu lông',
    },
    {
      id: 3,
      count: 9,
      name: 'Sân tenis',
    },
  ];

  listSanBong: any = [
    { 
      id: 0,
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 1',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      id: 1,
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 2',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      id: 2,
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 3',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      id: 3,
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 4',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      id: 4,
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 5',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      id: 5,
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 6',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
    { 
      id: 6,
      img: 'https://www.sporta.vn/assets/default_venue_0-dc1f6687f619915230b62712508933a71a6e9529c390237b9766acc0d59539ab.webp', 
      name: 'Sân Bóng 7',
      address: '123 ABC',
      type: 'Type 1',
      time: '18:00 - 20:00, 12/03/2025', 
    },
  ];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private message: NzMessageService,
  ) {}

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagedList();
  }

  updatePagedList() {
 
  }

  checkFeild(item: any) {
    this.nameFeildCheck = item.name;
    this.selectedFieldId = item.id;
  }

  viewDetail(id: any) {
    this.router.navigate([`/list-feilds/detail/${id}`]);
  }
}
