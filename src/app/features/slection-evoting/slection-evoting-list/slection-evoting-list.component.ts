import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShareTableModule } from '../../../shared/components/share-table/share-table.module';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ManagermentService } from '../../../core/api/managerment.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { DetailCtvComponent } from '../../slection-management/slection-management-list/detail-ctv/detail-ctv.component';
import { ProceedEvotingComponent } from '../proceed-evoting/proceed-evoting.component';
import { VoteService } from '../../../core/api/vote.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-slection-evoting-list',
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
    DetailCtvComponent,
    ProceedEvotingComponent
  ],
  templateUrl: './slection-evoting-list.component.html',
  styleUrl: './slection-evoting-list.component.scss'
})
export class SlectionEvotingListComponent {
  public isLoading: boolean = false;
  public isVisibleDetail: boolean = false;
  public isVisibleEvoting: boolean = false;
  public idCtv: any = '';
  public idEvoting: any = '';
  public nameEvoting: any = '';
  public numberVote: any;
  public mode: 'create' | 'edit' = 'create';
  public totalCount: number = 10;
  public idSlectionManagement: any = '';
  public listUserManagements: any = [];
  public listVote: any = []
  public listStatus: any = [
    {
      label: 'Đang hoạt động',
      value: 'Active'
    },
    {
      label: 'Hết hạn',
      value: 'Disable'
    },
  ];
  public searchQuery: string = '';
  public role: string;
  public isCandidatesLoading: boolean = true;
  public isVotersLoading: boolean = true;
  get isLoadingOK(): boolean {
    return this.isCandidatesLoading || this.isVotersLoading;
  }


  form: FormGroup = this.fb.group({
    name: [''],
    status: [null],
  });


  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private voteService: VoteService,
    private message: NzMessageService,
  ){}
  
  ngOnInit(): void {
    this.viewListVote();
  }

  viewListVote() {
    this.isLoading = true;
    this.voteService.viewListVoteForUser().subscribe({
      next: (res) => {
        if(res.data.length === 0) {
          this.listVote = [];
        } else {
          this.listVote = res.data.map((vote: any) => {
            return {
              ...vote,
              candidates: [], // Khởi tạo danh sách ứng viên
              voters: []      // Khởi tạo danh sách cử tri
            };
          });
          
          // Tải danh sách ứng viên và cử tri cho mỗi cuộc bầu cử
          this.listVote.forEach((vote: any) => {
            this.voteService.listViewCandidate(vote.id).subscribe({
              next: (candidateRes) => {
                vote.candidates = candidateRes.data;
                this.cdr.detectChanges();
                this.isCandidatesLoading = false;
              }
            });
            this.voteService.listViewVoter(vote.id).subscribe({
              next: (voterRes) => {
                vote.voters = voterRes.data;
                this.cdr.detectChanges();
                this.isVotersLoading = false;
              }
            });
          });
        }
  
        this.totalCount = res.totalItems;
        this.cdr.detectChanges();
        this.message.success('Lấy danh sách cuộc bầu cử thành công!');
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error('Lỗi hệ thống');
      }
    });
  }

  openResult(id: any) {
    this.router.navigate([`/slection-ticket/result/${id}`]);
  }

  openEvotingPopup(id: string, name?: string, numberVote?: any, status?: any) {
    this.idEvoting = id;
    this.nameEvoting = name;
    this.numberVote = numberVote;
    if(status === '0') {
      this.message.warning('Cuộc bầu cử chưa được kích hoạt. Không thể tiến hành.');
    } else if(status === '2') {
      this.message.warning('Cuộc bầu cử đã hết hạn. Không thể tiến hành.');
    } else if (status === '1') {
      this.isVisibleEvoting = true;
    }
  }

  handleChangeVotingVisible(data: any) {
    this.isVisibleEvoting = data.visible;
  }

  openDetailPopup(id?: string) {
    this.isVisibleDetail = true;
    this.idCtv = id;
  }
  handleChangeDetailVisible(data: any) {
    this.isVisibleDetail = data.visible;
  }

  handleCancel() {
    this.form.reset({ emitEvent: true });
    this.handleSearch();
  }

  handleSearch() {

  }
}
