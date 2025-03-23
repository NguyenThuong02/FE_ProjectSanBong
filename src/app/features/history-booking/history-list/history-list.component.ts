import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HistoryRateComponent } from '../history-rate/history-rate.component';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzPaginationModule,
    HistoryRateComponent
  ],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.scss'
})
export class HistoryListComponent implements OnInit{
  selectedConcertId: any; 
  isVisibleRate: boolean = false;
  item: any;
  pageSize = 5; 
  currentPage = 1;
  isLoading: boolean = false;
  totalItems: number = 0;
  listHistory: any[] = [
    {
      id: 1,
      name: 'Sân Đầm Hồng 1',
      image: 'assets/img/evenBongDa.png',
      status: 0
    },
    {
      id: 2,
      name: 'Sân Ao Sen',
      image: 'assets/img/evenBongDa.png',
      status: 1
    },
    {
      id: 3,
      name: 'Sân Long Thành',
      image: 'assets/img/evenBongDa.png',
      status: 1
    },
    {
      id: 4,
      name: 'Sân Sài Gòn',
      image: 'assets/img/evenBongDa.png',
      status: 0
    },
  ];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private message: NzMessageService
  ) {}
  
  ngOnInit(): void {

  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  loadAllHistory() {

  }

  openPopupRate(item: any) {
    this.item = item;
    this.isVisibleRate = true;
  }

  handleChangeVisibleRate(data: any) {
    this.isVisibleRate = data.visible;
  }
}
