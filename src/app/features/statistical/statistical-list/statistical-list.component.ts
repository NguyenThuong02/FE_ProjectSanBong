import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartColumnsComponent } from '../chart-columns/chart-columns.component';
import { ChartCircleComponent } from '../chart-circle/chart-circle.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { RouterModule } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-statistical-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ChartColumnsComponent,
    ChartCircleComponent,
    NzSpinModule
  ],
  templateUrl: './statistical-list.component.html',
  styleUrl: './statistical-list.component.scss'
})
export class StatisticalListComponent implements OnInit {
  public chartType: any = 'columns'
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

  }

  handleChangeChart(name: string) {
    this.chartType = name;
  }
}
