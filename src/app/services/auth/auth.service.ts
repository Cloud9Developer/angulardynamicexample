import { Injectable } from '@angular/core';
//import * as users from '../../assets/false_data/users.json';

//import dummy data
// import * as data from '../../../assets/dummydata/auth.json'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users;

  constructor() { }

  AuthUser(Uname, Upass) {
    // this.users = data.default;
    this.users = '{ "Approver1" : "1234", "Approver2" : "1234", "Approver3" : "1234", "DelApprover4" : "1234", "EscApprover5" : "1234", "admin" : "admin"}';
    this.users = JSON.parse(this.users);
    //check user exists
    console.log(this.users);
    if(this.users[Uname] == undefined){
        sessionStorage.setItem("userAuth", 'false');
        return false;
    }
    //check user password
    if(this.users[Uname] != Upass) {
        sessionStorage.setItem("userAuth", 'false');
        return false;
    }
    //If above check pass, user is auth
    sessionStorage.setItem("userAuth", 'true');
    return true;
  }
}
