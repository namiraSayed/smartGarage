import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../environments/environment';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { TranslatePipe } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'app-user-list',
  imports: [NgxPaginationModule, CommonModule, RouterLink, FormsModule,TranslatePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  http = inject(HttpClient);
  spinner = inject(NgxSpinnerService);
  appTitle = inject(AppComponent);

  serverUrl = environment.baseUrl;

  userdata: any;
  p = 0;
  term: any;
  currentPage = 0;
  itemsPerPage = 10;
  totalItems: any;
  pageSizes = [10, 25, 50, 75, 100];
  searchKey = null;
  searchPage = 0;
  setCP: any;

  onSearchKey(e: any) {
    if (e.target.value.length > 2) {
      this.searchKey = e.target.value;
      this.currentPage = 1 - 1;
      this.searchPage = 1;
      this.getuserlist();
    } else {
      this.searchKey = null;
      if (e.target.value.length == 0) {
        this.getuserlist();
      }
    }
  }

  handlePageSizeChange(eve: any) {
    this.itemsPerPage = eve.target.value;
    this.currentPage = 0;
    this.getuserlist();
  }

  notFound = false;
  getuserlist() {
    this.spinner.show();
    this.http.get( this.serverUrl + `UserProcess/GetAppUserSearchBy/${this.searchKey}/${this.currentPage}/${this.itemsPerPage}`).subscribe((data: any) => {
        if (data.data.appUserList == null) {
          this.userdata = [];
          this.notFound = true;
        } else {
          this.userdata = data.data.appUserList.appUser;
          this.notFound = false;
        }
        this.p = 1;
        this.totalItems = data.data.totalCount;
        this.spinner.hide();
      });
  }

  getPage(event: number) {
    this.spinner.show();
    this.p = event;
    this.http.get( this.serverUrl + `UserProcess/GetAppUserSearchBy/${this.searchKey}/${ this.p - 1 }/${this.itemsPerPage}`).subscribe((data: any) => {
        if (data.data.appUserList == null) {
          this.userdata = [];
          this.notFound = true;
        } else {
          this.userdata = data.data.appUserList.appUser;
          this.notFound = false;
        }
        this.totalItems = data.data.totalCount;
        this.spinner.hide();
      });
  }

  modalData: any;
  isModal = false;
  onView(itt: any) {
    console.log(itt, 'dfd');
    this.modalData = itt;
    this.isModal = true;
    $('#modal-view').modal('show');
  }

  aclArr: any;
  ngOnInit() {
    this.aclArr = this.appTitle.aclAllowed;
    console.log(this.aclArr, 'this.aclArr');
    this.getuserlist();
  }
}
