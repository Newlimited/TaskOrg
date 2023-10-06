import { LightningElement, wire } from 'lwc';
import getLeads from '@salesforce/apex/LeadListViewController.getLeads';

const ACTIONS =[{label: 'Delete',name:'delete'}]
const COLS =[{label: 'Name', fieldName:'Name', type: 'url', typeAttributes:{laber: {fieldName : 'Name'}}},
            {label:'Title', fieldName: 'Title'},
            {label: 'Company', fieldName:"Company"},
            {label: 'MobilePhone', fieldName:"MobilePhone"},
            {label: 'Email', fieldName:"Email"},
            {label: "Lead Status", fieldName:'Status'},
            {fieldName: "actions", type: 'action', typeAttributes:{rowActions:ACTIONS}}
]
export default class LeadViews extends LightningElement {

    cols = COLS;
    leads;

    wiredLeads;

    @wire(getLeads)
    contactsWire(result){
    this.wiredLeads = result;
    if(result.data){
        //handle data
        this.leads = result.data
    }
    if(result.error){
        console.error(result.error)
    }

    }
    

}