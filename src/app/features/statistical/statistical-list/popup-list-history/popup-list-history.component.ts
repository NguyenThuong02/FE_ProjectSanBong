import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';

interface OrderHistory {
  id: string;
  fieldName: string;
  orderDate: Date;
  status: string;
  totalAmount: number;
}

@Component({
  selector: 'app-popup-list-history',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzModalComponent,
    NzModalModule,
    NzIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInput,
    ReactiveFormsModule,
    NzSpinModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule
  ],
  templateUrl: './popup-list-history.component.html',
  styleUrl: './popup-list-history.component.scss'
})
export class PopupListHistoryComponent implements OnInit {
  @Input() isVisible!: boolean;
  @Input() listHistory: any;
  @Output() changeVisibleHistory = new EventEmitter<boolean>();

  constructor(
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {

  }


  handleOk(): void {
    this.changeVisibleHistory.emit(false);
  }

  handleCancel(): void {
    this.changeVisibleHistory.emit(false);
  }
}
