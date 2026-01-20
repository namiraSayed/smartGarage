import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../environments/environment';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FilterPipe } from '../core/pipes/filter.pipe';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-dropdown',
  imports: [NgxPaginationModule, CommonModule, RouterLink, FormsModule,TranslatePipe, FilterPipe, ReactiveFormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  http = inject(HttpClient);
  spinner = inject(NgxSpinnerService);
  appTitle = inject(AppComponent);
  fb = inject(FormBuilder)
  toastr = inject(ToastrService)

  serverUrl = environment.baseUrl;

  showAdd = true;

  dropdownData: any;
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
      this.getDropdownEntity();
    } else {
      this.searchKey = null;
      if (e.target.value.length == 0) {
        this.getDropdownEntity();
      }
    }
  }

  handlePageSizeChange(eve: any) {
    this.itemsPerPage = eve.target.value;
    this.currentPage = 0;
    this.getDropdownEntity();
  }
  notFound = false;
  getDropdownEntity() {
    this.spinner.show();
    this.http
      .get( this.serverUrl + `GeneralProcess/GetDropdownEntitySearchBy/${this.searchKey}/${this.currentPage}/${this.itemsPerPage}` )
      .subscribe((data: any) => {
        if (data.data.dropdownEntityList == null) {
          this.dropdownData = [];
          this.notFound = true;
        } else {
          this.dropdownData = data.data.dropdownEntityList.dropdownEntity;
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
    this.http
      .get( this.serverUrl + `GeneralProcess/GetDropdownEntitySearchBy/${this.searchKey}/${ this.p - 1 }/${this.itemsPerPage}` )
      .subscribe((data: any) => {
        if (data.data.dropdownEntityList == null) {
          this.dropdownData = [];
          this.notFound = true;
        } else {
          this.dropdownData = data.data.dropdownEntityList.dropdownEntity;
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

  termVal:any = ''
  entityValueData:any
  entityValueArr:any = []
  isEntityValueModal = false
  openValue(eValue:any) {
    this.entityValueArr = []
    console.log(eValue, 'eValue');
    this.http.get(this.serverUrl + `MasterProcess/GetDropdownSearchBy/null/${eValue.dropdownEntityId}/${eValue.dropdownEntitySubTypeId}/${eValue.dropdownEntityTypeId}`).subscribe((data:any) => {
      this.entityValueData = data.data.dropdownEntityType[0]
      this.entityValueData.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((lvl1:any) => {
        lvl1.dropdownEntityList.dropdownEntity.forEach((lvl2:any) => {
          if(lvl2.dropdownValueList == null) {
            this.entityValueArr = []
          } else {
            lvl2.dropdownValueList.dropdownValue.forEach((lvl3:any) => {
            this.entityValueArr.push(lvl3)
            });
          }
        });
      });
      this.isEntityValueModal = true
      console.log(this.entityValueData, 'entityValueData', 'entityValueArr', this.entityValueArr);
      $('#entityValModal').modal('show')
    })
  }

  submittedValue = false
  entityValueForm = this.fb.group({
    dropdownValueId: [null],
    dropdownEntityId: [0],
    code: ['', Validators.required],
    value: ['', Validators.required],
    definition: ['', Validators.required],
    otherValue: [null],
    parentId: [null],
    isDefault: [false],
    isActive: [true],
    operationCode: ['C']
  })

  editValue(item:any) {
    $('#addValueModal').modal('show')
    this.entityValueForm.patchValue({
      dropdownValueId: item.dropdownValueId,
      dropdownEntityId: item.dropdownEntityId,
      code: item.code,
      value: item.value,
      definition: item.definition,
      otherValue: item.otherValue,
      parentId: item.parentId,
      isDefault: item.isDefault,
      isActive: item.isActive
    })
  }

  saveValueForm() {
    console.log(this.entityValueForm.value, 'eee');
      this.submittedValue = true;
    if (this.entityValueForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    if (this.entityValueForm.value.dropdownValueId == null) {
      this.entityValueForm.patchValue({
        operationCode: 'C',
      });
    } else {
      this.entityValueForm.patchValue({
        operationCode: 'U',
      });
    }
    console.log(this.entityValueForm.value, 'wrdf');
    
  }

  newValueModal() {
  
    $('#addValueModal').modal('show')
  }

  aclArr: any;
  ngOnInit() {
    this.aclArr = this.appTitle.aclAllowed;
    console.log(this.aclArr, 'this.aclArr');
    this.getDropdownEntity();
  }
}
