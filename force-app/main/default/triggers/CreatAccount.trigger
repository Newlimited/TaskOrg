trigger CreatAccount on Custom_Account__c (After insert) {
    List<Account> recordsToInsert = new List<Account>();
    
    for (Custom_Account__c customRecord : Trigger.new) {
       
        
        Account standardRecord = new Account();
        Integer employeeNumber = Integer.valueOf(customRecord.NumberOfEmployees__c);
        standardRecord.Name = customRecord.Name;
        standardRecord.OwnerId = customRecord.OwnerId;
        standardRecord.AnnualRevenue = customRecord.AnnualRevenue__c;
        standardRecord.Website = customRecord.HomePage_Address__c;
        standardRecord.AccountNumber = customRecord.Account_No__c;
      	standardRecord.NumberOfEmployees = employeeNumber;
        recordsToInsert.add(standardRecord);
     }
    if (!recordsToInsert.isEmpty()) {
        
        insert recordsToInsert;
    }
}