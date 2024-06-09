package com.wak.game.application.response.socket;

import java.util.List;

public record RoundEndResultResponse (boolean isFinished, int roundNumber, Long nextRoundId, List<ResultResponse> results, List<FinalResultResponse> finalResults ){
    public RoundEndResultResponse(boolean isFinished, int roundNumber, Long nextRoundId, List<ResultResponse> results, List<FinalResultResponse> finalResults) {
        this.isFinished = isFinished;
        this.roundNumber = roundNumber;
        this.nextRoundId = nextRoundId;
        this.results = results;
        this.finalResults = finalResults;
    }
}
