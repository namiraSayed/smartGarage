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
  selector: 'app-organization',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.css'
})
export class OrganizationComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  serverUrl = environment.baseUrl;
  submitted = false;
  now = new Date();
  orgform = this.fb.group({
    organizationId: [null],
    code: ['', Validators.required],
    name: ['', Validators.required],
    nameL: ['', Validators.required],
    address: [null],
    imagePath: [null],
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
  getorglist(id: any) {
    this.spinner.show();
    this.http.get(this.serverUrl + 'MasterProcess/GetOrganization/' + id).subscribe((data: any) => {
        const editData = data.data;
        this.event = data.data;
        this.editMode = true;
        console.log(this.event, 'this.event');

        this.orgform.patchValue({
          organizationId: editData.organizationId,
          code: editData.code,
          name: editData.name,
          nameL: editData.nameL,
          address: editData.address,
          imagePath: editData.imagePath,
          createdBy: editData.createdBy,
          createdAt: editData.createdOn,
          updatedBy: editData.modifiedBy,
          updatedAt: editData.modifiedOn,
          operationBy: editData.modifiedOn,
          operationCode: editData.modifiedOn,
        });
        this.spinner.hide();
      });
  }

  editData: any;
  edit: any;

  saveForm() {
    this.submitted = true;
    if (this.orgform.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    if (this.orgform.value.organizationId == null) {
      this.orgform.patchValue({
        operationCode: 'C',
      });
    } else {
      this.orgform.patchValue({
        operationCode: 'U',
      });
    }
    console.log(this.orgform.value, 'wrdf');
    this.spinner.show();
    this.http.post(this.serverUrl + 'MasterProcess/SetOrganization',this.orgform.value).subscribe((data: any) => {
        console.log(data);
        this.toastr.success(data.message, 'Saved Successfully');
        this.spinner.hide();
        this.router.navigate(['/organization-list']);
      });
  }

  isNew = true;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.getorglist(id);
    }
  }
}
