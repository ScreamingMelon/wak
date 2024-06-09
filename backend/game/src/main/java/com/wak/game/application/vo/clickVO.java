package com.wak.game.application.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;

public record clickVO(Long userId, Long victimId, Long roundId, String time, Long nanoSec) {
    public clickVO {
    }
}