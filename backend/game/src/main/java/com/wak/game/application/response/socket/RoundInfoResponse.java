package com.wak.game.application.response.socket;

public record RoundInfoResponse(Long roundId, boolean showNickname) {
    public RoundInfoResponse(Long roundId, boolean showNickname) {
        this.roundId = roundId;
        this.showNickname = showNickname;
    }
}
