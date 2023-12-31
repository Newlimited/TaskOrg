public with sharing class oppViewController {
    
  @AuraEnabled
  public static List<Opportunity> getOpportunities(){
    return [SELECT Id, Name, AccountId, Amount, StageName, CloseDate, OwnerId, Account.Name  
    FROM Opportunity 
    ORDER BY Name ASC LIMIT 1000 ];
    }
    // @AuraEnabled(cacheable=True)
    // public static List<Opportunity> searchOpportunity(String searchString){
    //   List<List<SObject>> opportunities = [FIND :searchString IN Name FIELDS RETURNING 
    //     Opportunity(Id, Name, accountId, amount, stageName, closeDate, ownerId, account.Name)];
     
    //     return (List<Opportunity>) opportunities[0];
    // }

  // wire를 쓰지 않을 때는 caheable을 지워준다. => 계속 값이 변경 될때 마다 실행시키기 때문에.

    @AuraEnabled
    public static List<Opportunity> searchOpportunity(String searchString){
      String searchKeyword = '%' + searchString + '%';
      List<Opportunity> resultSearch =[SELECT Id, Name, AccountId, Amount, StageName, CloseDate, OwnerId, Account.Name 
      FROM Opportunity WHERE Name LIKE :searchKeyword LIMIT 100];
      
      return resultSearch;
    }  
  @AuraEnabled
  public static List<Opportunity> recentlyView(){
    List<Opportunity> recentOpps = [SELECT Id, name, accountId, amount, stageName, closeDate, ownerId, account.Name 
    FROM Opportunity ORDER BY LastviewedDate ASC LIMIT 100];
    // LastViewedDate
    return recentOpps;
  }
  @AuraEnabled
  public static void deleteOpps(List<Id> opportunityIds){
      if(opportunityIds.size() > 0 ){
          delete [SELECT Id FROM Opportunity WHERE Id in: opportunityIds];
      }
  }
}