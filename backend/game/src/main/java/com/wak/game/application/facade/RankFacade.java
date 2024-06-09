package com.wak.game.application.facade;

import com.wak.game.application.response.socket.RankListResponse;
import com.wak.game.domain.rank.dto.RankInfo;
import com.wak.game.domain.round.dto.ClickDTO;
import com.wak.game.global.util.RedisUtil;
import com.wak.game.global.util.SocketUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class RankFacade {
    private final RedisUtil redisUtil;
    private final SocketUtil socketUtil;

    public void sendRank(Long roomId) {
        String key = "roomId:" + roomId + ":ranks";
        Map<String, RankInfo> map = redisUtil.getData(key, RankInfo.class);

        List<RankInfo> ranks = new ArrayList<>(map.values());
        ranks.sort((r1, r2) -> Integer.compare(r2.getKillCnt(), r1.getKillCnt()));

        socketUtil.sendMessage("/games/" + roomId + "/rank", new RankListResponse(ranks));
    }

    public void updateRankings(ClickDTO click, Long roomId) {
        Long userId = click.getUserId();

        String key = "roomId:" + roomId + ":ranks";
        Map<String, RankInfo> curRoundRanks = redisUtil.getData(key, RankInfo.class);
        RankInfo rank = curRoundRanks.get(click.getUserId().toString());

        rank.updateKill();
        curRoundRanks.put(userId.toString(), rank);

        redisUtil.saveData(key, userId.toString(), rank);
    }

}
