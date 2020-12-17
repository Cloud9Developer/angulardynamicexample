import { Component, Input, OnInit, Output, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';


//import dummy data
import * as data from '../../../assets/dummydata/facts.json';

@Component({
  selector: 'app-upload-rule-sets',
  templateUrl: './upload-rule-sets.component.html',
  styleUrls: ['./upload-rule-sets.component.css']
})
export class UploadRuleSetsComponent implements OnInit {
  currSelRule: string;
  currUser: any;
  rules: any;
  facts: any;
  authorized: boolean;
  fileUploaded: boolean = false;




  
  constructor(
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,)    {
        this.currUser = this.router.getCurrentNavigation().extras.state;
    }
    

  ngOnInit() {
    console.log("RULES " + window.location.href);
  }

  // browse and convert json file
  onFileChange(ev, dataname:string) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);

      this.fileUploaded = true;

      sessionStorage.setItem(dataname, dataString);

    }
    reader.readAsBinaryString(file);
  }

  NextPage(){
    this.router.navigate(['/login']);
  }
}