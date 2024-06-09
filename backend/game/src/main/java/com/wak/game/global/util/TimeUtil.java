package com.wak.game.global.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Slf4j
@RequiredArgsConstructor
@Component
public class TimeUtil {
    public Long getCurrentTimeInNanos() {
        Instant now = Instant.now();
        return now.getEpochSecond() * 1_000_000_000L + now.getNano();
    }
    public Long toNanoOfEpoch(LocalDateTime dateTime) {
        Instant instant = dateTime.toInstant(ZoneOffset.UTC);
        return instant.getEpochSecond() * 1_000_000_000L + instant.getNano();
    }
    public double nanoToDouble(long nano){
        double totalAliveTime = nano / 1_000_000_000.0;
        return Math.round(totalAliveTime * 100.0) / 100.0;
    }
}
