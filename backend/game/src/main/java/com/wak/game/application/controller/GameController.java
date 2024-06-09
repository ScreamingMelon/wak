package com.wak.game.application.controller;

import com.wak.game.application.facade.PlayerFacade;
import com.wak.game.application.facade.RoundFacade;
import com.wak.game.application.request.socket.ClickRequest;
import com.wak.game.application.request.socket.MentionRequest;
import com.wak.game.global.token.AuthUser;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class GameController {
    private final PlayerFacade playerFacade;
    private final RoundFacade roundFacade;

    @MessageMapping("/click/{roomId}")
    public void handleClick(@Payload ClickRequest clickRequest) {
        playerFacade.saveClickLog(clickRequest);
    }

    @MessageMapping("/mention/{roomId}")
    public void setMention(@AuthUser Long userId, @Payload MentionRequest mentionRequest) {
        System.out.println("멘션 수정 요청");
        roundFacade.saveMention(userId, mentionRequest);
    }
}
