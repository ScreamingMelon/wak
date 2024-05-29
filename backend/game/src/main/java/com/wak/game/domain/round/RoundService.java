package com.wak.game.domain.round;

import com.wak.game.application.facade.RankFacade;
import com.wak.game.application.facade.RoundFacade;
import com.wak.game.application.request.GameStartRequest;
import com.wak.game.application.response.SummaryCountResponse;
import com.wak.game.domain.player.dto.PlayerInfo;
import com.wak.game.domain.round.thread.ClickEventProcessor;
import com.wak.game.domain.room.Room;
import com.wak.game.global.error.ErrorInfo;
import com.wak.game.global.error.exception.BusinessException;
import com.wak.game.global.util.RedisUtil;
import com.wak.game.global.util.SocketUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Service
@RequiredArgsConstructor
public class RoundService {

    private final RoundRepository roundRepository;
    private final RedisUtil redisUtil;
    private final ApplicationContext applicationContext;
    private final Lock lock = new ReentrantLock();
    private final ConcurrentHashMap<Long, Thread> gameThreads = new ConcurrentHashMap<>();

    public Round findById(Long roundId) {
        return roundRepository.findById(roundId).orElseThrow(() -> new BusinessException(ErrorInfo.ROUND_NOT_EXIST));
    }

    @Transactional
    public Round startRound(Room room, GameStartRequest gameStartRequest) {
        Round round =  Round.builder()
                .roundNumber(1)
                .room(room)
                .aggro(gameStartRequest.getComment())
                .showNickname(gameStartRequest.isShowNickname())
                .build();
        roundRepository.save(round);
        return round;
    }

    @Transactional
    public Round startNextRound(Round previousRound) {
        Room room = previousRound.getRoom();

        Round nextRound = null;
        nextRound = Round.builder()
                .roundNumber(previousRound.getRoundNumber() + 1)
                .room(room)
                .aggro("")
                .showNickname(previousRound.getShowNickname())
                .build();

        roundRepository.save(nextRound);
        return nextRound;
    }


    public SummaryCountResponse getSummaryCount(Long roomId, int roundNumber) {
        String key = "roomId:" + roomId + ":users";
        Map<String, PlayerInfo> result = redisUtil.getData(key, PlayerInfo.class);
        int aliveCount = 0;

        for (Map.Entry<String, PlayerInfo> entry : result.entrySet()) {
            PlayerInfo player = entry.getValue();

            if (player.getStamina() > 0)
                aliveCount++;

        }

        return SummaryCountResponse.builder()
                .roundNumber(roundNumber)
                .aliveCount(aliveCount)
                .totalCount(result.size())
                .build();
    }

    public void startThread(Long roomId, Long roundId, int playerCnt) {

        RedisUtil redisUtil = applicationContext.getBean(RedisUtil.class);
        SocketUtil socketUtil = applicationContext.getBean(SocketUtil.class);
        RoundService roundService = applicationContext.getBean(RoundService.class);
        RoundFacade roundFacade = applicationContext.getBean(RoundFacade.class);
        RankFacade rankFacade = applicationContext.getBean(RankFacade.class);

        ClickEventProcessor clickProcessor = new ClickEventProcessor(roundId, roomId, playerCnt, redisUtil, socketUtil, roundService, roundFacade, rankFacade);
        Thread thread = new Thread(clickProcessor);
        thread.start();

        gameThreads.put(roomId, thread);
    }

    public void endThread(Long roomId) {
        Thread thread = gameThreads.remove(roomId);

        if (thread != null) {
            thread.interrupt();
            try {
                thread.join();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    @Transactional
    public void deleteRound(Long id) {
        roundRepository.deleteRound(id);
    }

    public void save(Round round) {
        roundRepository.save(round);
    }

    public Round getRound(Long roomId) {
        Map<String, Long> data = redisUtil.getData("room:round", Long.class);
        Long roundId = data.get(roomId.toString());

        return findById(roundId);
    }
}


