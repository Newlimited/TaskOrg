import { LightningElement } from 'lwc';
import getOpportunities from '@salesforce/apex/oppViewController.getOpportunities';
import searchOpportunities from '@salesforce/apex/oppViewController.searchOpportunities';
import deleteOpps from '@salesforce/apex/oppViewController.deleteOpps';
import recentlyView from '@salesforce/apex/oppViewController.recentlyView';
import { NavigationMixin } from 'lightning/navigation';


// Opportunity Name , Account Name, Amount, Stage, Close Date, Opportunity Owner Alias
// Name, AccountId, Amount, StageName, CloseDate, OwnerId

const ACTIONS =[{label:'Delete', name: 'delete'}]
const COLS =[{label:'Name', fieldName: 'link', type:'url',typeAttributes:{label:{fieldName:'Name'}}},
            {label: 'Account Name', fieldName: 'accountLink', type:'url', typeAttributes:{label:{fieldName:'AccountName'}}},
            {label:'Amount', fieldName:'Amount'},
            {label:'Stage', fieldName:'StageName'},
            {label:'Close Date', fieldName:'CloseDate'},
            {label:'Opportunity Owner Alias', fieldName:'OwnerId'},
            {fieldName:"actions", type:'action',typeAttributes:{rowAction:ACTIONS}}
]

export default class OppView extends NavigationMixin(LightningElement) {

    cols = COLS;
    opportunities;
    wiredOpportunities;
    selectedOpportunities;
    baseDate;
    value = 'All';

    get options() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Recently', value: 'Recently'},
           ];
    }

    handleChange(event) {
        this.value = event.detail.value;
        if(value == 'All'){
            this.opportunities = getOpportunities();

        }else{
            recentlyView();
        }
    }

    async handleSearch(event){
       if(event.target.value ==""){
        this.opportunities = this.baseDate;
       }else if(event.target.value.length > 1){
        const searchOppos = await searchOpportunities({serachString: event.target.value})
        this.opportunities = searchOpportunities.map(row =>{
            return this.mapOpportunities(row);
        })
       }
    }
   
    get selectedOpportunitiesLen(){
        if(this.selectedOpportunities == undefined) return 0;
        return this.selectedOpportunities.length
    }


}
