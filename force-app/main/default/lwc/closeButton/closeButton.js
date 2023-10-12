import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { updateRecord } from 'lightning/uiRecordApi';

export default class closeButton extends NavigationMixin(LightningElement) {
    @api recordId; // 현재 페이지의 기회 레코드 ID
    @track selectedStage = ''; // 선택한 단계(stage)
   
    // 기회 단계 옵션

    stageOptions = [

        { label: 'Closed Won', value: 'Closed Won' },

        { label: 'Closed Lost', value: 'Closed Lost' },

    ];
    // 단계 선택 변경 핸들러
    handleStageChange(event) {
        this.selectedStage = event.detail.value;
    }
    changeCheckToFalse(){
        const chekcs={
            CheckChange__c : false
        };
        updateRecord({chekcs, recordId : this.recordId }) 
        updateRecord({CheckChange__c: false, recordId:this.recordId})
    }
    // 기회 마감 함수
    updateFiled() {
        // 업데이트할 필드 및 값 설정
        const fields = {
            StageName: this.selectedStage, // 선택한 단계로 업데이트
            CheckChange__c : true
        };
        // 업데이트할 레코드 및 필드 정보를 사용하여 updateRecord 함수 호출
        updateRecord({ fields, recordId: this.recordId })
       
        .then(() => {
            // 업데이트가 성공한 경우 토스트 메시지를 표시합니다.
            this.dispatchEvent(
                
                new ShowToastEvent({
                    title: 'Success',
                    message: `단계가 업데이트되었습니다.`,
                    variant: 'success'
                    
                })
            );
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.recordId,
                    actionName: 'view'
                }
            });
          
        })
            .catch(error => {
                // 오류 메시지 표시
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: '오류',
                       message: '기회 마감 중 오류가 발생했습니다: ' + error.body.message,
                        variant: 'error'
                    })
                );
            });
         
          
        }

        cancel(){
    
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.recordId,
                    actionName: 'view'
                }
            });
        }
    
}