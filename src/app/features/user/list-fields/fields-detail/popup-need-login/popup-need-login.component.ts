import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-popup-need-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzModalComponent,
    NzModalModule,
    NzIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './popup-need-login.component.html',
  styleUrl: './popup-need-login.component.scss'
})
export class PopupNeedLoginComponent {
  @Input() isVisible!: boolean;
  @Output() changeVisibleDelete = new EventEmitter<any>();
  
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  handleOk(): void {
    this.router.navigate(['/login']);
  }

  handleCancel(): void {
    this.changeVisibleDelete.emit(false);
  }
}
