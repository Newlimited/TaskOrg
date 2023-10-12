import { LightningElement, track, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OppViewController.getOpportunities';
import searchOpportunity from '@salesforce/apex/OppViewController.searchOpportunity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import deleteOpps from '@salesforce/apex/OppViewController.deleteOpps';
import recentlyView from '@salesforce/apex/OppViewController.recentlyView';
import { refreshApex } from '@salesforce/apex';

// Opportunity Name , Account Name, Amount, Stage, Close Date, Opportunity Owner Alias
// Name, AccountId, Amount, StageName, CloseDate, OwnerId

const ACTIONS =[{label:'Delete', name: 'delete'}]
const COLS =[{label:'Opportunity Name', fieldName: 'link', type:'url',typeAttributes:{label:{fieldName:'Name'}}},
            {label: 'Account', fieldName: 'accountLink', type:'url', typeAttributes:{label:{fieldName:'AccountName'}}},
            {label:'Amount', fieldName:'amount'},
            {label:'Stage', fieldName:'stageName'},
            {label:'Close Date', fieldName:'closeDate'},
            {fieldName: "actions", type: 'action', typeAttributes: {rowActions: ACTIONS}}
]
// Opportunity Owner Alias
//Task2 Test for git push!!!
// test 222
export default class OppView extends LightningElement{

    cols = COLS;
    opportunities;
    wiredOpportunities;
    selectedOpportunities;
    baseDate;

    value = 'All';

    @track isShowModal = false;

    showModal(){
        this.isShowModal = true;
    }
    closeModal(){
        this.isShowModal = false;
    }

    get options() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Recent', value: 'Recent'},
           ];
    }
   get selectedOpportunitiesLen(){
        if(this.selectedOpportunities == undefined) return 0;
        return this.selectedOpportunities.length
    }
  async viewAll(){
    const result = await getOpportunities();
        this.opportunities = result.map((row)=>{
            return this.mapOpportunities(row);
        });
    }
    async viewRecent(){
        const result = await recentlyView();
            this.opportunities = result.map((row)=>{
                return this.mapOpportunities(row);
            });
    }
    async searchView(){
        const searchOppos = await searchOpportunity({searchString: event.target.value});
        this.opportunities = searchOppos.map(row =>{
            return this.mapOpportunities(row);
        });
    }

 async connectedCallback() { // 비동기
   await this.viewAll();

 }
    
    async handleChange(event){
       this.value = event.detail.value;
        if(this.value == 'All'){
           await this.viewAll();
            // const result = await getOpportunities();
            // this.opportunities = result.map((row)=>{
            //     return this.mapOpportunities(row);
            // });
            // console.log('result: ', result);

        }
        else if(this.value =='Recent'){
            await this.viewRecent();
        }
    }
        //     return getOpportunities().then(result => {
        //             this.wiredOpportunities = result;
        //             if(result.data){
        //                 this.opportunities = result.data.map((row)=>{
        //                     return this.mapOpportunities(row);
        
        //                 })
        //                 this.baseDate = this.opportunities;
        //             }
        //             if(result.error){
        //                 console.error(result.error);
        //             }
        //         }
        //     });
        // }else if(this.value == 'Recent'){
        //     return recentlyView();
        // }
    
        // @wire(getOpportunities)
        //  opportunitiesWire(result){
        //     this.wiredOpportunities = result;
        //     if(result.data){
        //         this.opportunities = result.data.map((row)=>{
        //             return this.mapOpportunities(row);

        //         })
        //         this.baseDate = this.opportunities;
        //     }
        //     if(result.error){
        //         console.error(result.error);
        //     }
        // }
        // newOfView(){
        //     result = getOpportunities();
        //     return result;
        // }

        // @wire(recentlyView)
        // opportunitiesWire(result){
        //     this.wiredOpportunities = result;
        //     if(result.data){
        //         this.opportunities = result.data.map((row)=>{
        //             return this.mapOpportunities(row);

        //         })
        //         this.baseDate = this.opportunities;
        //     }
        //     if(result.error){
        //         console.error(a.error);
        //     }
        // }
    
       
    mapOpportunities(row){
        var accountName = '';
        var accountLink = '';
            
        if(row.AccountId != undefined){
            accountLink = `/${row.AccountId}`;
            accountName = row.Account['Name'];
        }
        var closeDates = row.CloseDate

        if(closeDates == undefined){
            closeDates = ''
        }
        var amounts = row.Amount
        if(amounts == undefined){
            amounts = 0;
        }
        return {...row,
            amount: amounts,
            stageName: row.StageName,
            closeDate: closeDates,
            // ownerId: row.ownerId,
            Name:row.Name,
            link:`/${row.Id}`,
            accountLink : accountLink,
            AccountName : accountName

        };
    }
    // navigateToNewRecordPage() {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__objectPage',
    //         attributes: {
    //             objectApiName: 'Opportunity',
    //             actionName: 'new'
    //         }
    //     });
    // }

    handleRowSelection(event){
        this.selectedOpportunities = event.detail.selectedRows;
    }

    async handleSearch(event){
        if(!event.target.value) {
            await this.viewAll();
        } else {
            
           await this.searchView();
            // const searchOppos = await searchOpportunity({searchString: event.target.value});
        
            // this.opportunities = searchOppos.map(row =>{
            //     return this.mapOpportunities(row);
            // });
        }

    //     if(event.target.value == ""){
    //     this.opportunities = this.baseDate
    //    }else if(event.target.value.length > 1){
    //     const searchOppos = await searchOpportunity({serachString: event.target.value});
        
    //     this.opportunities = searchOppos.map(row =>{
    //         return this.mapOpportunities(row);
    //     })
    // }
    }

    handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회가 생성되었습니다.',
                variant: 'success'
            })
        );
        this.closeModalBox(event);
    }
    

    }