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
  selector: 'app-country-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './country-form.component.html',
  styleUrl: './country-form.component.css'
})
export class CountryFormComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  serverUrl = environment.baseUrl;
  submitted = false;
  now = new Date();
  countryform = this.fb.group({
    countryId: [null],
    code: ['', Validators.required],
    waseelCode: [''],
    currencyCode: [null],
    name: ['', Validators.required],
    nameL: [''],
    nationality: ['', Validators.required],
    nationalityL: [''],
    cssClass: [''],
    createdBy: [null],
    createdAt: [null],
    updatedBy: [null],
    updatedAt: [null],
    operationBy: [null],
    operationCode: [''],
  });

  event: any;
  editMode: boolean = false;
  isFormDisabled: boolean = false;
  getcountry(id: any) {
    this.spinner.show();
    this.http.get(this.serverUrl + 'MasterProcess/GetCountry/' + id).subscribe((data: any) => {
        const editData = data.data;
        this.event = data.data;
        this.editMode = true;
        console.log(this.event, 'this.event');

        this.countryform.patchValue({
          countryId: editData.countryId,
          code: editData.code,
          waseelCode: editData.waseelCode,
          currencyCode: editData.currencyCode,          
          name: editData.name,
          nameL: editData.nameL,
          nationality: editData.nationality,
          nationalityL: editData.nationalityL,
          cssClass: editData.cssClass,
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
  
  editData: any;
  edit: any;
  saveForm() {
    this.submitted = true;
    if (this.countryform.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    if (this.countryform.value.countryId == null) {
      this.countryform.patchValue({
        operationCode: 'C',
      });
    } else {
      this.countryform.patchValue({
        operationCode: 'U',
      });
    }
    console.log(this.countryform.value, 'wrdf');
    this.spinner.show();
    this.http.post(this.serverUrl + 'MasterProcess/SetCountry',this.countryform.value).subscribe((data: any) => {
        console.log(data);
        this.toastr.success(data.message, 'Saved Successfully');
        this.spinner.hide();
        this.router.navigate(['/country-list']);
      });
  }

  isNew = true;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.getcountry(id);
    }
  }
}
