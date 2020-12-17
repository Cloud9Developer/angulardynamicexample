import { newArray } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';


@Injectable({
  providedIn: 'root'
})
export class RuleEngineService {
  private importRules;
  // private userRules: string[];
  private currUser;
  private newFacts = "";
  private definedRules: string[];
  private ruleNames: string[];
  private ruleBuckets: string[] = [];
  private parsed: boolean = false;
  private defaultBucket = "Non-Categorized Data";

  

  constructor() {
   }

  filter(facts, sheetName) {
    //init
    this.newFacts="";
    this.ruleNames = [];
    this.ruleBuckets=[];
    this.definedRules=[];
    //convert to JSON
    this.importRules = JSON.parse(sessionStorage.getItem('RULES'));
    this.currUser = JSON.parse(sessionStorage.getItem('curruserdata'));
    
    // run function to parse the imported rules
    this.parseRules(this.importRules);

    //convert to JSON
    facts = facts[sheetName];

    console.log("USERDATA: ", this.currUser);

    facts.forEach(obj => {
      this.parsed = false;
      this.process(obj);  
    });

    this.populateFacts();

    this.newFacts = "{ " + this.newFacts + " }";
    // console.log("NEWFACTS: ", this.newFacts);
    this.newFacts=JSON.parse(this.newFacts);

    return [this.newFacts, Object.keys(this.newFacts)];
  }

  parseRules(irules){
    // this.ruleNames
    this.definedRules = irules[Object.keys(irules)[0]];
    console.log("HERE: ", this.definedRules);

    let defaultBucket = '{ "Rule Name" : "'+ this.defaultBucket+'" }';

    this.definedRules.push(JSON.parse(defaultBucket));


    this.definedRules.forEach(rule => {
      this.ruleNames.push(rule["Rule Name"]);
    });
    this.ruleNames.forEach(()=>{
      this.ruleBuckets.push("");
    });
    console.log("RuleNames: ", this.ruleNames)

  }

  // Process Object
  process(jsonObj) {
    // console.log(this.parsed);
    this.definedRules.forEach((rule,index) => {
      let bool: boolean = true;

      // console.log(index);

      let keys = Object.keys(rule);

      keys.forEach((subrule) => {
        if(subrule!="Rule Name" && subrule!="Approvers" && subrule!="Approvals Needed" && subrule!="Approval Level") {
          if(!bool || this.parsed) {
            // console.log("!bool and parsed? ", !bool, this.parsed);
            return;
          }
          if(subrule==this.defaultBucket) {
            // console.log("OTHER");
            bool=false;
            this.parsed = true;
            // console.log(subrule);
            this.encase(index,jsonObj);
            return;
          }
          // AMOUNT
          if(subrule.trim() == "Invoice Total") {
            // console.log(jsonObj);
            eval("if(!(jsonObj[subrule]" + rule[subrule] + ")){ bool = false}");
          } 
          // RANGE
          else if(rule[subrule.trim()].indexOf("-") > -1) { 
            // console.log(rule[subrule.trim()]);
            let range = rule[subrule.trim()].split("-");
            // console.log(rule);
            let letter = jsonObj[subrule.trim()][0].trim().toLowerCase();
            if((letter < range[0].trim().toLowerCase()) || (letter > range[1].trim().toLowerCase())) {
              // console.log(jsonObj);
              // console.log("RANGE FALSE: ",range, letter,  !(letter < range[0].toLowerCase()) || !(letter > range[1].toLowerCase()));
              bool = false;
            }
          }
          // Equilivancy
          else if(!(jsonObj[subrule.trim()] == rule[subrule.trim()])){
            // console.log(jsonObj[subrule.trim()], " : ", rule[subrule.trim()]);
              bool = false;

          }
        }
      });

      if(bool && !this.parsed) {
        this.parsed = true;
        this.encase(index,jsonObj);
        return true;
      }
    });
  }

  encase(index, jsonObj) {
    if(this.userHasAuth(index)) {
    // if(true) {
      console.log("PASSED AUTH");
      jsonObj = this.processApprovalLevels(jsonObj, index);

      jsonObj = JSON.stringify(jsonObj)
      // console.log("Put in ", num);
      if(this.ruleBuckets[index].length == 0){
        this.ruleBuckets[index] = jsonObj;
      }
      else {
        this.ruleBuckets[index] += "," + jsonObj; 
      }
    }
  }

  processApprovalLevels(jsonObj, index) {

    if(jsonObj["Approved By"] == undefined) {
      jsonObj["Approved By"] = "";
    }

    let numOfApprov;
    if(jsonObj["Approved By"].length == 0) {
      numOfApprov = 0;
    } else {
      numOfApprov = jsonObj["Approved By"].split(",").length;
    }

    let approvalsNeeded;
    try{
      switch(this.definedRules[index]["Approval Level"].toString()){
        case "1":
          break;
        case "2":
          break;
        case "3":
          approvalsNeeded = this.definedRules[index]["Approvers"].split(",").length;
          break;
        case "4":
          approvalsNeeded = 1;
          break;

      }
      // console.log(approvalsNeeded);
      // console.log("HERE Appr L: ",this.definedRules[index]["Approval Level"], approvalsNeeded, this.definedRules[index]["Approvers"].split(",").length);


      jsonObj["Approvals"] = (numOfApprov) + " of " + approvalsNeeded;//this.definedRules[index]["Approvers"].split(",").length;
      // console.log("APPR NEEDED ",jsonObj["Approvals"].split(" ")[0]);
      

      // if(approvalsNeeded == numOfApprov){
      //   jsonObj["Status"] = "Approved";
      // }
      // else 
      if(jsonObj["Approvals"].split(" ")[0] == approvalsNeeded){
        jsonObj["Status"] = "Approved";
      }
    }
    catch(e) {
      // console.log("Warning: ", e);
    }

    return jsonObj;

  }

  populateFacts() {
    let authrnames = [];
    this.ruleNames.forEach((rname, index) => {
      if(this.ruleBuckets[index].length != 0){
        authrnames.push(rname);
      }
    });
    authrnames.forEach((rname, index) => {
      let temp = '"' + [rname] +'"' + ': \[' + this.ruleBuckets[this.ruleNames.indexOf(rname)] + '\]';
        
      // if last
      if(index == 0)
        this.newFacts += temp;
      else
        this.newFacts += "," + temp;
    });
  }

  //check to make sure user has auth to view rule
  userHasAuth(index){
    //all rules
    if(this.currUser["Approver Name"] == "admin") {
      return true;
    }
    if(this.definedRules[index]["Approvers"] == undefined) {
      console.log("userAuth Failed")
      return false;
    }
    let authUsers = this.definedRules[index]["Approvers"].split(",");
    // console.log("HERE for auth: ", authUsers);

    for(let i=0; i<authUsers.length; i++) {
      // console.log("USERS", authUsers[i]);
      if(authUsers[i].trim() == this.currUser["Approver Name"]) {
        return true;
      }
    }
    return false;
  }
}
