
package com.wak.game.application.request.socket;
public record MentionRequest(Long user, Long roomId, Long roundId, Long nextRoundId, String mention) {
    public MentionRequest(Long user, Long roomId, Long roundId, Long nextRoundId, String mention) {
        this.user = user;
        this.roomId = roomId;
        this.roundId = roundId;
        this.nextRoundId = nextRoundId;
        this.mention = mention;
    }

}//멘션 비어있는거 보니까 진짜 멘션 요청이 오는것같기도 함

