import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FacilityService } from '../../../../core/api/facility.service';

@Component({
  selector: 'app-schedule-owner-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzPaginationModule,
  ],
  templateUrl: './schedule-owner-list.component.html',
  styleUrl: './schedule-owner-list.component.scss'
})
export class ScheduleOwnerListComponent implements OnInit{
  nameFeildCheck: any = 'Sân thể thao';
  selectedFieldId: any; 
  pageSize = 6; 
  currentPage = 1;
  isLoading: boolean = false;
  isFieldListOpen: boolean = false;
  pagedListSanBong: any[] = [];
  searchTerm: string = '';
  searchTerms = new Subject<string>();
  totalItems: number = 0;
  
  listFeilds: any[] = [];
  allFacilities: any[] = [];
  listSanBong: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private message: NzMessageService,
    private facilityService: FacilityService,
  ) {}
  
  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 1; 
      this.filterFacilities();
    });
    this.loadAllFacilities();
  }

  toggleFieldList() {
    this.isFieldListOpen = !this.isFieldListOpen;
  }

  onSearch(event: any): void {
    const term = event.target.value;
    this.searchTerms.next(term);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.filterFacilities();
  }

  loadAllFacilities() {
    this.isLoading = true;
    this.facilityService.getAllFacilityOwner(1, 999, this.searchTerm).subscribe(res => {
      this.isLoading = false;
      this.allFacilities = res.data;
      this.generateFacilityTypeList();
      this.filterFacilities();
      this.cdr.detectChanges();
    });
  }

  generateFacilityTypeList() {
    const typesMap = new Map<string, number>();
    this.allFacilities.forEach(facility => {
      if (facility.facilityType) {
        const count = typesMap.get(facility.facilityType) || 0;
        typesMap.set(facility.facilityType, count + 1);
      }
    });
    this.listFeilds = Array.from(typesMap).map(([name, count], index) => ({
      id: index,
      name: name,
      count: count
    }));
    this.listFeilds.unshift({
      id: -1,
      name: 'Tất cả sân thể thao',
      count: this.allFacilities.length
    });
    if (this.listFeilds.length > 0 && !this.selectedFieldId) {
      this.selectedFieldId = -1;
      this.nameFeildCheck = 'Tất cả sân thể thao';
    }
  }

  filterFacilities() {
    let filteredList = [...this.allFacilities];
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filteredList = filteredList.filter(item => 
        item.name && item.name.toLowerCase().includes(term)
      );
    }
    if (this.selectedFieldId !== -1 && this.selectedFieldId !== undefined) {
      const selectedType = this.listFeilds.find(f => f.id === this.selectedFieldId)?.name;
      if (selectedType) {
        filteredList = filteredList.filter(item => 
          item.facilityType === selectedType
        );
      }
    }
    this.totalItems = filteredList.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.listSanBong = filteredList.slice(startIndex, startIndex + this.pageSize);
  }

  checkFeild(item: any) {
    this.nameFeildCheck = item.name;
    this.selectedFieldId = item.id;
    this.currentPage = 1; 
    this.filterFacilities();
  }

  viewDetail(id: any) {
    this.router.navigate([`/shedule-owner/book/${id}`]);
  }
}