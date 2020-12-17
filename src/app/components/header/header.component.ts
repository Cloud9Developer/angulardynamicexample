import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  clearSession(){
    sessionStorage.clear();
    console.log("Session Cleared");
  }

  logout(){
    this.router.navigate(['/login']);
  }

}
