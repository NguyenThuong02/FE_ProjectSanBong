import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmailTemplateService } from '../../../../core/api/email-template.service';
import { PopupAddTemplateComponent } from './popup-add-template/popup-add-template.component';
import { PopupDeleteTemplateComponent } from './popup-delete-template/popup-delete-template.component';

@Component({
  selector: 'app-email-template-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopupAddTemplateComponent,
    PopupDeleteTemplateComponent
  ],
  templateUrl: './email-template-list.component.html',
  styleUrl: './email-template-list.component.scss'
})
export class EmailTemplateListComponent implements OnInit {
  isLoading: boolean = false;
  listTemplates: any[] = []
  idTemplate: any;
  isVisible: boolean = false;
  isEdit: boolean = false;
  isVisibleDelete: boolean = false;
  item: any;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private emailTemplateService: EmailTemplateService,
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates() {
    this.isLoading = true;
    this.emailTemplateService.getAllTemplates().subscribe((res: any) => {
      this.listTemplates = res;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  addTemplate() {
    this.idTemplate = null;
    this.isEdit = false;
    this.isVisible = true;
  }

  viewTemplateDetail(id: string) {
    this.idTemplate = id;
    this.isEdit = true;
    this.isVisible = true;
  }

  handleVisibilityChange(visible: boolean) {
    this.isVisible = visible;
    if (!visible) {
      this.loadTemplates();
    }
  }

  viewDeleta(item: any) {
    this.item = item;
    this.isVisibleDelete = true;
  }

  handleChangeVisibleDelete(data: any) {
    this.isVisibleDelete = data.visible;
    if (data.isSuccess == true) {
      this.loadTemplates();
    }
  }
}
