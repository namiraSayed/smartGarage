import { Component, inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { _, TranslatePipe } from '@ngx-translate/core';

declare var $: any;

interface RoleNode {
  appMenuId: number;
  id: number;
  name: string;
  checked?: boolean;
  indeterminate?: boolean;
  expanded?: boolean;
  children?: RoleNode[];
  hasChildren?: boolean;
  childrenList?: { children?: RoleNode[] };
}


interface TreeNode {
  id: number;
  name: string;
  children?: TreeNode[];
  expanded?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  visible?: boolean;
}
@Component({
  selector: 'app-role',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe, FormsModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
 
  searchText = '';

  selectedItems: TreeNode[] = [];
  
  appMenu: any
  menuItems:any =[]
  getMenu() {
    this.http.get(this.serverUrl + "UserProcess/GetAppMenuHierarchyAll").subscribe((result: any) => {
      this.appMenu = result.data.appMenu;
      console.log( this.appMenu);
      
      var menuArr:any = []
      result.data.appMenu.forEach((l1:any) => {
        l1.id = l1.appMenuId,
        l1.name = l1.name,
        l1.expanded = false,
        l1.checked = false,
        l1.indeterminate = false,
        l1.visible = true
        menuArr.push(l1)
      });
      console.log(menuArr, 'menuArr');
      this.menuItems = menuArr
      this.tree = this.convertToTree(menuArr);
      setTimeout(() => {
        console.log(this.tree,'treeee');
        
        this.applyPreSelection(this.tree);
      }, 900)
      console.log(this.tree, 'this.tree');
      
      
    })
  }
  convertToTree(nodes: any[]): TreeNode[] {
  return nodes.map(n => ({
    id: n.appMenuId,
    name: n.name,
    expanded: false,
    checked: false,
    indeterminate: false,
    visible: true,
    children: n.childrenList?.children
      ? this.convertToTree(n.childrenList.children)
      : undefined
  }));
}

tree: TreeNode[] = [];

// tree: TreeNode[] = [
//   {
//     id: 1, name: 'Parent 1', expanded: false, visible: true, children: [
//       {
//         id: 11, name: 'Child 1.1', visible: true, children: [
//           {
//             id: 111, name: 'Sub Child 1.1.1', visible: true, children: [
//               {
//                 id: 1111, name: 'Level 4 - A', visible: true, children: [
//                   { id: 11111, name: 'Level 5 - A1', visible: true },
//                   { id: 11112, name: 'Level 5 - A2', visible: true }
//                 ]
//               },
//               {
//                 id: 1112, name: 'Level 4 - B', visible: true, children: [
//                   { id: 11121, name: 'Level 5 - B1', visible: true }
//                 ]
//               }
//             ]
//           },
//           { id: 112, name: 'Sub Child 1.1.2', visible: true }
//         ]
//       },
//       {
//         id: 12, name: 'Child 1.2', visible: true, children: [
//           {
//             id: 121, name: 'Sub Child 1.2.1', visible: true, children: [
//               {
//                 id: 1211, name: 'Level 4 - C', visible: true, children: [
//                   { id: 12111, name: 'Level 5 - C1', visible: true },
//                   { id: 12112, name: 'Level 5 - C2', visible: true }
//                 ]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: 2, name: 'Parent 2', expanded: false, visible: true, children: [
//       {
//         id: 21, name: 'Child 2.1', visible: true, children: [
//           {
//             id: 211, name: 'Sub Child 2.1.1', visible: true, children: [
//               {
//                 id: 2111, name: 'Level 4 - D', visible: true, children: [
//                   { id: 21111, name: 'Level 5 - D1', visible: true }
//                 ]
//               }
//             ]
//           }
//         ]
//       },
//       {
//          id: 21, name: 'Child 2.1', visible: true,
//       }
//     ]
//   }
// ];


  //------------------------------------------------------
  // CHECK / UNCHECK HANDLING
  //------------------------------------------------------
  toggleCheck(node: TreeNode, parent?: TreeNode) {
    const newState = !node.checked;

    node.checked = newState;
    node.indeterminate = false;

    this.updateSelected(node);

    // update child tree
    this.updateChildren(node, newState);

    // update parent tree
    this.updateParent(parent);
  }

  updateChildren(node: TreeNode, checked: boolean) {
    if (!node.children) return;

    node.children.forEach(child => {
      child.checked = checked;
      child.indeterminate = false;
      this.updateSelected(child);
      this.updateChildren(child, checked);
    });
  }

  updateParent(parent?: TreeNode) {
    if (!parent || !parent.children) return;

    const total = parent.children.length;
    const checkedCount = parent.children.filter(c => c.checked).length;
    const indeterminateCount = parent.children.filter(c => c.indeterminate).length;

    if (checkedCount === total) {
      parent.checked = true;
      parent.indeterminate = false;
    }
    else if (checkedCount === 0 && indeterminateCount === 0) {
      parent.checked = false;
      parent.indeterminate = false;
    }
    else {
      parent.checked = false;
      parent.indeterminate = true;
    }

    this.updateSelected(parent);
    this.updateParent(this.findParent(this.tree, parent));
  }
  

  //------------------------------------------------------
  // FIND PARENT
  //------------------------------------------------------
  findParent(tree: TreeNode[], child: TreeNode, parent?: TreeNode): TreeNode | undefined {
    for (let node of tree) {
      if (node === child) return parent;
      if (node.children) {
        const found = this.findParent(node.children, child, node);
        if (found) return found;
      }
    }
    return undefined;
  }

  //------------------------------------------------------
  // SELECTED ITEMS ARRAY MANAGEMENT
  //------------------------------------------------------
  selectedItemId:any  = []
  dselectedItems:any  = []
  updateSelected(node: any) {
    if (node.checked) {
      if (!this.selectedItems.find(x => x.id === node.id)) {
        node.crud = 'C'
        this.selectedItems.push(node);
        this.selectedItemId.push(node.id)
      }
    } else {
        // node.crud = 'D'
      this.selectedItems = this.selectedItems.filter(x => x.id !== node.id);
      this.selectedItemId = this.selectedItemId.filter((x:any) => x !== node.id);
      // this.dselectedItems.push(node)
    }
    
    
  }

  //------------------------------------------------------
  // SEARCH FILTER
  //------------------------------------------------------
  applySearch() {
    const txt = this.searchText.toLowerCase();
    this.filterTree(this.tree, txt);
  }

  filterTree(nodes: TreeNode[], text: string): boolean {
    let found = false;

    nodes.forEach(node => {
      const selfMatch = node.name.toLowerCase().includes(text);
      let childMatch = false;

      if (node.children) {
        childMatch = this.filterTree(node.children, text);
      }

      node.visible = selfMatch || childMatch;

      if (childMatch) node.expanded = true;
      if (node.visible) found = true;
    });

    return found;
  }

  //------------------------------------------------------
  // EXPAND / COLLAPSE
  //------------------------------------------------------
  toggleExpand(node: TreeNode) {
    if (!node.children) return;
    node.expanded = !node.expanded;
  }

  preSelectedIds: number[] = [];  // put your selected menu IDs here
applyPreSelection(nodes: TreeNode[]) {
  for (const node of nodes) {
    if (this.preSelectedIds.includes(node.id)) {
      node.checked = true;
      this.updateSelected(node)
    }

    if (node.children) {
      this.applyPreSelection(node.children);

      // If children are checked → update parent
      const allChecked = node.children.every(c => c.checked);
      const someChecked = node.children.some(c => c.checked || c.indeterminate);

      node.checked = allChecked;
      node.indeterminate = !allChecked && someChecked;

      // Expand parent if any child is selected
      if (someChecked) {
        node.expanded = true;
      }
    }
  }
}










  selectedRoleIds: any[] = [];
  selectedItemParentId: any[] = [];

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toster = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute)

  serverUrl = environment.baseUrl;
  submitted = false;

  role = this.fb.group({
    appRoleId: [],
    roleName: ['', Validators.required],
    roleName1: ['', Validators.required],
    description: [''],
    parentId: [],
    isActive: [true],
    createdBy: [null],
    createdAt: [null],
    updatedBy: [null],
    updatedAt: [null],
    operationBy: [null],
    operationCode: [''],
    appRoleMenuList: this.fb.group({
      appRoleMenu: this.fb.control([])  // FormControl holding an array
    }),
  })

  get f() {
    return this.role.controls;
  }

  editmaster: any
  editrolemenu: any
  editData: any;
  menugetall: any;
  editMode: boolean = false;
  editModeACLDetials: boolean = false;
  appRoleMenuIds: any = [];
  getRoleList(id: any) {
    this.spinner.show();
    return this.http.get(this.serverUrl + "UserProcess/GetAppRole/" + id).subscribe((result: any) => {
      console.log(this.selectedRoleIds,'selectedRoleIds');
      
      this.editmaster = result.data;
      this.editData = result.data;
      
      this.spinner.hide();
      this.editMode = true;
      let that = this
      this.role.patchValue(
        {
          appRoleId: this.editmaster.appRoleId,
          roleName: this.editmaster.roleName,
          roleName1: this.editmaster.roleName1,
          description: this.editmaster.description,
          appRoleMenuList: this.editmaster.appRoleMenuList,
          createdBy: this.editmaster.createdBy,
          updatedBy: this.editmaster.updatedBy,
          updatedAt: this.editmaster.updatedAt,
          operationBy: this.editmaster.operationBy,
          operationCode: this.editmaster.operationCode,
          parentId: this.editmaster.parentId,
        })
        
    
      if(this.editmaster.appRoleMenuList){
        this.editmaster.appRoleMenuList.appRoleMenu.forEach((theMenuSelected: any) => {
          this.selectedRoleIds.push(theMenuSelected.appMenuId)
          this.appRoleMenuIds.push(theMenuSelected)
        });
      }
      this.preSelectedIds = this.selectedRoleIds
      // var preSelectedMenu:any = []
      // if(this.preSelectedIds) {
      //   this.preSelectedIds.forEach((p:any) => {
      //     var hop = this.menuItems.filter((obj:any) => obj.id == p)
      //     if(hop.length !== 0) {
      //       preSelectedMenu.push(hop[0])
      //     }
      //   });
      // }
      console.log(this.preSelectedIds, 'preSelectedIds', this.selectedRoleIds, 'preSelectedMenu', 'menuItems', this.menuItems);
      
    })
  }
  existMenuId: any = [];
  selArray: any = [];
  selParentIds: any = [];
  mm: any;
  edit: any;
  formSubmit: any
  finalData: any;
  roleresponse: any;
  menuToRoleMenuId: any;
  submitRole() {
    this.submitted = true;

    if (this.role.invalid) {
      return this.toster.error('invalid form data');
    }

    console.log(this.selectedItems);
    
    let a = this.selectedItemId;
    let b = this.preSelectedIds;
    let s = new Set(a);

    let a1 = [...s]

    var saveObj = []
    
    a1.forEach((p1: any) => {
      var roleMenuObj = {
        appRoleMenuId: null,
        appRoleId: this.role.value.appRoleId,
        appMenuId: p1,
        isActive: true,
        createdBy: null,
        createdAt: null,
        updatedBy: null,
        updatedAt: null,
        operationBy: null,
        operationCode: 'C'
      }
     
      var finn = this.appRoleMenuIds.filter((men: any) => men.appMenuId == p1)
      if (finn.length !== 0) {
        roleMenuObj.appRoleMenuId = finn[0].appRoleMenuId
        roleMenuObj.operationCode = 'U'
      }
      
      this.selArray.push(roleMenuObj)
    });
    const missingInJ = b.filter(x => !a.includes(x));
    console.log(missingInJ, 'missingInJ');
    
    missingInJ.forEach((m:any) => {
        var finn = this.appRoleMenuIds.find((men: any) => men.appMenuId == m)
      if (finn.length !== 0) {
        finn.operationCode = 'D'
        this.selArray.push(finn)
      }
    });
    console.log(this.selArray, 'selArrayw');
    


    // this.selectedRoleIds = [...new Set(this.selectedRoleIds)];

    // if (this.appRoleMenuIds) {
    //   this.appRoleMenuIds.forEach((theParId: any) => {
    //     if (theParId !== null) {

    //       const exists = this.selArray.some((x:any) => x.appMenuId === theParId);

    //       console.log(theParId,'theParId');

    //       if (!exists) {
    //         var finalitem = {
    //           appRoleMenuId: theParId.appRoleMenuId,
    //           appRoleId: this.role.value.appRoleId,
    //           appMenuId: theParId.appMenuId,
    //           isActive: true,
    //           createdBy: null,
    //           createdAt: null,
    //           updatedBy: null,
    //           updatedAt: null,
    //           operationBy: null,
    //           operationCode: 'U'
    //         }

    //         this.selArray.push(finalitem);
    //       }
    //     }
    //   });
    // }

   setTimeout(() => {
     this.role.patchValue({
      appRoleMenuList: {
        appRoleMenu: this.selArray
      }
    })

    if (this.role.value.appRoleId == null) {
      this.role.patchValue({
        operationCode: 'C',
      })
    } else {
      this.role.patchValue({
        operationCode: 'U',
      })
    }
    console.log(this.role.value, 'roleform');
    this.spinner.show()
    this.http.post(this.serverUrl + 'UserProcess/SetAppRole', this.role.value).subscribe((data: any) => {
      console.log(data);
      this.roleresponse = data
      this.toster.success(data.message, 'Saved Successfully')
      this.spinner.hide()
      // this.reloadCurrentRoute()
      this.router.navigate(['/role-list'])
    })
   }, 300)
  }

  roleData: any;
  getRole(id: any) {
    this.spinner.show();
    return this.http.get(this.serverUrl + "UserProcess/GetAppRole/" + id).subscribe((data: any) => {
      this.roleData = data.appRole;
      this.spinner.hide();
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  // toggleExpand(node: RoleNode) {
  //   node.expanded = !node.expanded;

  //   if (node.expanded && !node.children && node.childrenList?.children?.length) {
  //     node.children = node.childrenList.children;
  //   }
  // }

  onCheckboxChange(node: RoleNode) {
    // this.toggleNode(Event);
    this.updateParentStates(this.appMenu);
    this.selectedRoleIds = this.getSelectedIds(this.appMenu);
  }

  selectedItem: any = [];
  toggleNode(event: any, item: any, selectedRoleIds: any[]) {

  const menuId = item.appMenuId;

  const isOld = this.selectedRoleIds.includes(menuId);

  console.log(isOld,'isOld');

  const existing = this.selArray.find((x: any) => x.appMenuId === menuId);

  if (event.target.checked === true) {

    if (!isOld && !existing) {
      const finalItem = {
        appRoleMenuId: null,
        appRoleId: this.role.value.appRoleId,
        appMenuId: menuId,
        isActive: true,
        createdBy: null,
        createdAt: null,
        updatedBy: null,
        updatedAt: null,
        operationBy: null,
        operationCode: 'C'
      };

      this.selArray.push(finalItem);
      console.log("CREATE:", finalItem);
      return;
    }

  }

  if (event.target.checked === false) {

    this.appRoleMenuIds.forEach((element:any) => {
      
    if (isOld) {

      this.selArray = this.selArray.filter((x:any) => x.appMenuId !== menuId);
          const finalItem = {
            appRoleMenuId: element.appRoleMenuId,
            appRoleId: this.role.value.appRoleId,
            appMenuId: menuId,
            isActive: true,
            createdBy: null,
            createdAt: null,
            updatedBy: null,
            updatedAt: null,
            operationBy: null,
            operationCode: 'D'
          };
          this.selArray.push(finalItem);
          console.log("DELETE:", finalItem);
          return;
      }
    });

    if (!isOld) {
      this.selArray = this.selArray.filter((x: any) => x.appMenuId !== menuId);
      console.log("REMOVED NEW ITEM:", menuId);
      return;
    }
  }
  }


  toggleChildren(children: any[], isChecked: boolean) {
    for (let child of children) {
      const idx = this.selectedRoleIds.indexOf(child.appMenuId);
      if (isChecked && idx === -1) {
        this.selectedRoleIds.push(child.appMenuId);
      } else if (!isChecked && idx > -1) {
        this.selectedRoleIds.splice(idx, 1);
      }
      if (child.children?.length > 0) {
        this.toggleChildren(child.children, isChecked);
      }
    }
  }

  updateParentStates(nodes: RoleNode[]) {
    nodes.forEach(node => {
      if (node.children && node.children.length) {
        this.updateParentStates(node.children);
        const allChecked = node.children.every(c => c.checked);
        const noneChecked = node.children.every(c => !c.checked && !c.indeterminate);
        node.checked = allChecked;
        node.indeterminate = !allChecked && !noneChecked;
      }
    });
  }

  getSelectedIds(nodes: RoleNode[]): number[] {
    const ids: number[] = [];
    const traverse = (arr: RoleNode[]) => {
      arr.forEach(n => {
        if (n.checked) ids.push(n.appMenuId);
        if (n.children) traverse(n.children);
      });
    };
    traverse(nodes);
    return ids;
  }

  hasChildren(node: RoleNode): boolean {
    return !!(node.childrenList?.children?.length || node.children?.length);
  }


  roleAclData:any = []

  getRoleAcl() {
    this.http.get(this.serverUrl + "UserProcess/GetAppACLAll").subscribe((data:any) => {
      this.roleAclData = data.data.acl

      this.getControl()
    })
  }

  controlData:any
  getControl() {
    this.http.get(this.serverUrl + 'UserProcess/GetAppControlAll').subscribe((ctrlD:any) => {
      this.controlData = ctrlD.data.appControl
    })
  }

  roleacl = this.fb.group({
    appACLId: [null],
    appRoleId: [null],
    appMenuId: [null],
    appControlId: [null],
    appPrivilegeId: [null],
    isActive: [false]
  })



  editAcl(eacl:any) {
    console.log(eacl);
    
  }


  menuTreeData: any;
  par: any;
  roleArr: any;
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.par = id;
    this.getMenu();
    if (id) {
      setTimeout(() => {
      this.spinner.show();
     this.http.get(this.serverUrl + "UserProcess/GetAppRole/" + id).subscribe((result: any) => {
      console.log(this.selectedRoleIds,'selectedRoleIds');
      
      this.editmaster = result.data;
      this.editData = result.data;
      
      this.spinner.hide();
      this.editMode = false;
      let that = this
      this.role.patchValue(
        {
          appRoleId: this.editmaster.appRoleId,
          roleName: this.editmaster.roleName,
          roleName1: this.editmaster.roleName1,
          description: this.editmaster.description,
          appRoleMenuList: this.editmaster.appRoleMenuList,
          createdBy: this.editmaster.createdBy,
          updatedBy: this.editmaster.updatedBy,
          updatedAt: this.editmaster.updatedAt,
          operationBy: this.editmaster.operationBy,
          operationCode: this.editmaster.operationCode,
          parentId: this.editmaster.parentId,
        })
        
    
      if(this.editmaster.appRoleMenuList){
        this.editmaster.appRoleMenuList.appRoleMenu.forEach((theMenuSelected: any) => {
          this.selectedRoleIds.push(theMenuSelected.appMenuId)
          this.appRoleMenuIds.push(theMenuSelected)
        });
      }
      this.preSelectedIds = this.selectedRoleIds
      
      console.log(this.preSelectedIds, 'preSelectedIds', this.selectedRoleIds, 'preSelectedMenu', 'menuItems', this.menuItems);
      this.getRoleAcl()
    })

      }, 500)
    }
    $('.select5').select2();
    $('.select6').select2();
    $('.select7').select2();

  }
}


