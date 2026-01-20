import { Component, inject, Inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  serverUrl = environment.baseUrl
  userEnKey = environment.encryptKey.userKey
  menuEnKey = environment.encryptKey.menuKey

  otherBrUrl = environment.otherBrUrl
  otherBrSfu = environment.otherBrSfu

  submitted = false;

  http = inject(HttpClient)
  router = inject(Router)
  toastr = inject(ToastrService)
  // constructor(
  //   private http: HttpClient,
  //   private router: Router
  // ) { }

  loginObj = {
    "userName": "admin",
    "passWord": "pass123",
  }
  hasMultiBranch = true
  loginData:any
  sValue:any = [];
  loginBtn() {
    console.log(this.loginObj, 'obj');
    var objLog: any = this.loginObj
    if (this.hasMultiBranch == true) {
      objLog.branchUnitId = this.currentSfuId
      console.log('again');
      
    } else {
      objLog.branchUnitId = null
    }
    this.http.post(this.serverUrl + 'UserProcess/GetAppUserLogin', objLog).subscribe((result: any) => {
      if (result.appUser) {
        this.loginData = result.appUser
        this.hasMultiBranch == false
        this.currentSfuId = 0
        if (result.appUser) {
           var ubranchId = 0
          if (this.loginData.appUserBranchUnitList !== null) {
            ubranchId = this.loginData.appUserBranchUnitList?.appUserBranchUnit[0]?.branchId;
            this.sValue = this.loginData.appUserBranchUnitList?.appUserBranchUnit
          }
          else {
           return this.toastr.error("Please Contact Admin", 'Set Branch')
          }


          if (this.loginData.jwtAuthResult == null) {
            console.log('show modal');
            $('#loginModal').modal('show');
            console.log(this.loginData?.appUserBranchUnitList[0]?.appUserBranchUnit, "this.loginData.sfu.sfuId");
          } else {
            console.log('data prsent')
            let key = 'XLDI7PNGLTN';
            let value = this.loginData.jwtAuthResult?.accessToken;
            localStorage.setItem(key, value);

            let obj = this.loginData.appMenuList?.appMenu;
            const envryptedObject = JSON.stringify(obj);
            localStorage.setItem('YHZEBH8LMD', envryptedObject.toString());
            if (this.loginData) {
              let userD = this.loginData
              delete userD.appMenuList;
              delete userD.jwtAuthResult;
              userD.branchId = ubranchId
              if(userD.appUserBranchUnitList?.appUserBranchUnit) {
                userD.branchUnitId = userD.appUserBranchUnitList?.appUserBranchUnit[0]?.branchUnitId
              }
              console.log(userD, 'userDD');

              let obj = userD;
              const envryptedObject = JSON.stringify(obj);
              localStorage.setItem('8FB6N6GSUD', envryptedObject.toString());
            } else {
              this.toastr.error('u r not a employee')
            }

            this.router.navigate(['/home']);
          }

          console.log(this.loginData, 'logindata check in api')
        } else {
          this.toastr.error(result.message)
        }

      }
      console.log(result, 'dddd');

    })
  }

  modalClear(){
    this.sValue=[]
  }
  sfuarr:any
  currentSfuId:any
  CurrentSfu(id:any){
    this.sValue=[]
    console.log(id, 'id');
    this.sValue = []
    // this.loginForm.patchValue({sfuId:id})
    this.currentSfuId = id
    this.hasMultiBranch = true
    this.loginBtn()
  
    $('#loginModal').modal('hide');
  
  }

}
