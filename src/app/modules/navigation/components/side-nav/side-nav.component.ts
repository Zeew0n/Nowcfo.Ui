import { Component, EventEmitter, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { Router } from '@angular/router';
import { MergeScanSubscriber } from 'rxjs/internal/operators/mergeScan';
import { MenuModel } from 'src/app/models/menu.model';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./sidebar.scss'],
})
export class SideNavComponent implements OnInit {
  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {}

  expandOrgNav = false;

  menus: MenuModel[] = [];

  // employees:EmployeeModel[];
  employees: any[] = [];

  items: TreeviewItem[] = [];

  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 400,
  });

  ngOnInit() {
    this.getSideMenus();
  }

  getSideMenus(){
    this.navigationService.getAssignedMenus()
    .subscribe(
      (res) => {
        this.menus = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  toggleOrganizationNav(menu: MenuModel) {
    const menuName = menu.menuName.trim().toLowerCase();
    const mainTag = document.getElementById('mainTag') as any;
    if (menuName === 'organization') {
      this.expandOrgNav = !this.expandOrgNav;
      this.getOrganizatioNavigation();
      this.router.navigateByUrl(menu.navigateUrl);
      if (!mainTag.classList.contains('main-content-slide')) {
        mainTag.classList.add('main-content-slide');
      } else {
        mainTag.classList.remove('main-content-slide');
      }
    }
    else{
      this.expandOrgNav = false;
      mainTag.classList.remove('main-content-slide');
    }
    this.router.navigateByUrl(`${menu.navigateUrl}?menuId=${menu.id}`);
  }

  collapseNavigationTree(){
    this.expandOrgNav = false;
    document.getElementById('mainTag').classList.remove('main-content-slide');
  }

  getOrganizatioNavigation() {
    this.navigationService.getOrganizationNavigation().subscribe(
      (res: TreeviewItem[]) => {
        this.items.length = 0;
        res.forEach((data) => {
          const item = new TreeviewItem({
            text: data.text,
            value: data.value,
            collapsed: true,
            children: data.children,
          });
          this.items.push(item);
          console.log('Data', this.items);
        });
      },
      (error) => console.error(error)
    );
  }

  onValueChange(orgId) {
    this.router.navigateByUrl(`organization-information/${orgId}`);
    // const data = this.items.find((x) => x.value === orgId);
    // if (data) {
    //   this.items.find((x) => x.value === orgId).collapsed = !data.collapsed;
    //   console.log(orgId);
    // }
    // debugger;
    //  this.navigationService.getEmployeesByOrganizationId(orgId).subscribe(
    //   (res)=>{
    //     this.employees = res
    //   },(err)=>{

    //   }
    // );
  }
}
