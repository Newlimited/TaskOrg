import { LightningElement, wire } from 'lwc';
import getLeads from '@salesforce/apex/LeadListViewController.getLeads';


import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';


const ACTIONS =[{label: 'Delete',name:'delete'}]
const COLS =[{label: 'Name', fieldName:'Name', type: 'url', typeAttributes:{laber: {fieldName : 'Name'}}},
            {label:'Title', fieldName: 'Title'},
            {label: 'Company', fieldName:"Company"},
            {label: 'Mobile', fieldName:"MobilePhone"},
            {label: 'Email', fieldName:"Email"},
            {label: "Lead Status", fieldName:'Status'},
            {fieldName: "actions", type: 'action', typeAttributes:{rowActions:ACTIONS}}
]
export default class LeadViews extends LightningElement {

    cols = COLS;
    leads;
    wiredLeads;
    selectedleads;
    baseData;

    get selectedleadsLen() {
        if(this.selectedleads == undefined) return 0;
        return this.selectedleads.length
    }
    
    @wire(getLeads)
    leadsWire(result){
    this.wiredLeads = result;
    if(result.data){
        //handle data
        this.leads = result.data.map((row) => {
            return this.mapLeads(row);
        })
        this.baseData = this.leads;
    }
    if(result.error){
        console.error(result.error);
    }

    }

    mapleads(row){
        var leadName = '';
        var leadLink = '';
        if(row.LeadId != undefined){
            leadLink = `/${row.leadLink}`;
            leadName = row.Lead['Name'];
        }
        var email = row.email
        if(row.email == undefiend){
            email =''
        }
        var title = row.Title
        if(row.Title == undefined){
            title =''
        }
        var company = row.Company
        if(row.Company == undefined){
            company =''
        }
        var mobile = row.Mobile
        if(row.Mobile == undefined){
            mobile =''
        }
        var status = row.status
        if(row.status == undefined){
            status = ''
        }

        return {...row,
            FullName: `${row.FirstName} ${row.LastName}`,
            link: `/${row.Id}`,
            accountLink: accountLink,
            AccountName: accountName,
            MailingAddress: `${street} ${city} ${state} ${zipCode} ${country}`
        };
    }

    handleRowSelection(event){
        this.selectedLeads = event.detail.selectedRow;
    }

    async handleSearch(event){
        if(event.target.value == ""){
            this.leads = this.baseData
        }else if(event.target.value.length > 1){
            const searchleads = await searchLead({searchString: event.target.value})

            this.leads = searchleads.map(row => {
                return this.mapleads(row);
            })
        }
    }

    navigateToNewRecordPage() {

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Lead',
                actionName: 'new'
            }
        });
    }

    handleRowAction(event) {
        deleteLeads({leadIds : [event.detail.row.Id]}).then(() => {
            refreshApex(this.wiredleads);
        })
    }

    deleteSelectedleads(){
        const idList = this.selectedLeads.map( row => { return row.Id })
        deleteLeads({leadIds : idList}).then( () => {
            refreshApex(this.wiredleads);
        })
        this.template.querySelector('lightning-datatable').selectedRows = [];
        this.selectedLeads = undefined;
    }
}