import { Component, OnInit } from '@angular/core';

//Kiegészítők
import { Router } from '@angular/router';

//Services
import { AuthserviceService } from '../../services/authservice.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private _router: Router, public _authService: AuthserviceService) { }
  ngOnInit(): void {
    if (!this._authService.isLoggedIn) {
      this._router.navigate(["bejelentkezes"]);
    }


  }

}
