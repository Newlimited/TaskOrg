trigger DeleteAccount on Custom_Account__c (After delete) {
   
   List<Account> recordOnStandard = new List<Account>();

    // Custom_Object__c 레코드가 삭제되었으므로 이에 연관된 Standard_Object__c 레코드를 검색합니다.
    for (Custom_Account__c customRecord : Trigger.old) {
        // Custom_Object__c 레코드로부터 필요한 정보를 추출합니다.
        String customFieldValue = customRecord.Account_No__c;

        
        List<Account> relatedRecords = [SELECT Id FROM Account WHERE AccountNumber = :customFieldValue];

        recordOnStandard.addAll(relatedRecords);
    }

    
    if (!recordOnStandard.isEmpty()) {
        delete recordOnStandard;
    }


}