// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

string tempvar = 'Enter_your_name_here';
System.debug('Hello World!');
System.debug('My name is ' + tempvar);

String searchKeyword = '%ap%';
System.debug([SELECT Id, Name, AccountId, Amount, StageName, CloseDate, OwnerId, Account.Name 
      FROM Opportunity WHERE Name LIKE :searchKeyword LIMIT 100]);

      //sfdx excute annonymous APex 테스트시 테스트 할 코드 드래그 