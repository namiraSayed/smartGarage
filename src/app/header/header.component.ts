import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment.development';
declare var $: any;

@Component({
  selector: 'app-header',
  imports: [RouterOutlet, RouterLink, CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);

  imageUrl = environment.imageUrl
 
  allLang:any
  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');
  }

  languageArr = [
    {
      language: 'en',
      country: 'images/flags/1x1/us.svg'
    },
    {
      language: 'ar',
      country: 'images/flags/1x1/sa.svg'
    },
  ]

  // selecLang =  {
  //   language: 'en',
  //   country: 'images/flags/1x1/us.svg'
  // }
  
  // sCountryImage = 'images/flags/1x1/us.svg'
  // // switchLang(lang: any) {
  // //   this.translate.use(lang);
  // //   // this.selecLang = lang
  // //   // this.sCountryImage = lang.country
  // //   this.reloadCurrentRoute()
  // //   console.log(this.translate.store.currentLang, 'changed', this.selecLang)
  // // }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.reloadCurrentRoute()
    console.log(this.translate.store.currentLang, 'changed', lang)
  }
   
reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
  });
}

logout(){
  localStorage.clear();
  this.router.navigate(['login'])
}


// openParent(par:any) {
//   console.log(par, 'par');
//   var animationSpeed = 300;
  
//   // $('#' + par).addClass('active')
//   var $this = $('#' + 'parenta');
//   var checkElement = $this.next();
//   console.log($this, '$(this)', checkElement.is(".treeview-menu"), checkElement );
  

//   if (checkElement.is(".treeview-menu") && checkElement.is(":visible")) {
//     console.log(1, 'rr');
    
//     checkElement.slideUp(animationSpeed, function () {
//       checkElement.removeClass("menu-open");
//     });
//     checkElement.parent("li").removeClass("active");
//   }

//   //If the menu is not visible
//   else if (
//     checkElement.is(".treeview-menu") &&
//     !checkElement.is(":visible")
//   ) {
//     console.log(2, 'rr');
//     //Get the parent menu
//     var parent = $this.parents("ul").first();
//     //Close all open menus within the parent
//     var ul = parent.find("ul:visible").slideUp(animationSpeed);
//     //Remove the menu-open class from the parent
//     ul.removeClass("menu-open");
//     //Get the parent li
//     var parent_li = $this.parent("li");
//     console.log(parent,'parent',ul,parent_li);
    

//     //Open the target menu and add the menu-open class
//     checkElement.slideDown(animationSpeed, function () {
//       //Add the class active to the parent li
//       checkElement.addClass("menu-open");
//       parent.find("li.active").removeClass("active");
//       parent_li.addClass("active");
//     });
//   }
//   //if this isn't a link, prevent the page from being redirected
//   if (checkElement.is(".treeview-menu")) {
//     console.log(3, 'rr');
//     par.preventDefault();
//   }
// }

openParent(menu: any, event: Event) {
  event.stopPropagation();

  // close all other parents
  this.menuChildren.forEach((m: any) => {
    if (m !== menu) m.open = false;
  });

  // toggle the clicked one
  menu.open = !menu.open;
}

openChild(parent: any, child: any, event: Event) {
  event.stopPropagation();

  // close all siblings inside the same parent
  parent.childrenList.children.forEach((c: any) => {
    if (c !== child) c.open = false;
  });

  // toggle the clicked one
  child.open = !child.open;
  console.log(child, 'chils');
  
  if(child.isOpen == false) {
    // console.log('route', child.childrenList.children[0].menuUrl);
    var route = child.childrenList.children[0].menuUrl
    console.log(route, 'adsfdwszdf');
    this.router.navigate([route])
  }
}



selectedMenu(item: any, parent: any, event: Event) {
    event.stopPropagation();

  // close all siblings inside the same parent
  parent.childrenList.children.forEach((c: any) => {
    if (c !== item) c.open1 = false;
  });

  // toggle the clicked one
  item.open1 = !item.open1;
  console.log(item, 'chils');
  console.log('Selected menu:', item, 'Parent:', parent);
  if(item.isOpen1 == false) {
    var route = item.childrenList.children[0].menuUrl
    console.log(route, 'adsfdwszdf');
    this.router.navigate([route])
  }
  // navigate logic here if needed
  // this.router.navigate([item])
  // if(item.isOpen1 == false) {
  //   console.log('route1', item.menuUrl);
  //   if(item.childrenList !== null) {
  //     var route = item.childrenList.children[0].menuUrl
  //     console.log(route, 'adsfdwszdf');
  //     this.router.navigate([item.menuUrl])
  //   }
  // }
}

 trackByIndex(index: number): number {
    return index;
  }

