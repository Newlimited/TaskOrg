trigger CheckAmount on Opportunity (after update) {
   //리스트에 담아서 하기
    for (Opportunity customRecord : Trigger.new) {
        // 특정 단계 이상으로 이동할 수 없도록 조건을 검사합니다.
        if (customRecord.StageName == 'Proposal/Price Quote' && customRecord.Amount == 0) {
            // 업데이트를 중단하고 오류 메시지를 표시합니다.
            customRecord.addError('금액을 입력 하여야 합니다.');
        }
    }
}