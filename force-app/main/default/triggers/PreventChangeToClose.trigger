trigger PreventChangeToClose on Opportunity (before update) {
    for(Opportunity check : Trigger.new){
        
        boolean confirm = (check.StageName == 'Closed Won') || (check.StageName == 'Closed Lost');

        if(check.CheckChange__c == false){
            
                if(confirm){

                    check.addError('Can not change Stage on Path or DetailPage');
                }
        }
    }
    
    for (Opportunity check2 : Trigger.new) {

        Opportunity checkAfter = Trigger.oldMap.get(check2.Id);
    
        if (checkAfter != null) { // 이전 상태가 null이 아닌 경우에만 확인
            boolean confirm2 = (checkAfter.StageName == 'Closed Won' || checkAfter.StageName == 'Closed Lost');                             
    
            if (confirm2) {
                check2.addError('Cannot change to Low Stage from Closed Stage');
            }
        }
    }
    
}