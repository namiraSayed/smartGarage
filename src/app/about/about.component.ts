import { Component, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [RouterLink, AutocompleteLibModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  serverUrl = environment.baseUrl
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
   ) {}
   toastr = inject(ToastrService)
   spinner = inject(NgxSpinnerService)
   router = inject(Router)
  pdata:any

  btnNewT() {
     const url = this.router.serializeUrl(
          this.router.createUrlTree(['/new-window-component'])
        );
        window.open(url, 'abcd');
    //  window.open('/new-window-content', '_blank'); // _blank opens in a new tab/window
  }
  btnNewT1() {
     const url = this.router.serializeUrl(
          this.router.createUrlTree(['/mis-sale-order'])
        );
        window.open(url, 'abcd');
  }

  btnClick() {
    console.log('wrsdf');
    this.spinner.show()
    this.http.get(this.serverUrl + "payertype/getall").subscribe((data: any) => {
      this.pdata = data.data
      console.log(this.pdata, 'pdata');
      setTimeout(()=> {
        this.spinner.hide()
      }, 1000)
      this.toastr.success('Hello world!', 'Toastr fun!');
    })
  }

  today: number = Date.now();
  keyword = 'insuranceName';
  errorMsg: any = '';
  isLoadingResult:any = false;
  searchedValue: any;
  selectedContact: any
  contactData: any
  getServerResponse(event: any) {

    if(event.length == 0) {
      this.searchCleared()
    } else {
      this.spinner.show();
      this.searchedValue = event;
      this.isLoadingResult = true;
      return this.http.get(this.serverUrl + "InsuranceProcess/GetInsuranceSearchBy/" + event + "/0/1000").subscribe((data: any) => {
        this.spinner.hide();
        if (data.data.length == 0) {
          this.contactData = [];
          this.errorMsg = data['Error'];
        } else {
          this.contactData = data.data.insuranceList.insurance;
        }
        this.isLoadingResult = false;
  
      })
    }
   
  }

  searchCleared() {
    this.contactData = [];
  }

  selectEvent(item:any) {
    // do something with selected item
    console.log(item,'sfzdx');
    this.selectedContact = item
    
  }
  
  onFocused(e:any){
    // do something when input is focused
  }

  ngOnInit(): void {
    console.log(this.serverUrl, 'serverUrl');
    
  }
}
