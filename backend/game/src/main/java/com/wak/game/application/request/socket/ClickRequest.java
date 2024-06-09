package com.wak.game.application.request.socket;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@ToString
@NoArgsConstructor
public class ClickRequest {
    private Long roomId;
    private Long roundId;
    private Long userId;
    private Long victimId;
    private String clickTime;

    @Builder
    public ClickRequest(Long roomId, Long roundId, Long userId, long victimId, String clickTime) {
        this.roomId = roomId;
        this.roundId = roundId;
        this.userId = userId;
        this.victimId = victimId;
        this.clickTime = clickTime;
    }
}
