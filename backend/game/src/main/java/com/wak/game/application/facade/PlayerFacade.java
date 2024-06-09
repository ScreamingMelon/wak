package com.wak.game.application.facade;

import com.wak.game.application.request.socket.ClickRequest;
import com.wak.game.domain.player.PlayerService;
import com.wak.game.domain.room.Room;
import com.wak.game.domain.room.RoomService;
import com.wak.game.domain.round.Round;
import com.wak.game.domain.round.RoundService;
import com.wak.game.domain.round.dto.ClickDTO;
import com.wak.game.domain.user.User;
import com.wak.game.domain.user.UserService;
import com.wak.game.global.util.TimeUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class PlayerFacade {
    private final PlayerService playerService;
    private final RoundService roundService;
    private final UserService userService;
    private final RoomService roomService;
    private final TimeUtil timeUtil;

    public void saveClickLog(ClickRequest request) {

        Room room = roomService.findById(request.getRoomId());

        Round round = roundService.getRound(room.getId());
        User user = userService.findById(request.getUserId());
        User victimUser = userService.findById(request.getVictimId());

        Long currentTimeInNanos = timeUtil.getCurrentTimeInNanos();

        ClickDTO click = new ClickDTO(user.getId(), victimUser.getId(), round.getId(), request.getClickTime(), currentTimeInNanos);
        playerService.saveClickLog(room.getId(), click);
    }
}
