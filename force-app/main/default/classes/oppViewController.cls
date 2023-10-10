public with sharing class oppViewController {
    
  @AuraEnabled(cacheable=True)
  public static List<Opportunity>  getOpportunities(){
    return [SELECT Id, Name, AccountId, Amount, StageName, CloseDate, OwnerId  FROM Opportunity LIMIT 1000 ];
       
    }

    @AuraEnabled(cacheable=True)
    public static List<Opportunity> searchOpportunities(String searchName){
        List<Opportunity> opps = [SELECT Id, Name FROM Opportunity WHERE Name LIKE '%[searchName]%' LIMIT 1];
      return opps;
    }
  
  @AuraEnabled(cacheable=True)
  public static List<Opportunity> recentlyView(){
    List<Opportunity> recentOpps = [SELECT Id, Name, AccountId, Amount, StageName, CloseDate, OwnerId  
    FROM Opportunity ORDER BY LastViewedDate ASC LIMIT 100];

    return recentOpps;
  }
  @AuraEnabled
  public static void deleteOpps(List<Id> opportunityIds){
      if(opportunityIds.size() > 0 ){
          delete [SELECT Id FROM Opportunity WHERE Id in: opportunityIds];
      }
  }
}