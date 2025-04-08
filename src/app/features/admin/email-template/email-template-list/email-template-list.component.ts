import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmailTemplateService } from '../../../../core/api/email-template.service';
import { PopupAddTemplateComponent } from './popup-add-template/popup-add-template.component';

@Component({
  selector: 'app-email-template-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopupAddTemplateComponent,
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
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private emailTemplateService: EmailTemplateService,
  ) {}

  ngOnInit(): void {
    this.emailTemplateService.getAllTemplates().subscribe((res: any) => {
      this.listTemplates = res;
    });
  }

  addTemplate() {
    this.idTemplate = null;
    this.isEdit = false;
    this.isVisible = true;
  }
}
