// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

string tempvar = 'Enter_your_name_here';
System.debug('Hello World!');
System.debug('My name is ' + tempvar);

system.debug([SELECT Id, ProductCode, Name, Description, Description__c, 
Types__c, Weight__c, Division__c, CarTypeName__c, Brand__c, Pattern__c, SalesPattern__c, Size__c, TireType__c, Performance__c FROM Product2 ORDER BY Name ASC LIMIT 1000]);
