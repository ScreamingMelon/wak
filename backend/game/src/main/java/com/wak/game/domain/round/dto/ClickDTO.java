package com.wak.game.domain.round.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ClickDTO {
    private Long userId;
    private Long victimId;
    private Long roundId;
    private String time;
    private Long nanoSec;

    @JsonCreator
    public ClickDTO(@JsonProperty("userId") Long userId,
                    @JsonProperty("victimId") Long victimId,
                    @JsonProperty("roundId") Long roundId,
                    @JsonProperty("time") String time,
                    @JsonProperty("nanoSec") Long nanoSec) {
        this.userId = userId;
        this.victimId = victimId;
        this.roundId = roundId;
        this.time = time;
        this.nanoSec = nanoSec;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getVictimId() {
        return victimId;
    }

    public Long getRoundId() {
        return roundId;
    }

    public String getTime() {
        return time;
    }

    public Long getNanoSec() {
        return nanoSec;
    }
}
