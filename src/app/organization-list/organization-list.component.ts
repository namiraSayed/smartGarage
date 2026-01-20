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
  selector: 'app-organization-list',
  imports: [NgxPaginationModule, CommonModule, RouterLink, FormsModule,TranslatePipe],
  templateUrl: './organization-list.component.html',
  styleUrl: './organization-list.component.css'
})
export class OrganizationListComponent {
  http = inject(HttpClient);
  spinner = inject(NgxSpinnerService);
  appTitle = inject(AppComponent);

  serverUrl = environment.baseUrl;

  showAdd = true;

  orgData: any;
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
      this.getorglist();
    } else {
      this.searchKey = null;
      if (e.target.value.length == 0) {
        this.getorglist();
      }
    }
  }

  handlePageSizeChange(eve: any) {
    this.itemsPerPage = eve.target.value;
    this.currentPage = 0;
    this.getorglist();
  }

  notFound = false;
  getorglist() {
    this.spinner.show();
    this.http.get( this.serverUrl + `MasterProcess/GetOrganizationSearchBy/${this.searchKey}/${this.currentPage}/${this.itemsPerPage}` ).subscribe((data: any) => {
        if (data.data.organizationList == null) {
          this.orgData = [];
          this.notFound = true;
        } else {
          this.orgData = data.data.organizationList.organization;
          this.notFound = false;
        }
        // this.setCP = data.paging;
        this.p = 1;
        this.totalItems = data.data.totalCount;
        this.spinner.hide();
      });
  }

  getPage(event: number) {
    this.spinner.show();
    this.p = event;
    this.http.get( this.serverUrl + `MasterProcess/GetOrganizationSearchBy/${this.searchKey}/${ this.p - 1 }/${this.itemsPerPage}` ).subscribe((data: any) => {
        if (data.data.organizationList == null) {
          this.orgData = [];
          this.notFound = true;
        } else {
          this.orgData = data.data.organizationList.organization;
          this.notFound = false;
        }
        // this.setCP = data.paging;
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
    this.getorglist();
  }
}