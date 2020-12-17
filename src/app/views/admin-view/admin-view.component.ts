import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';


@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
  private modalName: string;
  private currOpenModal: any;
  private selData: any;
  private selDataHeadings: any;
  private selItem: any;
  private selItemHeadings: any;
  private modalArray: any = [];

  // approvalLevels = [
  //   {
  //     "level" : 1,
  //     "desc" : "Only"
  //   },
  //   {
  //     "level" : 2,
  //     "desc" : "Either Or"
  //   },
  //   {
  //     "level" : 3,
  //     "desc" : "All"
  //   },
  //   {
  //     "level" : 4,
  //     "desc" : "Any"
  //   }
  // ];



  constructor(
    private modalService: NgbModal,
    private router: Router,
    private elementRef:ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    console.log("HERE in admin: ",JSON.parse(sessionStorage.getItem('curruserdata'))["Approver Name"]);
    if(JSON.parse(sessionStorage.getItem('curruserdata'))["Approver Name"] != "admin"){
      this.router.navigate(['/authRules']);
    }
  }

  openModal(content, name) {
    if(name=="allRules") {
      this.router.navigate(['/authRules'])
    }
    else if(name=="ruleProfiles") {
      this.modalName = "Rule Profiles";
      this.selData = JSON.parse(sessionStorage.getItem("RULES"));
      this.selDataHeadings = this.getHeadings(this.selData);
      console.log("SelectedData-rules: ",this.selData, this.selDataHeadings);
      // console.log(this.selData["Sheet1"]);
      console.log(this.selData[this.selDataHeadings[0]]);


      this.modalArray.push(this.modalService.open(content, { size: 'xl' , backdrop: 'static'}));
    }
    else if(name=="approverProfiles") {
      this.modalName = "Approver Profiles";
      this.selData = JSON.parse(sessionStorage.getItem("APPROVERS"));
      this.selDataHeadings = this.getHeadings(this.selData);
      console.log("SelectedData-approvers: ",this.selData, this.selDataHeadings);

      this.modalArray.push(this.modalService.open(content, { size: 'xl' , backdrop: 'static'}));
    }
  }

  openEditModal(content, item, index) {
    this.selItem = {
      "item" : item,
      "index" : index 
    };
    console.log(content);
    console.log(this.modalName);
    // console.log(this.selItem);
    this.modalService.dismissAll();
    if(this.modalName == 'Rule Profiles') {
      // this.modalService.open(content[0], { size: 'xl' , backdrop: 'static'});
      this.currOpenModal = "ruleEdit";
      this.modalArray.push(this.modalService.open(content[0]));

    }
    else if(this.modalName == 'Approver Profiles') {
      // this.modalService.open(content[1], { size: 'xl' , backdrop: 'static'});
      this.currOpenModal = "apprEdit";
      this.modalArray.push(this.modalService.open(content[1]));

    }
  }

  addProfile(content) {
    this.selItem = {
      "item" : {
        "Rule Name" : "",
        "Approval Level" : ""  
      },
      "index" : {}
    };
    this.currOpenModal = "addProfile";
    console.log(this.currOpenModal);
    // console.log(this.selItem);
    this.modalService.dismissAll();
    // this.modalService.open(content, { size: 'xl' , backdrop: 'static'});
    this.modalArray.push(this.modalService.open(content));
  }

  getHeadings(obj) {
    // console.log(obj);
    this.selItemHeadings = Object.keys(obj)
    return this.selItemHeadings;
  }

  delRule(item){
      console.log(item); 
      // console.log(this.selData[this.selDataHeadings[0]]);
      let currRulesArr = this.selData[this.selDataHeadings[0]];
      console.log(currRulesArr);
      this.selData[this.selDataHeadings[0]].splice(item["index"], 1);
      // currRulesArr.splice(item["index"], 1);
      console.log(this.selData);
      sessionStorage.setItem("RULES", JSON.stringify(this.selData));
  }

  saveRule(item){
    console.log(item); 
  
    // console.log(this.selData[this.selDataHeadings[0]]);
    let updatedRuleKeys = document.getElementsByName("key");
    let updatedRuleValues = document.getElementsByName("value");

    // if rulename is blank, alert error
    if((<HTMLInputElement>updatedRuleValues[0]).value.length == 0){
      alert("Rule Name is Required");
      return;
    }  


    let newString = "";

    for(let i = 0; i < updatedRuleKeys.length; i++) {
      if((<HTMLInputElement>updatedRuleKeys[i]).value.trim().length != 0 && (<HTMLInputElement>updatedRuleValues[i]).value.trim().length != 0){
        // let temp = '"' + [rname] +'"' + ': \[' + this.ruleBuckets[this.ruleNames.indexOf(rname)] + '\]';
        let temp = '"' + (<HTMLInputElement>updatedRuleKeys[i]).value + '" : "' + (<HTMLInputElement>updatedRuleValues[i]).value + '"';
        if(newString.length == 0){
          newString += temp
        }
        else {
          newString += "," + temp;
        }
      }
    }
    newString = "{" + newString + "}";
    console.log(newString);

    if(item == "new") {
      console.log("SAVED");
      console.log(this.selData[this.selDataHeadings[0]]);
      this.selData[this.selDataHeadings[0]].push(JSON.parse(newString));
    }
    else {
      this.selData[this.selDataHeadings[0]][item["index"]] = JSON.parse(newString);
    }

    sessionStorage.setItem("RULES", JSON.stringify(this.selData));
    this.modalService.dismissAll();
  }

  addRowToModal(placement) {
    // let test = [1,2,3,4,5];
    // console.log("TEST ",test.pop());
    
    // console.log(placement);
    let field;
    if(placement == "addApprRowToTable"){
      field="Approval Level "
      let formKeys = document.getElementsByName("key");


      let currNumOfLevels = 0;
      let ApprovalLevel;
      formKeys.forEach((key, index) => {
        let value = (<HTMLInputElement>key).value;
        if(value.match(/Approval Level /g) != null) {
          currNumOfLevels++;
        }

        if(value == "Approval Level") {
          ApprovalLevel = (<HTMLInputElement>document.getElementsByName("value")[index]).value;
        }

      });
      console.log(currNumOfLevels, ApprovalLevel);

      if(currNumOfLevels > ApprovalLevel-1) {
        alert("Amount of Approval Levels cannot exceed current approval level: " + ApprovalLevel);
        return;
      }


      // console.log(this.selItemHeadings);
    }else {
      field = "NewField "
    }
    // console.log(field);

    // console.log(this.selItem);
    // tempdata = JSON.parse(tempdata);
    let number = 1;
    if(this.selItem['item'][field + number.toString()] == undefined) {
      this.selItem['item'][field + number.toString()] = " ";
    }
    else {
      while(this.selItem['item'][field + number.toString()] != undefined){
        number++;
      }
      this.selItem['item'][field + number.toString()] = " "
      
    }

    // let formValues = document.getElementsByName("value");

    // formValues.forEach((value, index) => {
    //   let key = (<HTMLInputElement>document.getElementsByName("value")[index]).value;
    //     if(key.match(/Approval Level /g) != null) {
    //       value.setAttribute('placeholder', 'test');
    //     }
    // });
    //document.getElementsByName("value")[index].setAttribute('placeholder', 'test')
    
    // console.log("HERE: ", this.selData);

  }

  deleteRow(rowName) {
    // console.log(index);
    document.getElementById(rowName).remove();
  }

  ///NEED TO FIX THESE
  delApprover(item){
    console.log(item); 
    // console.log(this.selData[this.selDataHeadings[0]]);
    let currRulesArr = this.selData[this.selDataHeadings[0]];
    console.log(currRulesArr);
    this.selData[this.selDataHeadings[0]].splice(item["index"], 1);
    // currRulesArr.splice(item["index"], 1);
    console.log(this.selData);
    sessionStorage.setItem("APPROVERS", JSON.stringify(this.selData));
  }

  saveApprover(item){
    console.log(item); 
    // console.log(this.selData[this.selDataHeadings[0]]);
    let updatedRuleKeys = document.getElementsByName("key");
    let updatedRuleValues = document.getElementsByName("value");

    let newString = "";

    for(let i = 0; i < updatedRuleKeys.length; i++) {
      if((<HTMLInputElement>updatedRuleKeys[i]).value.trim().length != 0 && (<HTMLInputElement>updatedRuleValues[i]).value.trim().length != 0){
        // let temp = '"' + [rname] +'"' + ': \[' + this.ruleBuckets[this.ruleNames.indexOf(rname)] + '\]';
        let temp = '"' + (<HTMLInputElement>updatedRuleKeys[i]).value + '" : "' + (<HTMLInputElement>updatedRuleValues[i]).value + '"';
        if(newString.length == 0){
          newString += temp
        }
        else {
          newString += "," + temp;
        }
      }
    }
    newString = "{" + newString + "}";
    console.log(newString);

    this.selData[this.selDataHeadings[0]][item["index"]] = JSON.parse(newString);

    sessionStorage.setItem("APPROVERS", JSON.stringify(this.selData));
  }

  headingIsStatic(heading) {
    let staticHeadings = ["Rule Name", "Approval Level"];

    if(staticHeadings.indexOf(heading) > -1){
      return true;
    }
    else if(heading.match(/Approval Level/g) != null) {
      return true;

    } else{
      return false;
    }

  }
}