import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  serverUrl = environment.baseUrl
  imageUrl = environment.imageUrl
  editMode = false
  submitted = false

  employeeform :any = this.fb.group({
    employeeId: [null],
    employeeNo: ['', Validators.required],
    titleId: [1],
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    firstNameL: [''],
    middleNameL: [''],
    lastNameL: [''],
    gender: [, Validators.required],
    dob: ['', Validators.required],
    maritalStatusId: [0],
    mobile: [''],
    nationalIdType: [, Validators.required],
    nationalId: ['', Validators.required],
    nationality: [, Validators.required],
    remarks: [''],
    createdBy: [null],
    createdAt: [null],
    updatedBy: [null],
    updatedAt: [null],
    operationBy: [null],
    operationCode: [''],
  });

  event: any;
  isFormDisabled: boolean = false;
  getEmployee(id: any) {
    this.spinner.show();
    this.http.get(this.serverUrl + 'HRProcess/GetEmployee/' + id).subscribe((data: any) => {
      const editData = data.data;
      this.event = data.data;
      this.editMode = true;
      console.log(this.event, 'this.event');
        this.contractForm.get('employeeId')?.setValue(editData.employeeId);
        this.contributionForm.get('employeeId')?.setValue(editData.employeeId);

      this.employeeform.patchValue({
        employeeId: editData.employeeId,
        employeeNo: editData.employeeNo,
        titleId: editData.titleId,
        firstName: editData.firstName,
        middleName: editData.middleName,
        lastName: editData.lastName,
        firstNameL: editData.firstNameL,
        middleNameL: editData.middleNameL,
        lastNameL: editData.lastNameL,
        gender: editData.gender,
        dob: moment(editData.dob).format('YYYY-MM-DD'),
        maritalStatusId: editData.maritalStatusId,
        mobile: editData.mobile,
        nationalIdType: editData.nationalIdType,
        nationalId: editData.nationalId,
        nationality: editData.nationality,
        remarks: editData.remarks,
        createdBy: editData.createdBy,
        createdAt: editData.createdAt,
        updatedBy: editData.updatedBy,
        updatedAt: editData.updatedAt,
        operationBy: editData.operationBy,
        operationCode: editData.operationCode,
      });
      this.spinner.hide();
    });
  }

  saveForm() {
    this.submitted = true;
    if (this.employeeform.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }

    if (this.employeeform.value.employeeStatusId == true) {
      this.employeeform.patchValue({
        employeeStatusId: 1,
      });
    } else {
      this.employeeform.patchValue({
        employeeStatusId: 0,
      });
    }

    if (this.employeeform.value.employeeId == null) {
      this.employeeform.patchValue({
        operationCode: 'C',
      });
    } else {
      this.employeeform.patchValue({
        operationCode: 'U',
      });
    }
    console.log(this.employeeform.value, 'wrdf');
    this.spinner.show();
    this.http.post(this.serverUrl + 'HRProcess/SetEmployee', this.employeeform.value).subscribe((data: any) => {
      this.spinner.hide();
      if (this.editMode == true) {
        this.reloadCurrentRoute()
      } else {
        this.router.navigate(['/employee', data.id])
      }
    });
  }

  submitted2 = false
  contractForm = this.fb.group({
    employeeContractId: [null],
    employeeId: [],
    employeeName: [''],
    employeeNameL: [''],
    contractNumber: ['', Validators.required],
    contractTypeId: [, Validators.required],
    jobTitle: [''],
    contractStartDate: ['', Validators.required],
    contractEndDate: ['', Validators.required],
    probationPeriodDays: [],
    workingHoursPerDay: [],
    workingDaysPerWeek: [],
    basicSalary: [],
    housingAllowance: [],
    transportationAllowance: [],
    otherAllowances: [],
    totalSalary: [],
    contractAttachment: [''],
    createdBy: [null],
    createdAt: [null],
    updatedBy: [null],
    updatedAt: [null],
    operationBy: [null],
    operationCode: [''],
  });

  clearform() {
    this.contractForm.reset();
  }

  saveContract() {
    this.submitted2 = true;

    console.log(this.contractForm.value, 'this.EmployeeDetials.value');

    if (this.contractForm.invalid) {
      return this.toastr.error('Enter Valid Details', 'Failed');
    }
    var saveObj:any = this.employeeform.value

    if (this.contractForm.value.employeeContractId == null) {
      this.contractForm.patchValue({
        operationCode: 'C',
      })

    } else {
      this.contractForm.patchValue({
        operationCode: 'U',
      })
    }

    console.log('post', this.contractForm.value);
    // post api 

    this.spinner.show()
    this.http.post(this.serverUrl + 'HRProcess/SetEmployeeContract', this.contractForm.value).subscribe((data: any) => {
      this.contractForm.reset()
      console.log(data, 'sdusidj');
      this.spinner.hide()
      this.reloadCurrentRoute()
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  maritalData: any;
  getmaritalData() {
    this.spinner.show();
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/2/1/1').subscribe((data: any) => {
      if (data) {
        data.data.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'NFD') {
                  // maritalData starts
                  var maritalType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'marital-status')
                  if (maritalType) {
                    this.maritalData = maritalType.dropdownValueList.dropdownValue
                  }
                  // maritalData ends
                }
              }
            });
          }
        });
      }
      this.spinner.hide();
    });
  }

  nationalData: any;
  getnationalData() {
    this.spinner.show();
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/21/1/1').subscribe((data: any) => {
      if (data) {
        data.data.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'NFD') {
                  // nationalData starts
                  var nationalType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'document-type')
                  if (nationalType) {
                    this.nationalData = nationalType.dropdownValueList.dropdownValue
                  }
                  // nationalData ends
                }
              }
            });
          }
        });
      }
      this.spinner.hide();
    });
  }

  contractData: any;
  getcontractData() {
    this.spinner.show();
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/117/4/3').subscribe((data: any) => {
      if (data) {
        data.data.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'GAD') {
                  // contractData starts
                  var contractType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'contract-type')
                  if (contractType) {
                    this.contractData = contractType.dropdownValueList.dropdownValue
                  }
                  // contractData ends
                }
              }
            });
          }
        });
      }
      this.spinner.hide();
    });
  }

  notFound = false;
  eContractData: any;
  getEmployeeContractList(id: any) {
    return this.http.get(this.serverUrl + "HRProcess/GetEmployeeContractByEmployeeId/" + id).subscribe((result: any) => {
      if(result.data == null) {
        this.eContractData = []
        this.notFound = true;
      } else {
        this.eContractData = result.data.employeeContract;
        this.notFound = false;
      }
    })
  }

  editData:any;
  editModeEmployeeContract: boolean = false;
  editContract(index:any) {
  this.editMode = true;
  this.event = index;
  this.editModeEmployeeContract = true;

  this.contractForm.patchValue({
    employeeContractId: this.event.employeeContractId,
    employeeId: this.event.employeeId,
    employeeName: this.event.employeeName,
    employeeNameL: this.event.employeeNameL,
    contractNumber: this.event.contractNumber,
    contractTypeId: this.event.contractTypeId,
    jobTitle: this.event.jobTitle,
    contractStartDate: moment(this.event.contractStartDate).format('YYYY-MM-DD'),
    contractEndDate: moment(this.event.contractEndDate).format('YYYY-MM-DD'),
    probationPeriodDays: this.event.probationPeriodDays,
    workingHoursPerDay: this.event.workingHoursPerDay,
    workingDaysPerWeek: this.event.workingDaysPerWeek,
    basicSalary: this.event.basicSalary,
    housingAllowance: this.event.housingAllowance,
    transportationAllowance: this.event.transportationAllowance,
    otherAllowances: this.event.otherAllowances,
    totalSalary: this.event.totalSalary,
    // contractAttachment: this.event.contractAttachment,
    createdBy: this.event.createdBy,
    createdAt: this.event.createdAt,
    updatedBy: this.event.updatedBy,
    updatedAt: this.event.updatedAt,
    operationBy: this.event.operationBy,
    operationCode: this.event.operationCode
  })
}

  notFound1 = false;
  eContributionData: any;
  getEmployeeContributionList(id: any) {
    return this.http.get(this.serverUrl + "HRProcess/GetEmployeeGosiContributionByEmployeeId/" + id).subscribe((result: any) => {
      if(result.data == null) {
        this.eContributionData = []
        this.notFound1 = true;
      } else {
        this.eContributionData = result.data.employeeGosiContribution;
        this.notFound1 = false;
      }
    })
  }

  submitted3 = false
  contributionForm = this.fb.group({
    employeeGosiContributionId: [null],
    employeeId: [],
    employeeName: [''],
    employeeNameL: [''],
    monthYear: [''],
    grossSalary: [],
    employerContributionAmount: [, Validators.required],
    employeeContributionAmount: [, Validators.required],
    totalContributionAmount: [],
    paymentStatusId: [1],
    paymentDate: [''],
    createdBy: [null],
    createdAt: [null],
    updatedBy: [null],
    updatedAt: [null],
    operationBy: [null],
    operationCode: [''],
  });

  editData1:any;
  editModeEmployeeContribution: boolean = false;
  editContribution(index:any) {
  this.editMode = true;
  this.event = index;
  this.editModeEmployeeContribution = true;

  this.contributionForm.patchValue({
    employeeGosiContributionId: this.event.employeeGosiContributionId,
    employeeId: this.event.employeeId,
    employeeName: this.event.employeeName,
    employeeNameL: this.event.employeeNameL,
    monthYear: moment(this.event.monthYear).format('YYYY-MM-DD'),
    grossSalary: this.event.grossSalary,
    employerContributionAmount: this.event.employerContributionAmount,
    employeeContributionAmount: this.event.employeeContributionAmount,
    totalContributionAmount: this.event.totalContributionAmount,
    paymentStatusId: this.event.paymentStatusId,
    paymentDate: moment(this.event.paymentDate).format('YYYY-MM-DD'),
    createdBy: this.event.createdBy,
    createdAt: this.event.createdAt,
    updatedBy: this.event.updatedBy,
    updatedAt: this.event.updatedAt,
    operationBy: this.event.operationBy,
    operationCode: this.event.operationCode
  })
}

  clearform1() {
    this.contributionForm.reset();
  }

  saveContribution() {
    this.submitted3 = true;

    console.log(this.contributionForm.value, 'this.EmployeeDetials.value');

    if (this.contributionForm.invalid) {
      return this.toastr.error('Enter Valid Details', 'Failed');
    }

    if (this.contributionForm.value.employeeGosiContributionId == null) {
      this.contributionForm.patchValue({
        operationCode: 'C',
      })

    } else {
      this.contributionForm.patchValue({
        operationCode: 'U',
      })
    }

    console.log('post', this.contributionForm.value);
    // post api 

    this.spinner.show()
    this.http.post(this.serverUrl + 'HRProcess/SetEmployeeGosiContribution', this.contributionForm.value).subscribe((data: any) => {
      console.log(data, 'sdusidj');
      this.spinner.hide()
      this.reloadCurrentRoute()
    })
  }

  ngAfterViewInit() {
    $('#a26').on('change', (event: any) => {
      var selectVal = parseInt(event.target.value);
      console.log(selectVal, 'paymentStatusId');
      //you can use the selected value
      this.contributionForm.get('paymentStatusId')?.setValue(selectVal);
    });
  }


  isNew = true;
  coverId: any = 0
  userloginData: any
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.getEmployee(id);
      this.getEmployeeContractList(id);
      this.getEmployeeContributionList(id);
    }
    this.getmaritalData();
    this.getnationalData();
    this.getcontractData();
  }
}

