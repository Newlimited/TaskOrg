public with sharing class ShowContact {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsForAccount(Id accountId) {
        return [SELECT Id, Salutation, FirstName, LastName, Phone, Email, Title  FROM Contact WHERE AccountId = :accountId];
    }
}