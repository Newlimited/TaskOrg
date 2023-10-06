public with sharing class LeadListViewController {
   
    @AuraEnabled(cacheable=True)
    public static List<Lead> getLeads(){
       
        return [SELECT Name, Title, Company, MobilePhone, Email, State  FROM Lead LIMIT 1000];

}
}