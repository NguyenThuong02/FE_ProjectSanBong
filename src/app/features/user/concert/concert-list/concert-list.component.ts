import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FacilityService } from '../../../../core/api/facility.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ConcertService } from '../../../../core/api/concert.service';

@Component({
  selector: 'app-concert-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzPaginationModule,
  ],
  templateUrl: './concert-list.component.html',
  styleUrl: './concert-list.component.scss'
})
export class ConcertListComponent implements OnInit{
  nameConcertCheck: any = 'Sự kiện';
  selectedConcertId: any; 
  pageSize = 5; // Changed from 6 to 5 events per page
  currentPage = 1;
  isLoading: boolean = false;
  searchTerm: string = '';
  searchTerms = new Subject<string>();
  totalItems: number = 0;
  
  listConcerts: any[] = [];
  allConcerts: any[] = [];
  listEvents: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private message: NzMessageService,
    private concertService: ConcertService,
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
    this.concertService.getAllEvent(1, 999, this.searchTerm).subscribe(res => {
      this.isLoading = false;
      this.allConcerts = res.data.map((item: any) => ({
        ...item,
        img: '../../../assets/img/imgEvent.png'
      }));
      this.generateEventTypeList();
      this.filterFacilities();
      this.cdr.detectChanges();
    });
  }

  generateEventTypeList() {
    const typesMap = new Map<string, number>();
    this.allConcerts.forEach(item => {
      if (item.eventType) {
        const count = typesMap.get(item.eventType) || 0;
        typesMap.set(item.eventType, count + 1);
      }
    });
    this.listConcerts = Array.from(typesMap).map(([name, count], index) => ({
      id: index,
      name: name,
      count: count
    }));
    this.listConcerts.unshift({
      id: -1,
      name: 'Tất cả sự kiện',
      count: this.allConcerts.length
    });
    if (this.listConcerts.length > 0 && !this.selectedConcertId) {
      this.selectedConcertId = -1;
      this.nameConcertCheck = 'Tất cả sự kiện';
    }
  }

  filterFacilities() {
    let filteredList = [...this.allConcerts];
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filteredList = filteredList.filter(item => 
        item.name && item.name.toLowerCase().includes(term)
      );
    }
    if (this.selectedConcertId !== -1 && this.selectedConcertId !== undefined) {
      const selectedType = this.listConcerts.find(f => f.id === this.selectedConcertId)?.name;
      if (selectedType) {
        filteredList = filteredList.filter(item => 
          item.eventType === selectedType
        );
      }
    }
    this.totalItems = filteredList.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.listEvents = filteredList.slice(startIndex, startIndex + this.pageSize);
  }

  checkFeild(item: any) {
    this.nameConcertCheck = item.name;
    this.selectedConcertId = item.id;
    this.currentPage = 1; 
    this.filterFacilities();
  }

  viewDetail(id: any) {
    this.router.navigate([`/concert/detail/${id}`]);
  }
}