import { LightningElement, track, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/oppViewController.getOpportunities';
import searchOpportunity from '@salesforce/apex/oppViewController.searchOpportunity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import deleteOpps from '@salesforce/apex/oppViewController.deleteOpps';
import createOpps from '@salesforce/apex/oppViewController.createOpps';

import recentlyView from '@salesforce/apex/oppViewController.recentlyView';
import { refreshApex } from '@salesforce/apex';

import getOppsInfo from '@salesforce/apex/oppViewController.getOppsInfo';
import updateOpp from '@salesforce/apex/oppViewController.updateOpp';

// Opportunity Name , Account Name, Amount, Stage, Close Date, Opportunity Owner Alias
// Name, AccountId, Amount, StageName, CloseDate, OwnerId

const ACTIONS =[
    {label:'Edit', name:'Edit', key:'edit'},
    {label:'Delete', name:'delete', key:'delete'}
                
]
const COLS =[{label:'Opportunity Name', fieldName: 'link', type:'url',typeAttributes:{label:{fieldName:'Name'}}},
            {label: 'Account', fieldName: 'accountLink', type:'url', typeAttributes:{label:{fieldName:'AccountName'}}},
            {label:'Amount', fieldName:'Amount',type:'currency'},
            {label:'Stage', fieldName:'StageName',type:'text'},
            {label:'Close Date', fieldName:'CloseDate', type:'date'},
            {fieldName: "actions", type: 'action', typeAttributes:{rowActions: ACTIONS}}
]
// Opportunity Owner Alias
export default class OppView extends LightningElement{
    
    cols = COLS;
    opportunities;
    wiredOpportunities;
    selectedOpportunities;
    // baseDate;
    @track name ='';
    @track amount =0;
    @track isShowModal = false;
    @track isShowUpdateModal = false;
// 모달창 on/off
    showModal(){
        this.isShowModal = true;
    }
    showUpdateModal(){
        this.isShowUpdateModal = true;
    }

    closeModal(){
        this.isShowModal = false;
    }
    closeUpdateModal(){
        this.isShowUpdateModal = false;
    }
    //connectCallback
    async connectedCallback() { // 비동기
        await this.viewAll();
      }

      //ComboBox Options
    get options() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Recent', value: 'Recent'},
           ];
    }
    get stageOptions() {
        return [
            { label: 'Prospecting', value: 'Prospecting' },
            { label: 'Closed Won', value: 'Closed Won' }
        ];
    }
    // Select Count
   get selectedOpportunitiesLen(){
        if(this.selectedOpportunities == undefined) return 0;
        return this.selectedOpportunities.length
    }

    // Kind of List View
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

    // 리스트 필터
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
    
    // searching
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
    // Check Change
    handleNameChange(event){
        this.name = event.target.value;
    }

    handleAmountChange(event){
        this.amount = event.target.value;
    }

    handleDateChange(event){
        this.closedate = event.target.value;
    }
    handleStageChange(event) {
        const stageName = event.detail.value;
        console.log('stageName check : ', stageName);
        this.stageName = stageName;
    }
   
    // Action 삭제, 수정
  async handleRowAction(event) {
     const selectKey = event.detail.action.key;
     if(selectKey == 'delete'){
     deleteOpps({opportunityIds : event.detail.row.Id}).then(() => {
        refreshApex(this.opportunities)})
        this.deleteMsg();
} else if(selectKey =='edit'){
  
   const result = await getOppsInfo({oppId: event.detail.row.Id});
        console.log('result.Id'+ result.Id);
        this.id = result.Id;
        this.name = result.Name;
        this.amount = result.Amount;
        this.closeDate = result.CloseDate;
    console.log('mapping start');
    this.showUpdateModal();
   console.log('show');
    
}
}
//

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
    
       // mapping
    mapOpportunities(row){
        var accountName = '';
        var accountLink = '';
        if(row.AccountId != undefined){
            accountLink = `/${row.AccountId}`;
            accountName = row.Account['Name'];
        }
        // var amounts = row.Amount
        // if(amounts == undefined){
        //     amounts = 0;
        // }
        return {...row,
            // amount: amounts,
            // stageName: row.StageName,
            // closeDate: closeDates,
            // ownerId: row.ownerId,
            Name:row.Name,
            link:`/${row.Id}`,
            accountLink : accountLink,
            AccountName : accountName
        };
    }

    //Page 이동
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
// message
    handleSuccess(event) {
            this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회가 생성되었습니다.',
                variant: 'new'
            })
        );
        this.closeModal(event);
        this.handleClose(event);
    }
    deleteMsg(){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회가 삭제되었습니다.',
                variant: 'Success'
            })
        );
        this.handleClose();
    }
    updateMsg(event){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: '기회가 업데이트 되었습니다.',
                variant: 'Success'
            })
        );
        this.closeUpdateModal(event);
        this.handleClose(event);
    }
//새로고침
    handleClose = () => {
        window.location.reload();
    }
 

    createRecord(){
       createOpps({
        // ownerId : this.ownerId,
        name : this.name,
        closeDate : this.closedate,
        stageName : this.stageName,
        amount : this.amount
       });
       this.handleSuccess();
    }

    updateRecord(){
        updateOpp({
            oppId : this.id,
            closeDate : this.closeDate,
            stageName : this.stageName,
            amount : this.amount
        });
        this.updateMsg();
    
    }
}