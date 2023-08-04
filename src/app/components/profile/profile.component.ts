import { Component, Input, OnInit } from '@angular/core';

//Services
import { AuthserviceService } from '../../services/authservice.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { RoleModel } from 'src/app/models/role.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  //Bejelentkezés után feltöltött adat
  @Input()
  activeUser: any;

  //Role betöltése -> Username alatt a profilnál
  userRoleName = "";


  //Form és elmenteni a usert
  roleForm: FormGroup | any;
  roles: RoleModel[] = []; //Formba beletölteni
  subscriptions: Subscription[] = [];

  //Form validáció
  formErrorMessage: boolean = false;



  constructor(private _userService: UserService, private _router: Router, private _authService: AuthserviceService, private _formBuilder: FormBuilder,) {
    this.roleForm = this._formBuilder.group({
      'roles': new FormControl("Fejlesztő", Validators.required),
    });
  }


  ngOnInit(): void {
    this.getUserRoleName();
    this.getRoles();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  //Kijelentkezés
  logout(): void {
    this._authService.logout();
    this._router.navigate(["bejelentkezes"]);
  }

  //Roles kiválasztása
  updateRole(): void {

    console.log(this.roleForm.value.roles);
    //Itt frissítem a patch-el
    this.subscriptions.push(
      this._userService.updateUserRole(
        this.activeUser.id,
        this.roleForm.value.roles)
        .subscribe(
          (response) => {

            //Újra frissítem a userRoleName-t
            this.getUserRoleName();
          },
          (error) => {
            console.error('Hiba történt a frissítés során:', error);
          }
        )
    );
  }

  getRoles(): void {
    this.subscriptions.push(
      this._userService.getRoles().pipe(
        tap((data: RoleModel[]) => {
          this.roles = data;
        })
      ).subscribe()
    );
  }

  getUserRoleName() {
    this._userService.getUserRoleName(this.activeUser.roleId)
      .subscribe(
        roleName => {
          this.userRoleName = roleName;
        }
      );
  }

}