import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import 'zone.js';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/api/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { edit } from '../../shared/components/iconAntd/iconAddOnAntd.component';
import { AccountService } from '../../core/api/account.service';
import { ChangePasswordComponent } from '../../features/setting/change-password/change-password.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzIconModule,
    NzSkeletonModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzDropDownModule,
    RouterModule,
    MatSelectModule,
    FormsModule,
    TranslateModule,
    ChangePasswordComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit, OnChanges {
  isCollapsed = false;
  isReverseArrow = false;
  idOwner: any;
  nameOwner: any;
  canActive: boolean = false;
  viewDetailUnit = false;
  width = 280;
  userName: string;
  role: string;
  _store = inject(Store);
  isUserMenuVisible: boolean = false;
  pageTitle = 'Danh sách tài khoản';

  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private iconService: NzIconService,
    private authService: AuthService,
    private OauthService: OAuthService,
    private nzContextMenuService: NzContextMenuService,
    private accountService: AccountService,
    private router: Router,
    private message: NzMessageService,
    private authService2: SocialAuthService,
  ) {
    let keysPressed: any = {};

    document.addEventListener('keyup', (event: any) => {
      delete keysPressed[event.keyCode];
    });

    this.iconService.addIconLiteral('edit:antd', edit);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
    });
  }
  count: number;
  userInfor: any = JSON.parse(
    localStorage.getItem('id_token_claims_obj') || '{}',
  );
  ngOnChanges(changes: SimpleChanges): void {
    
  }
  ngOnInit(): void {
    // Xem quyền người dùng để hiển thị menu
    this.idOwner = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.sub;
    this.nameOwner = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.name;
    this.role = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.role;
    if(this.role) {
      if(this.role[0] === 'Administrator'){
        this.canActive = true;
        this.router.navigate(['/user-management']);
      } else if(this.role[0] === 'User') {
        this.canActive = false;
        this.router.navigate(['/home-page']);
      } else if(this.role[0] === 'FacilityOwner') {
        this.canActive = true;
        this.router.navigate(['/facility']);
      }
    } else {
      this.canActive = false;
      this.router.navigate(['/home-page']);
    }

    console.log(this.OauthService.hasValidAccessToken());
    
    setInterval(() => {
      this.OauthService.refreshToken()
    }, 1800000000)

    if (this.getDeviceType() === 'mobile') {
      this.isCollapsed = true;
      this.cdr.detectChanges();
    }
    this._store.select('renderDataMenu').subscribe((data) => {
      this.cdr.detectChanges();
    });
    const idInterval = setInterval(() => {
      if (localStorage.getItem('id_token_claims_obj')) {
        this.userName = JSON.parse(
          localStorage.getItem('id_token_claims_obj') || '{}',
        )?.name;
        clearInterval(idInterval);
      }
    }, 300);

    MainComponent.getData();
    if (this.OauthService.hasValidIdToken()) {
      this.OauthService.refreshToken().then(() => {
        
      });
    } else {
      
    }
  }

  getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua,
      )
    ) {
      return 'mobile';
    }
    return 'desktop';
  };

  public static data: any = [];
  public static getData: any = () => {
    MainComponent.data.push('a');
  };
  get staticData() {
    return MainComponent.data;
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  handleLogout() {
    this.isUserMenuVisible = false;
    this.authService.logout();
    this.authService2.signOut();
    this.cdr.detectChanges();
    window.location.reload();
  }

  stopPrevenDefault($event: any) {
    $event.preventDefault();
  }

  toggleUserMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isUserMenuVisible = !this.isUserMenuVisible;
    this.cdr.detectChanges();
  }

  updatePageTitle() {
    const routeTitles: { [key: string]: string } = {
      '/user-management': 'Danh sách tài khoản',
      '/setting': 'Cài đặt',
      '/facility/list': 'Quản lý sân',
      '/home-page': 'Trang chủ',
      '/list-feilds': 'Danh sách sân',
      '/my-info': 'Thông tin cá nhân'
    };
    const currentUrl = this.router.url;
    this.pageTitle = routeTitles[currentUrl] || 'Danh sách tài khoản';
  }
}
