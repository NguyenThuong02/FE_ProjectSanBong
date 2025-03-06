import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShareTableModule } from '../../../shared/components/share-table/share-table.module';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ManagermentService } from '../../../core/api/managerment.service';
import { AccountService } from '../../../core/api/account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PagiComponent } from '../../../shared/components/pagi/pagi.component';
import { FacilityService } from '../../../core/api/facility.service';

@Component({
  selector: 'app-list-facility',
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
    PagiComponent
  ],
  templateUrl: './list-facility.component.html',
  styleUrl: './list-facility.component.scss'
})
export class ListFacilityComponent implements OnInit{
  public isLoading: boolean = false;
  public totalCount: number = 10;
  public listFacility : any = [];
  public selectedFacilityId: number | null = null;
  maxheight: string = '';
  public params = {
    page: 1,
    pageSize:10
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private facilityService: FacilityService,
    private message: NzMessageService,
  ){}
  
  ngOnInit(): void {
    this.viewListFacility();
  }

  viewListFacility() {
    this.isLoading = true;
    this.facilityService.getAllFacilityOwner(this.params.page, this.params.pageSize).subscribe(res => {
      this.isLoading = false;
      this.listFacility = res.data;
      this.totalCount = res.totalItems;
    })
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

  deleteFacility(id: number) {
    // Gọi API hoặc thực hiện thao tác xoá
    console.log("Xóa sân với ID:", id);
  }

}
