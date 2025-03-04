import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-my-info-view',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './my-info-view.component.html',
  styleUrl: './my-info-view.component.scss'
})
export class MyInfoViewComponent implements OnInit {

  info: any = {
    img: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-1.jpg',
    fullName: 'Nguyễn Thanh Thưởng',
    email: 'nguyenthanhthuong02@gmail.com'
  }

  constructor(

  ) {

     
  }
  ngOnInit(): void {

  }
}