selectedMenu1(subchild:any, item: any, parent: any, event: Event) {
  event.stopPropagation();
  console.log('Selected menu:',subchild, 'sub', item, 'Parent:', parent);
  // navigate logic here if needed
  if(subchild.childrenList == null) {
  this.router.navigate([subchild.menuUrl])

  } else {
    var seleR = subchild.childrenList.children[0]
    console.log(seleR, 'main rote');
    
    this.router.navigate([seleR.menuUrl])
  }
  console.log('route2');
  
}



// openParent(eve:any, parent:any) {
//   // console.log(eve, 'par', parent);
//   this.menuChildren.forEach((ele:any) => {
//     if(ele.appMenuId == parent.appMenuId) {
//       $(`#parent_${ele.appMenuId}`).addClass('active')
    
//     } else {
//       $(`#parent_${ele.appMenuId}`).removeClass('active')
//     }
//   });
  
// }

// selectedSubMenu(child: any, parent: any, eve: any) {

// }

// openSubParent(eve:any, parent:any) {

// }

//   selectedMenu(child: any, parent: any, eve: any, innr: any) {
//     // console.log(child, 'child', parent, eve, 'eve', eve.target);

//     this.menuChildren.forEach((ele: any) => {
//       if ($(`#parent_${ele.appMenuId}`).hasClass("current-page")) {
//         $(`#parent_${ele.appMenuId}`).removeClass('current-page')
//       }
//       if (ele.childrenList !== null) {
//         ele.childrenList.children.forEach((ple: any) => {
//           if ($(`#child_${ple.appMenuId}`).hasClass("active-sub")) {
//             $(`#child_${ple.appMenuId}`).removeClass("active-sub")
//           }
//         });

//       }

//     });

//     setTimeout(() => {
//       $(`#parent_${parent.appMenuId}`).addClass('current-page')
//       $(`#child_${child.appMenuId}`).addClass('active-sub')
//     }, 200)
     
    
//       // this.router.navigate(['/submenu/' + child.menuUrl])

//     // let check = child.menuUrl.includes('?')
//     // console.log(check, 'sdsd');
//     // if (check) {
//     //   var firstUrl = child.menuUrl.split('?')[0];
//     //   var lastUrl = child.menuUrl.split('?')[1];
//     //   console.log(lastUrl, 'true', firstUrl);
//     //   this.router.navigate([`/${firstUrl}`], { queryParams: { p: `${lastUrl}` } });
//     // }
//     // else {
//     //   console.log('rchecdf5sfa', firstUrl);
//     //   this.router.navigate(['/' + child.menuUrl])
//     // }
//   }


  userloginData:any;
  menuAll:any;
  menuChildren:any = [];
  menuNoChild:any = [];
  userInitial:any = '';
  ngOnInit() {
    let userD:any = localStorage.getItem('8FB6N6GSUD')
    let user = JSON.parse(userD);
    this.userloginData = user
    this.userInitial = user.username.charAt(0);
    console.log(this.userloginData, 'userloginData')
    
    let decryptedM:any = localStorage.getItem('YHZEBH8LMD');
    this.menuAll = JSON.parse(decryptedM)
    console.log(this.menuAll, 'menuall');
    // $.sidebarMenu($(".sidebar-menu"));
    this.menuAll.forEach((l: any) => {
      if (l.childrenList?.children.length == 0) {
        this.menuNoChild.push(l)
      } else {
        l.open = false
        l.isOpenMain = true
        l.childrenList?.children.forEach((l1: any) => {
          if (l1.childrenList !== null) {
            // l1.isOpen = true
           
             var fil = l1.childrenList.children.filter((obj:any) => obj.isDisplay == false);
                if(fil.length == 0) {
                   l1.isOpen = true
                } else {
                  l1.isOpen = false
                }
            l1.childrenList?.children.forEach((l2: any) => {
                l2.open1 = false
              if (l2.childrenList !== null) {
                var fil2 = l2.childrenList.children.filter((obj:any) => obj.isDisplay == false)
                if(fil2.length !== 2) {
                   l2.isOpen1 = true
                } else {
                  l2.isOpen1 = false
                }
              } else {
                l2.isOpen1 = false
              }
            });
          } else {
            l1.isOpen = false
          }

        });
        this.menuChildren.push(l)
      }
    });
    console.log(this.menuNoChild, 'menuNoChildmenuChildren', this.menuChildren);

  }

}
