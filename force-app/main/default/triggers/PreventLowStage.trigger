trigger PreventLowStage on Opportunity(before update) {
     for (Opportunity newRecord : Trigger.new) {
        Opportunity beforeRecord = Trigger.oldMap.get(newRecord.Id);

         Map<String, Integer> stageOrder = new Map<String, Integer>{
             
        'Prospecting' => 1,
        'Qualification' => 2,
        'Needs Analysis' => 3,
        'Value Proposition' => 4,
        'Id. Decision Makers' => 5,
        'Perception Analysis' => 6,
        'Proposal/Price Quote' => 7,
        'Negotiation/Review' => 8
        
    };
        if (beforeRecord != null) {
            String beforeStage = beforeRecord.StageName;
            String afterStage = newRecord.StageName;
               Integer oldOrder = stageOrder.get(beforeStage);
            Integer newOrder = stageOrder.get(afterStage);

            // 선택 목록 값 비교
            if (oldOrder > newOrder) {
                newRecord.StageName = beforeStage; 
                newRecord.addError('하위 단계로 이동할 수 없습니다.'); 
            }
        }
    }
}