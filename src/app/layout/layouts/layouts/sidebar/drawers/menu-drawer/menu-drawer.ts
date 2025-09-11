import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';

interface UserAccessItem {
  FunctionId: string;
  FunctionName: string;
  HOFunctionFlag: string;
  AllowMaintAddFlag: string;
  AllowMaintEditFlag: string;
  AllowMaintDelFlag: string;
  AllowMaintViewFlag: string;
  AllowMaintAuthFlag: string;
  AllowProcessFlag: string;
  AllowReportViewFlag: string;
  AllowReportPrintFlag: string;
  AllowReportGenFlag: string;
  AllowAnyOfficeOpsFlag: string;
  ModuleId: string;
  ModuleName: string;
  AppRoute: string;
  ItemType: string;
  QuickRouteNo: string;
  IsFinancial: string;
}

@Component({
  selector: 'app-menu-drawer',
  imports: [
    RouterLink,
    MatIcon,
    CommonModule
  ],
  templateUrl: './menu-drawer.html',
  standalone: true,
  styleUrl: './menu-drawer.scss',
  animations: [
    trigger('expandCollapse', [
      state('open', style({height: '*', opacity: 1})),
      state('closed', style({height: '0px', opacity: 0})),
      transition('open <=> closed', animate('300ms ease-in-out'))
    ])
  ]
})
export class MenuDrawer implements OnInit {

  openSections: { [key: string]: boolean } = {
    mxMessages: false,
    messageList: true,
  };

  userAccessList: UserAccessItem[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserAccessList();
  }

  loadUserAccessList(): void {
    const apiUrl = 'http://192.168.20.250:8090/api/user-login/get-user-access-list';
    const params = {
      userId: localStorage.getItem('userId'),
      appId: '133',
      itemType: 'F',
      isHoUser: '0'
    };

    this.http.get<UserAccessItem[]>(apiUrl, { params: params as any })
      .subscribe({
        next: (data) => {
          this.userAccessList = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading user access list:', err);
          this.error = 'Failed to load menu items';
          this.isLoading = false;
        }
      });
  }

  toggleSection(section: string): void {
    this.openSections[section] = !this.openSections[section];
  }

  isSectionOpen(section: string): boolean {
    return this.openSections[section];
  }
}