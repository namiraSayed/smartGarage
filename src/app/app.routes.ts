import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { RoleComponent } from './role/role.component';
import { MenuComponent } from './menu/menu.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { RoleListComponent } from './role-list/role-list.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationComponent } from './organization/organization.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchFormComponent } from './branch-form/branch-form.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: HeaderComponent,
     children: [
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'dropdown', component: DropdownComponent },
      { path: 'menu-list', component: MenuListComponent},
      { path: 'menu/:id', component: MenuComponent },
      { path: 'menu', component: MenuComponent},
      { path: 'role-list', component: RoleListComponent},
      { path: 'role', component: RoleComponent},
      { path: 'role/:id', component: RoleComponent },
      { path: 'organization-list', component: OrganizationListComponent},
      { path: 'organization', component: OrganizationComponent},
      { path: 'organization/:id', component: OrganizationComponent },
      { path: 'employee-list', component: EmployeeListComponent},
      { path: 'employee', component: EmployeeFormComponent},
      { path: 'employee/:id', component: EmployeeFormComponent },
      { path: 'user-list', component: UserListComponent},
      { path: 'user', component: UserFormComponent},
      { path: 'user/:id', component: UserFormComponent },
      { path: 'branch-list', component: BranchListComponent},
      { path: 'branch', component: BranchFormComponent},
      { path: 'branch/:id', component: BranchFormComponent },

     ],
  },
  // {
  //   path: '',
  //   redirectTo: '/login',
  //   pathMatch: 'full',
  // },
  { path: '**', redirectTo: '/home' },
  { path: '#', redirectTo: '/home' },

  // {
  //     path: 'login',
  //     component: LoginComponent
  // },
  //   {
  //     path: '',
  //     redirectTo: '/app/home',
  //     pathMatch: 'full'
  //   },
  //   { path: '**', redirectTo: '/app/home' },
  //   { path: '#', redirectTo: '/app/home' }
];
