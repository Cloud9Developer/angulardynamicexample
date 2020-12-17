import { Component, TemplateRef, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service'
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'postAPI';
  closeResult: string;
  private approvers: JSON;
  facts: any;

  constructor(
    private authService: AuthService,
    private router: Router
    ) {
      this.facts = this.router.getCurrentNavigation().extras.state;
      // console.log(this.facts);
    } 

  ngOnInit() {
    console.log("Home ", window.location.href);
    this.approvers = JSON.parse(sessionStorage.getItem('APPROVERS'));
  }
  
  onSubmit(user) {
    // auth login
    if( this.authService.AuthUser(user.value.name,user.value.pwd) == true) {
      let userdata = this.getUserData(user.value.name);
      console.log(userdata);

      sessionStorage.setItem('curruserdata', JSON.stringify(userdata));
      
      if(user.value.name=="admin")
        this.router.navigate(['/admin']);
      else
        this.router.navigate(['/authRules']);
    }
    else {
      alert("Username/password is not valid or User does not have authiorization.");
    }
  }

  getUserData(username): JSON {
    // console.log("curruser: ",username)
    let thisuser: any;
    if(username=="admin"){
      thisuser = {"Approver Name": "admin"}
      // thisuser = JSON.parse(thisuser);
    }
    else{
      for(let i = 0; i < Object.keys(this.approvers["Approvers"]).length; i++) {
        if(this.approvers["Approvers"][i]["Approver Name"] == username) {
          thisuser = this.approvers["Approvers"][i];
        }
      }
    }
    // console.log("THIS USER: ", thisuser);
    return thisuser;

  }

}
