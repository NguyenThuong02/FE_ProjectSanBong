import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartColumnsComponent } from '../chart-columns/chart-columns.component';
import { ChartCircleComponent } from '../chart-circle/chart-circle.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PopupListHistoryComponent } from './popup-list-history/popup-list-history.component';

@Component({
  selector: 'app-statistical-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ChartColumnsComponent,
    ChartCircleComponent,
    NzSpinModule,
    PopupListHistoryComponent
  ],
  templateUrl: './statistical-list.component.html',
  styleUrl: './statistical-list.component.scss'
})
export class StatisticalListComponent implements OnInit {
  public chartType: any = 'columns'
  public listHistory: any = [
    {
      bookingId: '1',
      facilityName: 'Sân bóng Đầm Hồng',
      bookingDate: '2025-10-12',
      startTime: '12:00',
      endTime: '13:30',
      price: 230000,
    },
    {
      bookingId: '2',
      facilityName: 'Sân bóng Thiên Trường',
      bookingDate: '2025-02-12',
      startTime: '08:00',
      endTime: '09:30',
      price: 240000,
    },
    {
      bookingId: '3',
      facilityName: 'Sân PickerBall',
      bookingDate: '2025-03-23',
      startTime: '12:00',
      endTime: '13:30',
      price: 225000,
    },
    {
      bookingId: '4',
      facilityName: 'Sân Thiên Trường',
      bookingDate: '2025-04-13',
      startTime: '11:00',
      endTime: '12:30',
      price: 121000,
    },
    {
      bookingId: '5',
      facilityName: 'Sân cầu lông Đầm Hồng',
      bookingDate: '2025-05-04',
      startTime: '06:00',
      endTime: '07:30',
      price: 700000,
    },
  ];
  public listData: any = [
    {
      name: 'Sân bóng Đầm Hồng',
      total: 10,
    },
    {
      name: 'Sân cầu lông Thiên Long',
      total: 24,
    },
    {
      name: 'Sân PickerBall Văn Quán',
      total: 4,
    },
    {
      name: 'Tennis Hoà Bình',
      total: 12,
    },
    {
      name: 'Sân bóng Mỹ Tho',
      total: 8,
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private notification: NzNotificationService,
  ){}

  ngOnInit(): void {
    setTimeout(() => {
      this.isHistoryVisible = true;
    }, 500);
  }

  handleChangeChart(name: string) {
    this.chartType = name;
  }

  isHistoryVisible = false;
    
  handleHistoryVisibilityChange(visible: boolean): void {
    this.isHistoryVisible = visible;
  }

  openPopupHistory() {
    this.isHistoryVisible = true;
  }
}
