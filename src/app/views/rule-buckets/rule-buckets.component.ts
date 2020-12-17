import { Component, OnInit } from '@angular/core';


import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { RuleEngineService } from '../../services/rule-engine/rule-engine.service';
import { JsonpClientBackend } from '@angular/common/http';


@Component({
  selector: 'app-rule-buckets',
  templateUrl: './rule-buckets.component.html',
  styleUrls: ['./rule-buckets.component.css']
})
export class RuleBucketsComponent implements OnInit {
  private currSelRule: string;
  currUser: any;
  rules: any;
  private facts: any;
  private selectedFact: JSON;
  private selectedFactIndex: any;
  private DATA: any;
  private sheetName: any;


  
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private ruleEngineService: RuleEngineService
    ) {
      this.rules = [];
      this.facts = "";
        
    }
    

  ngOnInit() {
    // this.ruleEngineService.userHasAuth2(index);
    // console.log("DATA", DATA);
    if(sessionStorage.getItem("userAuth") != 'true'){
      this.router.navigate(['/login']);
    }
    if(sessionStorage.getItem('DATA') == null){
      this.router.navigate(['/rules']);
    }
    console.log("RULES " + window.location.href);

    
    // console.log("TESTING: ",this.facts);
    this.filterData();
    
  }

  filterData(){

    this.currUser = JSON.parse(sessionStorage.getItem('curruserdata'));
    console.log("CURR USER",this.currUser);

    this.DATA = sessionStorage.getItem('DATA');
    this.DATA = JSON.parse(this.DATA);

    this.sheetName=Object.keys(this.DATA);
    this.sheetName = this.sheetName[0];

    let values = this.ruleEngineService.filter(this.DATA, this.sheetName);
    this.facts = values[0];
    this.rules = values[1];

  }

  openRulesModal(content, rule) {
      // console.log(this.facts);
      this.currSelRule = rule;
      this.modalService.open(content, { size: 'xl' , backdrop: 'static'});
  }

  openApproveModal(newcontent, selFact, index) {
      this.selectedFactIndex = index;
      this.selectedFact = selFact;
      this.modalService.dismissAll("Open new modal");
      this.modalService.open(newcontent, { size: 'xl' , backdrop: 'static'});
  }

  getHeadings(obj) {
      return Object.keys(obj);
  }

  async findIndex(jsonobj){
    for(let index = 0;index < this.DATA[this.sheetName].length; index++){
      if(JSON.stringify(this.DATA[this.sheetName][index]) == JSON.stringify(jsonobj)) {
        return index;
      }
    }

    return -1;
  }

  async submitApproval(headings, approved){
    let updatedFact = document.getElementsByName("ufact");

    let currIndex = await this.findIndex(this.selectedFact); 
    // console.log("CURRINDEX", currIndex);

    let i = 0;
    updatedFact.forEach((ele) => {
      let subfact= (<HTMLInputElement>ele).value;
      this.selectedFact[headings[i]] = subfact;
      i++;
    });

    if (approved == "save"){
      console.log("Saveing");
    }
    else if(approved) {
      // this.selectedFact["Status"] = "Approved";
      // console.log(this.selectedFact["Approved By"].length);
      
      if(this.selectedFact["Approved By"].length == 0){
        this.selectedFact["Approved By"] = this.currUser["Approver Name"];
      }
      else if(approved){
        // this.selectedFact["Approved By"].split(",")
        //if there are commas, split array
        let userAlreadyApproved: boolean = false;
        if(this.selectedFact["Approved By"].indexOf(',') > -1) {
          this.selectedFact["Approved By"].split(',').forEach(appr => {
            if(appr = this.currUser["Approver Name"]){
              userAlreadyApproved = true;
              return;
            }
          });

        } else {
          if(this.selectedFact["Approved By"] == this.currUser["Approver Name"]){
            userAlreadyApproved = true;
          }
        }
        if(!userAlreadyApproved)
          this.selectedFact["Approved By"] = this.selectedFact["Approved By"] + "," + this.currUser["Approver Name"];
      }
    }
    else if(!approved){
      this.selectedFact["Status"] = "Denied";
    }

    // console.log(this.selectedFact);
    this.DATA[this.sheetName][currIndex] = this.selectedFact;

    // console.log(this.DATA[this.sheetName][currIndex]);
    // console.log(this.selectedFact);
    sessionStorage.setItem('DATA', JSON.stringify(this.DATA));
    
    //refresh data
    this.filterData();

  }
    
}
