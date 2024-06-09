package com.wak.game.application.response.socket;

import jakarta.transaction.Transactional;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Transactional
@NoArgsConstructor
public class TimeResponse {
    long time;

    @Builder
    public TimeResponse(long time) {
        this.time = time;
    }
}
