package com.wak.game.application.response.socket;

public record ResultResponse(Long userId, int rank, int killCount, int playTime, double aliveTime, String victim,
                             String victimColor) {
}

