trigger UpdateRecord on Custom_Account__c (after Update) {
   
    List<Account> updatedRecord = new List<Account>();
       
   if(Trigger.isUpdate) { // 업데이트 되었는지 확인
        
        for (Custom_Account__c newRecord : Trigger.new) {
            	// 새로운 레코드 불러오기 
                
		Account contentsUpdate = [SELECT Id FROM Account WHERE AccountNumber = :newRecord.Account_No__c LIMIT 1];
		contentsUpdate.Name = newRecord.Name;
		contentsUpdate.AnnualRevenue = newRecord.AnnualRevenue__c;
		Integer countOfEmployee = Integer.valueOf(Math.round(newRecord.NumberOfEmployees__c)); 
		contentsUpdate.Website = newRecord.HomePage_Address__c;
		contentsUpdate.NumberOfEmployees = countOfEmployee;
		updatedRecord.add(contentsUpdate);
      }
     update updatedRecord;
    }
}