import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from '../environments/environment.development';
import { TranslateModule } from '@ngx-translate/core';
import { routes } from './app.routes';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NgxSpinnerModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {



  title = 'HMS-Angular2.0';
  appUrl = "http://183.82.146.49/HMSAPI/API/"
  constructor(
    private router: Router,
  ) {

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkLogin()
        this.checkMenu()
        // this.checkAcl()
      }
   });

  }

  checkLogin() {    
    // console.log(localStorage.getItem('8FB6N6GSUD'), 'sdafasdf')
    
    if(this.router.url != "/login")
    {
      if(!localStorage.getItem('8FB6N6GSUD'))
      {
        alert("Please Login to Continue....")
        localStorage.clear();
        this.router.navigate(['login'])
      }
    }
  }

  aclAllowed:any = [];
  checkAcl() {
    this.aclAllowed = [];
    var menuAllowed = 0
    var mday: any = localStorage.getItem('YHZEBH8LMD')
    var MD = JSON.parse(mday)
    console.log(MD, 'MD');
    var tempUrl = this.router.url.replace("/","")
    if (MD) {
      MD.forEach((l: any) => {
        l.childrenList?.children.forEach((m:any) => {
          if(m.menuUrl == tempUrl) {
              menuAllowed = 1;
              if (m.acl.length) {
                m.acl.forEach((el: any) => {
                  if (el.isActive) {
                    this.aclAllowed.push(el.appControlCode)
                  }
                });
              }
          }
        });
        
      });

    }
    console.log(this.aclAllowed, 'aclAllowedaclAllowed');

  }

  currParentMenu:any
  checkMenu() {  
      console.log(this.router.url, 'sfdzfc');
       
    // this.aclAllowed = []; 
    // if(this.router.url != "/login" && this.router.url != "/app/dashboard" && this.router.url != "/room-screen")
    // {
    //   var menuAllowed = 0 
    //   var mday:any = localStorage.getItem('YHZEBH8LMD')
    //   var MD = JSON.parse(mday)
    //   var tempUrl = this.router.url.replace("/","");
    //   var tempUrl = tempUrl.replace("?p=","?"); 
    //   debugger
      
    //   /*if(tempUrl.lastIndexOf("?")>0)
    //   {
    //     tempUrl = tempUrl.substring(0,tempUrl.lastIndexOf("?"))
    //   }*/
    //   // if(tempUrl.lastIndexOf("/")>0)
    //   // {
    //   //   var temtempUrl = tempUrl.substring(0,tempUrl.lastIndexOf("/"))
    //   //   if(temtempUrl.includes('/')) {
    //   //     tempUrl = temtempUrl.substring(0,temtempUrl.lastIndexOf("/"))
    //   //   } else {
    //   //     tempUrl = temtempUrl
    //   //   }
    //   // }
    //   if(tempUrl.lastIndexOf("/")>0)
    //     {
    //       tempUrl = tempUrl.substring(0,tempUrl.lastIndexOf("/"))
    //     }
    //     console.log(tempUrl, 'tempUrl', MD);
      
    //     if(this.router.url != "/room-screen") {
    //       menuAllowed=1
    //     }
    //   if(MD)
    //   {
    //     MD.forEach((l:any) => {
    //       var mAllowed = l.children.find((obj:any) => obj.menuUrl == tempUrl);
    //       console.log(mAllowed, 'mAllowed');
          
    //       if(mAllowed) {
    //         menuAllowed=1;
    //         if(mAllowed.acl.length) {
    //         mAllowed.acl.forEach((el:any) => {
    //           if(el.isActive) {
    //             // this.aclAllowed.push(el.appControlCode)
    //           }
    //         });
    //         }
    //       }
    //     });

    //   }
    //   console.log(this.aclAllowed, 'aclAllowedaclAllowed');
      
 
    //   if(this.router.url.lastIndexOf("/policyMaster")>0 || this.router.url.lastIndexOf("/cltoResultPrint")>0)
    //   {
    //     menuAllowed=1
    //   }
      
    //   if(menuAllowed == 0)
    //   {
    //     alert("Not Allowed")
    //     this.router.navigate(['home'])        
    //   }
      
    // }
  }


}

// bootstrapApplication(AppComponent, {
//   providers: [
//     { provide: LocationStrategy, useClass: HashLocationStrategy },
//   ],
// }).catch((err) => console.error(err));
