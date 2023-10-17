public with sharing class oppViewController {
    
    @AuraEnabled
    public static Opportunity getOppsInfo(String oppId){
       Opportunity getInfo;
       
      
        getInfo = [SELECT Id, Name, AccountId, Amount, StageName, CloseDate, OwnerId, Account.Name FROM Opportunity WHERE Id =:oppId];
        System.debug('getInfo'+ getInfo);
        return getInfo;
    }
    
    
    
    
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
            List<Opportunity> oppsInfos = new List<Opportunity>();
              for(Id oppsInfo : opportunityIds){
                  oppsInfos.add(new Opportunity(Id = oppsInfo));
              }
              if(!oppsInfos.isEmpty()) delete oppsInfos;
              
  
          }
          @AuraEnabled
          public static void createOpps(String name, Date closeDate, String stageName, Decimal amount){
            system.debug('START CreateOpps');
            try {
              
              Opportunity newRecordOpp = new Opportunity();
              // newRecordOpp.put('Name', name);
              // newRecordOpp.put('CloseDate', closeDate);
              // newRecordOpp.put('Amount', amount);
              // newRecordOpp.put('OwnerId', ownerId);
              // newRecordOpp.put('StageName', stageName);
              newRecordOpp.Name = name;
              newRecordOpp.CloseDate = closeDate;
              newRecordOpp.Amount = amount;
              newRecordOpp.StageName = stageName;
              insert newRecordOpp;
              system.debug('newRecordOpp check ::' + newRecordOpp);
              
            } catch (Exception e) {
              system.debug(e.getMessage());
            }
          }
  
          @AuraEnabled
          public static void updateOpp(Id oppId, Date closeDate, String stageName, Decimal amount){
            system.debug('START UPDATE Opps, Ids ::'+ oppId );
            Opportunity updateRecordOpp = [SELECT Id, name, accountId, amount, stageName, closeDate, ownerId, account.Name
            FROM Opportunity WHERE Id =:oppId];
            try{
              system.debug('before RecordOpp check :: ' + updateRecordOpp);
              updateRecordOpp.CloseDate = closeDate;
              updateRecordOpp.Amount = amount;
              updateRecordOpp.StageName = stageName;
              
              upsert updateRecordOpp;
              system.debug('After RecordOpp check :: ' + updateRecordOpp);
              
            }
            catch(Exception e){
              system.debug(e.getMessage());
            }
          }
      //     @AuraEnabled
  
      // public static void deleteOpps(list<Id> OppIds){
  
      //         list<Opportunity> oppToDelete = new list<Opportunity>();
  
      //         for(Id idOpp : OppIds) {
  
      //             oppToDelete.add(new Opportunity(Id = idOpp));
  
      //         }
  
      //         if(!oppToDelete.isEmpty()) {
  
      //             delete oppToDelete;
  
      //         }
  
      // }
  }