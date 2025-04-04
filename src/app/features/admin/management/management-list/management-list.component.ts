import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShareTableModule } from '../../../../shared/components/share-table/share-table.module';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ManagermentService } from '../../../../core/api/managerment.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { AccountDisableComponent } from './account-disable/account-disable.component';
import { AccountService } from '../../../../core/api/account.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PagiComponent } from '../../../../shared/components/pagi/pagi.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-management-list',
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
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    AccountDisableComponent,
    PagiComponent
  ],
  templateUrl: './management-list.component.html',
  styleUrl: './management-list.component.scss'
})
export class ManagementListComponent implements OnInit{
  public isLoading: boolean = false;
  public idManagement: any = '';
  public nameManagement: any = '';
  public totalCount: number = 10;
  public listUserManagements : any = [];
  public role: string;
  maxheight: string = '';
  public params = {
    page: 1,
    pageSize:10
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private managermentService: ManagermentService,
    private accountService: AccountService,
    private notification: NzNotificationService,
  ){}
  
  ngOnInit(): void {
    this.viewListUser();
  }

  viewListUser() {
    this.isLoading = true;
    this.managermentService.getAllManagement(this.params.page, this.params.pageSize).subscribe(res => {
      this.isLoading = false;
      this.listUserManagements = res.users;
      this.totalCount = res.totalCount;
    })
  }

  isVisiblePopUpAddManagement: boolean = false;
  handelVisiblePopUpAddManagement(e: boolean) {
    this.isVisiblePopUpAddManagement = e;
    this.viewListUser();
  }

  isVisiblePopUpEditManagement: boolean = false;
  handelVisiblePopUpEditManagement(e: boolean) {
    this.isVisiblePopUpEditManagement = e;
  }
  handelOpenPopUpEditManagement(id: string) {
    console.log("Id: ", id)
    this.isVisiblePopUpEditManagement = true;
  }

  openDisablePopup(id?: string, name?: any, status?: any) {
    this.idManagement = id;
    if(status === true) {
      this.isVisible = true;
      this.nameManagement = name;
    } else if (status === false) {
      this.accountService.activeAccount(this.idManagement).subscribe({
        next: (res) => {
          this.viewListUser();
          this.cdr.detectChanges();
          this.notification.create(
            'success',
            'Xác thực thành công',
            'Active account successfully!'
          );
        },
      })
    }
  }
  isVisible: boolean = false;
  handleChangeVisible(data: any) {
    this.isVisible = data.visible;
    if (data.isSuccess == true) {
      this.viewListUser();
    }
  }

  changePage(e: number) {
    this.params.page = e;
    this.viewListUser();
  }
  changePageSize(e: number) {
    this.params.pageSize = e;
    this.viewListUser();
  }

  viewDetail(id?: any) {
    this.router.navigate([`/user-management/detail/${id}`]);
  }
}
