import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import moment from 'moment';

declare var $: any;
@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute)

  serverUrl = environment.baseUrl
  submitted = false
  now = new Date();
  user = this.fb.group({
    appUserId: [],
    appUserTypeId: [0],
    appMasterId:[0],
    username: [''],
    fullName: ['', Validators.required],
    email: ['', Validators.required],
    emailConfirmed: [true],
    passwordHash:['',Validators.required],
    passwordSalt:[''],
    passwordIterations: [0],
    passwordAlgorithm: [''],
    passwordExpiryDate: ['2025-12-01T08:36:29.209Z'],
    lastPasswordChange: ['2025-12-01T08:36:29.209Z'],
    securityStamp: [''],
    phoneNumber: [, Validators.required],
    phoneNumberConfirmed: [true],
    twoFactorEnabled: [true],
    accessFailedCount: [0],
    isActive: [true],
    previousPasswordHashes: [''],
    previousPasswordSalts: [''],
    appRoleId: [0],
    branchUnitId: [0],
    startDate: [''],
    createdBy: [null],
    createdAt: [null],
    updatedBy: [null],
    updatedAt: [null],
    operationBy: [null],
    operationCode: [''],
  });

  apuser1: any;
  editMode: boolean = false;
  isFormDisabled: boolean = false;
  getUser(id: any) {
    this.http.get(this.serverUrl + 'UserProcess/GetAppUser/' + id).subscribe((data: any) => {
      const apuser = data.data;
      this.apuser1 = data.data;
      this.editMode = true;
      console.log(this.apuser1, 'this.apuser1');

      this.user.patchValue({
        appUserId: apuser.appUserId,
        appUserTypeId: apuser.appUserTypeId,
        appMasterId: apuser.appMasterId,
        username: apuser.username,
        fullName: apuser.fullName,
        email: apuser.email,
        passwordHash: apuser.passwordHash,
        phoneNumber: apuser.phoneNumber,
        isActive: apuser.isActive,
        appRoleId: apuser.appRoleId,
        branchUnitId: apuser.branchUnitId,
        startDate: moment(apuser.startDate).format('YYYY-MM-DD'),
        createdBy: apuser.createdBy,
        createdAt: apuser.createdAt,
        updatedBy: apuser.updatedBy,
        updatedAt: apuser.updatedAt,
        operationBy: apuser.operationBy,
        operationCode: apuser.operationCode,
      })
    })
  }

  roleData: any;
  getroleData() {
    this.spinner.show();
    this.http.get(this.serverUrl + "UserProcess/GetAppRoleAll").subscribe((result: any) => {
        this.roleData = result.data.appRole;
        this.spinner.hide();
      });
  }

  branchUnitData: any;
  getbranchUnitData() {
    this.spinner.show();
    this.http.get(this.serverUrl + "MasterProcess/GetBranchUnitAll").subscribe((result: any) => {
        this.branchUnitData = result.data.branchUnt;
        this.spinner.hide();
      });
  }

  userTypeData: any;
  getuserTypeData() {
    this.spinner.show();
    this.http.get(this.serverUrl + "UserProcess/GetAppUserTypeAll").subscribe((result: any) => {
        this.userTypeData = result.data.appUserType;
        this.spinner.hide();
      });
  }

  appMasterData: any;
  getappMasterData() {
    this.spinner.show();
    this.http.get(this.serverUrl + "UserProcess/GetAppMasterAll").subscribe((result: any) => {
        this.appMasterData = result.data.appMaster;
        this.spinner.hide();
      });
  }

  editData: any;
  edit: any
  saveForm() {
    this.submitted = true
    if (this.user.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    if (this.user.value.appUserId == null) {
      this.user.patchValue({
        operationCode: 'C',
      })
    } else {
      this.user.patchValue({
        operationCode: 'U',
      })
    }
    console.log(this.user.value, 'wrdf');
    this.spinner.show()
    this.http.post(this.serverUrl + 'UserProcess/SetAppUser', this.user.value).subscribe((data: any) => {
      console.log(data);
      this.toastr.success(data.message, 'Saved Successfully')
      this.spinner.hide()
      this.router.navigate(['/user-list'])
    })
  }

  ngAfterViewInit() {
    $('#8').on('change', (event: any) => {
      var selectVal = parseInt(event.target.value);
      console.log(selectVal, 'appRoleId');
      //you can use the selected value
      this.user.get('appRoleId')?.setValue(selectVal);
    });
    $('#1').on('change', (event: any) => {
      var selectVal = parseInt(event.target.value);
      console.log(selectVal, 'appUserTypeId');
      //you can use the selected value
      this.user.get('appUserTypeId')?.setValue(selectVal);
    });
    $('#9').on('change', (event: any) => {
      var selectVal = parseInt(event.target.value);
      console.log(selectVal, 'branchUnitId');
      //you can use the selected value
      this.user.get('branchUnitId')?.setValue(selectVal);
    });
    $('#2').on('change', (event: any) => {
      var selectVal = parseInt(event.target.value);
      console.log(selectVal, 'appMasterId');
      //you can use the selected value
      this.user.get('appMasterId')?.setValue(selectVal);
    });
  }

  isNew = true
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')
    if (id) {
      this.isNew = false
      this.getUser(id)
    }
    $('#9').select2();
    this.getroleData();
    this.getbranchUnitData();
    this.getappMasterData();
    this.getuserTypeData();
  }
}
