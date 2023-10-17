public with sharing class productListController {


    @AuraEnabled
    public static Product2 getProductInfo(String productId){
       Product2 getInfo;
        
        getInfo =[SELECT Id, ProductCode, Name, Description, Description__c, Types__c, Weight__c, DivisionName__c, CarTypeName__c, Brand__c, Pattern__c, SalesPattern__c, Size__c, TireType__c, Performance__c FROM Product2 WHERE Id=:productId];
        System.debug('getInfo'+ getInfo);
        return getInfo;
    }

    @AuraEnabled
      public static List<Product2> getProducts(){
        
        return [SELECT Id, ProductCode, Name, Description, Description__c, 
        Types__c, Weight__c, DivisionName__c, CarTypeName__c, Brand__c, Pattern__c, SalesPattern__c, Size__c, TireType__c, Performance__c FROM Product2 ORDER BY Name ASC LIMIT 1000];
        }


        @AuraEnabled
        public static List<Product2> recentlyViewProduct(){
          List<Product2> recentProduct = [SELECT Id, ProductCode, Name, Description, Description__c, 
          Types__c, Weight__c, DivisionName__c, CarTypeName__c, Brand__c, Pattern__c, SalesPattern__c, Size__c, TireType__c, Performance__c 
          FROM Product2 ORDER BY LastViewedDate ASC LIMIT 300];
          // LastViewedDate
          return recentProduct;
        }
        @AuraEnabled
        public static List<Product2> searchProduct(String searchString){
          String searchKeyword = '%' + searchString + '%';
          List<Product2> resultSearch =[SELECT Id, ProductCode, Name, Description, Description__c, 
          Types__c, Weight__c, DivisionName__c, CarTypeName__c, Brand__c, Pattern__c, SalesPattern__c, Size__c, TireType__c, Performance__c 
          FROM Product2 WHERE Name LIKE :searchKeyword OR ProductCode LIKE :searchKeyword OR Brand__c LIKE :searchKeyword OR TireType__c LIKE :searchKeyword OR CarTypeName__c LIKE :searchKeyword LIMIT 100];
          
          return resultSearch;
        }

        @AuraEnabled
        public static void updateProduct(Id productId, String description, String descriptionDetail){
          system.debug('START UPDATE Opps, Ids ::'+ productId );
          Product2 updateRecordPro = [SELECT Id, ProductCode, Name, Description, Description__c, 
          Types__c, Weight__c, DivisionName__c, CarTypeName__c, Brand__c, Pattern__c, SalesPattern__c, Size__c, TireType__c, Performance__c
          FROM Product2 WHERE Id =:productId];
        
          try{
            system.debug('before RecordOpp check :: ' + updateRecordPro);
            updateRecordPro.Description = description;
            updateRecordPro.Description__c = descriptionDetail;
           
            if(updateRecordPro.CreatedById == updateRecordPro.LastModifiedById){
            upsert updateRecordPro;
            system.debug('After RecordOpp check :: ' + updateRecordPro);
            
          }}
          catch(Exception e){
            system.debug(e.getMessage());
          }
        }
}