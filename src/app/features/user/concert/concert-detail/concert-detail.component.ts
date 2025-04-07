import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ConcertService } from '../../../../core/api/concert.service';

@Component({
  selector: 'app-concert-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './concert-detail.component.html',
  styleUrl: './concert-detail.component.scss'
})
export class ConcertDetailComponent implements OnInit{
  idEvent: any;
  selectedEvent: any;

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
    private concertService: ConcertService,
  ){}

  ngOnInit(): void {
    this.idEvent = this.route.snapshot.paramMap.get('id');
    this.getViewInfo();
  }

  getViewInfo(): void {
    if (!this.idEvent) return;

    this.concertService.getEventById(this.idEvent).subscribe({
      next: (res) => {
        this.selectedEvent = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message.error('Không thể lấy thông tin sân!');
      }
    });
  }
}
