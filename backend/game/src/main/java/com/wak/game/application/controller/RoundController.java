package com.wak.game.application.controller;

import com.wak.game.application.facade.RankFacade;
import com.wak.game.application.request.GameStartRequest;
import com.wak.game.application.facade.RoundFacade;
import com.wak.game.application.response.GameStartResponse;
import com.wak.game.global.error.ErrorInfo;
import com.wak.game.global.token.AuthUser;
import com.wak.game.global.util.ApiErrorExamples;
import com.wak.game.global.util.ApiResult;
import com.wak.game.global.util.ApiUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/games")
public class RoundController {
    private final RoundFacade roundFacade;
    private final RankFacade rankFacade;


    @Operation(
            summary = "게임 시작",
            description = "게임을 시작하는 API 입니다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "게임 시작 성공", content = @Content(schema = @Schema(implementation = ApiResult.class)))
            },
            security = {@SecurityRequirement(name = "Access-Token")}
    )
    @ApiErrorExamples({ErrorInfo.USER_NOT_EXIST, ErrorInfo.ROOM_NOT_EXIST, ErrorInfo.ROOM_NOT_HOST, ErrorInfo.ROUND_NOT_EXIST, ErrorInfo.ROOM_ALREADY_STARTED, ErrorInfo.ROOM_ALREADY_STARTED})
    @PostMapping("/start/{room-id}")
    public ResponseEntity<ApiResult<GameStartResponse>> startGame(@RequestBody GameStartRequest gameStartRequest, @PathVariable("room-id") Long roomId, @AuthUser Long userId) {
        System.out.println("startGame 요청");
        GameStartResponse gameStartResponse = roundFacade.startGame(gameStartRequest, roomId, userId);
        return ResponseEntity.ok(ApiUtils.success(gameStartResponse));
    }

    @Operation(
            summary = "게임 시작 시 publish 요청",
            description = "게임 시작 시 랭킹에 대한 정보를 publish 요청하는 API 입니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Rank 초기값 반환 성공")
            },
            security = {@SecurityRequirement(name = "Access-Token")}
    )
    @GetMapping("/{round-id}/rank")
    public ResponseEntity<ApiResult<Void>> getRank(@DestinationVariable("round-id") Long roundId) {
        rankFacade.sendRank(roundId);
        return ResponseEntity.ok(ApiUtils.success(null));
    }

    @Operation(
            summary = "게임 입장시 게임 참여 유저들 정보 반환",
            description = "게임 입장시 게임 참여 유저들 정보를 publish 요청하는 API 입니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "게임 입장 성공")
            },
            security = {@SecurityRequirement(name = "Access-Token")}
    )
    @GetMapping("/{roomId}/battle-field")
    public ResponseEntity<ApiResult<Void>> publishBattleField(@PathVariable Long roomId) {
        System.out.println("겟겟");
        roundFacade.sendBattleField(roomId, false);
        roundFacade.sendDashBoard(roomId,1);
        roundFacade.sendTime(roomId, 5);
        return ResponseEntity.ok(ApiUtils.success(null));
    }

    @Operation(
            summary = "게임 입장시 도발 멘트 반환",
            description = "게임 입장시 도발멘트를 publish 요청하는 API 입니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "도발멘트 반환 성공")
            },
            security = {@SecurityRequirement(name = "Access-Token")}
    )
    @GetMapping("/{roomId}/mention")
    public ResponseEntity<ApiResult<Void>> publishMention(@PathVariable Long roomId) {
        roundFacade.sendMention(roomId);
        return ResponseEntity.ok(ApiUtils.success(null));
    }
}


