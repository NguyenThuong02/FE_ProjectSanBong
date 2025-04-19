import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShareTableModule } from '../../../../shared/components/share-table/share-table.module';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PagiComponent } from '../../../../shared/components/pagi/pagi.component';

@Component({
  selector: 'app-list-banner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    ShareTableModule,
    RouterModule,
    NzIconModule,
    NzSpinModule,
    TranslateModule,
    PagiComponent,

  ],
  templateUrl: './list-banner.component.html',
  styleUrl: './list-banner.component.scss'
})
export class ListBannerComponent implements OnInit{
  public isLoading: boolean = false;
  public totalCount: number = 10;
  public listPrice : any = [];
  public selectedBannerId: number | null = null;
  item: any;
  maxheight: string = '';
  public params = {
    page: 1,
    pageSize: 10
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ){}
  
  ngOnInit(): void {
    this.viewListBanner();
  }


  viewListBanner() {
    this.isLoading = true;

  }

  changePage(e: number) {
    this.params.page = e;
    this.viewListBanner();
  }
  
  changePageSize(e: number) {
    this.params.pageSize = e;
    this.viewListBanner();
  }

  viewDetail(id?: any) {
    this.router.navigate([`/banner/detail/${id}`]);
  }

  toggleMenu(id: number) {
    this.selectedBannerId = this.selectedBannerId === id ? null : id;
  }
}
