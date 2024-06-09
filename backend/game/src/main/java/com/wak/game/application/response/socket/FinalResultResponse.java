package com.wak.game.application.response.socket;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FinalResultResponse {
    private Long userId;
    private int totalTime;
    private double totalAliveTime;
    private int totalKillCount;
    private int finalRank;
    private String winnerNickname;
    private String winnerColor;

    public FinalResultResponse(Long userId, int totalTime, double totalAliveTime, int totalKillCount) {
        this.userId = userId;
        this.totalTime = totalTime;
        this.totalAliveTime = totalAliveTime;
        this.totalKillCount = totalKillCount;
    }

    public void updateWinner(String winnerColor, String winnerNickname) {
        this.winnerColor = winnerColor;
        this.winnerNickname = winnerNickname;
    }

    public void updateRank(int rank) {
        this.finalRank = rank;
    }
}
