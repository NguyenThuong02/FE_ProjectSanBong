import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PopupDeleteComponent } from './popup-delete/popup-delete.component';
import { ShareTableModule } from '../../../../shared/components/share-table/share-table.module';
import { PagiComponent } from '../../../../shared/components/pagi/pagi.component';
import { ConcertService } from '../../../../core/api/concert.service';

@Component({
  selector: 'app-concert-by-owner-list',
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
  templateUrl: './concert-by-owner-list.component.html',
  styleUrl: './concert-by-owner-list.component.scss'
})
export class ConcertByOwnerListComponent implements OnInit{
  public isLoading: boolean = false;
  public totalCount: number = 10;
  public listConcert : any = [];
  public selectedConcertId: number | null = null;
  searchTerms = new Subject<string>();
  searchText: string = '';
  eventItem: any;
  maxheight: string = '';
  public params = {
    page: 1,
    pageSize: 10
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private concertService: ConcertService,
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
    this.concertService.getAllEventOwner(this.params.page, this.params.pageSize, this.searchText)
      .subscribe(res => {
        this.isLoading = false;
        this.listConcert = res.data;
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
    this.router.navigate([`/concert-by-owner/edit/${id}`]);
  }

  toggleMenu(id: number) {
    this.selectedConcertId = this.selectedConcertId === id ? null : id;
  }

  openDeletePopup(item?: any) {
    this.eventItem = item;
    this.isVisible = true;
  }
  
  isVisible: boolean = false;
  handleChangeVisible(data: any) {
    this.isVisible = data.visible;
    if (data.isSuccess == true) {
      this.viewListFacility();
    }
  }
}
