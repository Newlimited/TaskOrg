public with sharing class LeadListViewController {
   
    @AuraEnabled(cacheable=True)
    public static List<Lead> getLeads(){
       
        return [SELECT Name, Title, Company, MobilePhone, Email, State  FROM Lead LIMIT 1000];

}
    @AuraEnabled(cacheable=True)
    public static List<Lead> searchLead(String searchString){
    List<List<SObject>> leads = [FIND :searchString IN ALL FIELDS RETURNING Lead(Name, Title, Company, MobilePhone, Email, State)];

    return (List<Lead>) leads[0];
}

    @AuraEnabled
    public static void deleteLeads(List<Id> leadIds){
    if(leadIds.size() > 0 ){
        delete [SELECT Id FROM Lead WHERE Id in: leadIds];
    }
}

}