import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShareTableModule } from '../../../../shared/components/share-table/share-table.module';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PagiComponent } from '../../../../shared/components/pagi/pagi.component';
import { FacilityService } from '../../../../core/api/facility.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PopupDeleteComponent } from './popup-delete/popup-delete.component';

@Component({
  selector: 'app-list-price',
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
    PopupDeleteComponent
  ],
  templateUrl: './list-price.component.html',
  styleUrl: './list-price.component.scss'
})
export class ListPriceComponent implements OnInit {
  public isLoading: boolean = false;
  public totalCount: number = 10;
  public listFacility : any = [];
  public selectedFacilityId: number | null = null;
  searchTerms = new Subject<string>();
  searchText: string = '';
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
    private facilityService: FacilityService,
    private message: NzMessageService,
  ){}
  
  ngOnInit(): void {
    this.setupSearch();
    this.viewListFacility();
  }

  setupSearch(): void {
    this.searchTerms.pipe(
      // Đợi 300ms sau mỗi lần gõ để tránh request quá nhiều
      debounceTime(300),
      // Đảm bảo request chỉ gửi khi giá trị thay đổi
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchText = term;
      this.params.page = 1; 
      this.viewListFacility();
    });
  }

  onSearch(event: any): void {
    const term = event.target.value;
    this.searchTerms.next(term);
  }

  viewListFacility() {
    this.isLoading = true;
    this.facilityService.getAllFacilityOwner(this.params.page, this.params.pageSize, this.searchText)
      .subscribe(res => {
        this.isLoading = false;
        this.listFacility = res.data;
        this.totalCount = res.data.length;
      });
  }

  changePage(e: number) {
    this.params.page = e;
    this.viewListFacility();
  }
  
  changePageSize(e: number) {
    this.params.pageSize = e;
    this.viewListFacility();
  }

  viewDetail(id?: any) {
    this.router.navigate([`/facility/edit/${id}`]);
  }

  toggleMenu(id: number) {
    this.selectedFacilityId = this.selectedFacilityId === id ? null : id;
  }

  openDeletePopup(item?: any) {
    this.item = item;
    this.isVisible = true;
  }
  
  isVisible: boolean = false;
  handleChangeVisible(data: any) {
    this.isVisible = data.visible;
    if (data.isSuccess == true) {
      // this.viewListFacility();
    }
  }
}
