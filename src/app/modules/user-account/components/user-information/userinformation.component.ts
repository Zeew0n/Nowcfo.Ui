import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  NgForm,
} from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModel } from 'src/app/models/role.model';
import { UserInformationModel } from 'src/app/models/userinformation.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserInformationService } from '../../services/userinformation.service';
import AuthenticationService from '../../services/authentication.service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-userinformation-list',
  styleUrls: ['userinformation.component.scss'],
  templateUrl: './userinformation.component.html',
})
export class  UserInformationComponent implements OnInit{
  userinformation: UserInformationModel = new UserInformationModel();
  userinformations: UserInformationModel[];
  roles: RoleModel[];

  isSubmitting: boolean; // Form submission variable
  closeResult = ''; // close result for modal
  submitted = false;
  userId = '';
  isEdit = false;
  isUpdate = false;
  selectuserinformation;
  disableSelect = false;
  isEmailExists=false;
  isUsernameExists=false;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private userInformationService: UserInformationService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private loader: NgxUiLoaderService,
    private location: Location,
  ) {}

  /* Form Declarations */
  userForm: FormGroup;
  EventValue: any = 'Save';
  hasUser = false;
  hasAdmin = false;
  hasSuperAdmin = false;

  userName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.email, Validators.required]);
  phoneNumber = new FormControl('', [Validators.required,Validators.pattern(/^[0-9]{10}$/)]);
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  address = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  zipCode = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
  roleId = new FormControl(true, [Validators.required]);

  ngOnInit() {
    this.getUsers();
    this.initializeuserinformationForm();
    this.getRoles();
  }

  backClicked() {
    this.location.back();
  }



  get f() {
    return this.userForm.controls;
  }

  getUsers() {
    this.userInformationService.getAllUsers().subscribe(
      (result) => {
        this.userinformations = result;
      },
      (error) => console.error
    );
  }

  getRoles() {
    this.userInformationService.getAllRoles().subscribe(
      (result) => {
        this.roles = result;
      },
      (error) => console.error
    );
  }


  checkEmailExists() {
    
    this.isEmailExists = false;
     var emailValue= this.userForm.value.email;
    this.userInformationService.checkEmailExists(emailValue).subscribe(
      () => {
        this.isEmailExists = true;
        this.userForm.controls.email.setErrors({ 
        })
      },
      () => console.error
    );
  }

  checkUsernameExists() {
    
    this.isUsernameExists = false;
     var userValue= this.userForm.value.userName;
    this.userInformationService.checkUsernameExists(userValue).subscribe(
      () => {
        this.isUsernameExists = true;
        this.userForm.controls.userName.setErrors({ 
        })
      },
      () => console.error
    );
  }



  initializeuserinformationForm() {
    this.userForm = new FormGroup({
      userName: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      address: this.address,
      city: this.city,
      zipCode: this.zipCode,
      roleId: this.roleId,
    });
  }

  changerole(e) {
    console.log(e.target.value);
  }

  openDeleteModal(content, id) {
    this.EventValue = 'Delete';
    this.selectuserinformation = id;
    this.openModal(content);
  }


  Delete() {
    this.userInformationService.DeleteUser(this.selectuserinformation).subscribe(
      (result) => {
        if (result == null) {
          this.modalService.dismissAll();
          this.toastr.success('User deleted successfully.', 'success!');
          this.getRoles();
          this.getUsers();
        } else {
          this.toastr.success('something went wrong.', 'error!');
        }
      },
      (error) => {
        console.log(error.errorMessage);
        this.toastr.error('Cannot delete user', 'error!');
      }
    );
  }

  open(content) {
    this.isUpdate = false;
    this.resetFrom();
    this.isEdit = false;
    this.disableSelect = false;
    this.userId = '';
    this.userinformation == null;
    this.openModal(content);
  }

  onSubmit() {
    this.loader.start();
    const createForm = this.userForm.value;
    console.log(createForm);

    if (!this.isUpdate) {
      if (this.userForm.valid) {
        const model = new UserInformationModel();
        model.userName = createForm.userName;
        model.firstName = createForm.firstName;
        model.lastName = createForm.lastName;
        model.email = createForm.email;
        model.roleId = createForm.roleId;
        model.phoneNumber = createForm.phoneNumber;
        model.address = createForm.address;
        model.city = createForm.city;
        model.zipCode = createForm.zipCode;

        this.userInformationService.CreateUser(model).subscribe(
          (res) => {
            this.submitted = true;
            this.loader.stop();
            this.toastr.success('User Added Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.getUsers();
          },
          (error) => {
            console.log(error);
            this.isSubmitting = false;
            this.loader.stop();
            this.modalService.dismissAll();
            this.toastr.error(error.error.errorMessage, 'Error!');
          }
        );
      }
    } else {
      if (this.userForm.valid) {
        const model = new UserInformationModel();

        model.roleId = createForm.roleId;
        model.phoneNumber = createForm.phoneNumber;
        model.address = createForm.address;
        model.firstName = createForm.firstName;
        model.lastName = createForm.lastName;
        model.city = createForm.city;
        model.userName = createForm.userName;
        model.email = createForm.email;
        model.zipCode = createForm.zipCode;
        model.id = this.selectuserinformation.id;
        this.userInformationService.updateUser(model).subscribe(
          (res) => {
            this.toastr.success('User Updated Successfully.', 'Success!');
            this.modalService.dismissAll();
            this.loader.stop();
            this.getUsers();
          },
          (error) => {
            this.toastr.error(
              error.error.errorMessage !== undefined
                ? error.error.errorMessage
                : 'User Update failed',
              'Error!'
            );
            this.loader.stop();
          }
        );
      }
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  resetFrom() {
    this.userForm.reset();
    this.EventValue = 'Save';
    this.submitted = false;
    this.isEmailExists = false;
    this.isUsernameExists = false;
    this.userinformation = null;
  }

  EditData(content, userinformation: any) {
    this.isUpdate = true;
    this.isEdit = true;
    this.disableSelect = true;
    this.selectuserinformation = userinformation;
    console.log(userinformation);
    this.EventValue = 'Update';
    this.userForm.patchValue({
      userName: userinformation.userName,
      firstName: userinformation.firstName,
      lastName: userinformation.lastName,
      email: userinformation.email,
      roleId: userinformation.roleId,
      phoneNumber: userinformation.phoneNumber,
      address: userinformation.address,
      city: userinformation.city,
      zipCode: userinformation.zipCode,
    });
    this.openModal(content);
  }

  private openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: false,
        windowClass: 'modal-cfo',
        backdropClass: 'static'
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
}
