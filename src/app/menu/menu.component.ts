import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslatePipe } from '@ngx-translate/core';

declare var $: any;
@Component({
  selector: 'app-menu',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute)

  serverUrl = environment.baseUrl
  submitted = false
  now = new Date();
  menu = this.fb.group({
    appMenuId: [],
    menuCode: [''],
    name: ['', Validators.required],
    parentId: [0],
    parentName: [''],
    menuUrl: ['', Validators.required],
    isDefault: [false],
    isDisplay: [true],
    displayOrder: ['', Validators.required],
    isActive: [true],
    createdBy: [null],
    createdAt: [null],
    updatedBy: [null],
    updatedAt: [null],
    operationBy: [null],
    operationCode: [''],
  });

  apmenu1: any;
  editMode: boolean = false;
  isFormDisabled: boolean = false;
  getMenu(id: any) {
    this.http.get(this.serverUrl + 'UserProcess/GetAppMenu/' + id).subscribe((data: any) => {
      const apmenu = data.data;
      this.apmenu1 = data.data;
      this.editMode = true;
      console.log(this.apmenu1, 'this.apmenu1');

      this.menu.patchValue({
        appMenuId: apmenu.appMenuId,
        menuCode: apmenu.menuCode,
        name: apmenu.name,
        parentId: apmenu.parentId,
        parentName: apmenu.parentName,
        menuUrl: apmenu.menuUrl,
        isDisplay: apmenu.isDisplay,
        displayOrder: apmenu.displayOrder,
        isActive: apmenu.isActive,
        isDefault: apmenu.isDefault,
        createdBy: apmenu.createdBy,
        updatedBy: apmenu.updatedBy,
        updatedAt: apmenu.updatedAt,
        operationBy: apmenu.operationBy,
        operationCode: apmenu.operationCode,
      })
    })
  }

  menuList = new Array();
  getMenulist() {
    this.http.get(this.serverUrl + "UserProcess/GetAppMenuAll").subscribe((result: any) => {
      result.data.appMenu.forEach((theMenu: { parentId: null; }) => {
        // if (theMenu.parentId === null) {
          this.menuList.push(theMenu);
        // }
      });
    })
  }

  editData: any;
  edit: any
  saveForm() {
    this.submitted = true
    if (this.menu.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    if (this.menu.value.appMenuId == null) {
      this.menu.patchValue({
        operationCode: 'C',
      })
    } else {
      this.menu.patchValue({
        operationCode: 'U',
      })
    }
    console.log(this.menu.value, 'wrdf');
    this.spinner.show()
    this.http.post(this.serverUrl + 'UserProcess/SetAppMenu', this.menu.value).subscribe((data: any) => {
      console.log(data);
      this.toastr.success(data.message, 'Saved Successfully')
      this.spinner.hide()
      this.router.navigate(['/menu-list'])
    })
  }

  ngAfterViewInit() {
    $('#a6').on('change', (event: any) => {
      var selectVal = parseInt(event.target.value);
      this.menu.get('parentId')?.setValue(selectVal);
    });
  }

  isNew = true
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.isNew = false
      this.getMenu(id)
    }
    $('#a6').select2();
    this.getMenulist();
  }
}
