package com.wak.game.application.facade;

import com.wak.game.application.request.GameStartRequest;
import com.wak.game.application.request.socket.MentionRequest;
import com.wak.game.application.response.GameStartResponse;
import com.wak.game.application.response.SummaryCountResponse;
import com.wak.game.application.response.socket.*;
import com.wak.game.application.vo.RoomVO;
import com.wak.game.domain.player.Player;
import com.wak.game.domain.player.PlayerService;
import com.wak.game.domain.player.dto.PlayerInfo;
import com.wak.game.domain.playerLog.PlayerLog;
import com.wak.game.domain.playerLog.PlayerLogService;
import com.wak.game.domain.rank.dto.RankInfo;
import com.wak.game.domain.room.dto.RoomInfo;
import com.wak.game.domain.room.Room;
import com.wak.game.domain.room.RoomService;
import com.wak.game.domain.round.Round;
import com.wak.game.domain.round.RoundService;
import com.wak.game.domain.round.dto.ClickDTO;
import com.wak.game.domain.user.User;
import com.wak.game.domain.user.UserService;
import com.wak.game.global.error.ErrorInfo;
import com.wak.game.global.error.exception.BusinessException;
import com.wak.game.global.util.RedisUtil;
import com.wak.game.global.util.SocketUtil;
import com.wak.game.global.util.TimeUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class RoundFacade {

    private final RoundService roundService;
    private final PlayerService playerService;
    private final PlayerLogService playerLogService;
    private final RoomService roomService;
    private final UserService userService;
    private final RedisUtil redisUtil;
    private final SocketUtil socketUtil;
    private final TimeUtil timeUtil;
    private final Lock lock = new ReentrantLock();

    public GameStartResponse startGame(GameStartRequest gameStartRequest, Long roomId, Long userId) {
        User user = userService.findById(userId);
        Room room = roomService.findById(roomId);

        roomService.isHost(user, room);
        roomService.isInGame(room);

        RoomInfo roomInfo = redisUtil.getLobbyRoomInfo(room.getId());

        roomInfo.gameStart();
        redisUtil.saveData("roomInfo", String.valueOf(room.getId()), roomInfo);
        redisUtil.saveData("mention", String.valueOf(room.getId()), gameStartRequest.getComment());

        roomService.gameStart(room);
        return startRound(gameStartRequest, room);
    }

    public GameStartResponse startRound(GameStartRequest gameStartRequest, Room room) {
        Round round = roundService.startRound(room, gameStartRequest);
        int playerCnt = initializeGameStatuses(room.getId(), round);

        roundService.startThread(room.getId(), round.getId(), playerCnt);

        socketUtil.sendMessage("/rooms/" + room.getId().toString(), new RoundInfoResponse(round.getId(), round.getShowNickname()));

        return GameStartResponse.of(round.getId());
    }

    @Transactional
    public int initializeGameStatuses(Long roomId, Round round) {
        System.out.println("\n\n------PLAYER, RANK 초기화-----");
        Room room = roomService.findById(roomId);
        Map<String, RoomVO> map = redisUtil.getRoomUsersInfo(room.getId());

        List<Player> players = new ArrayList<>();
        List<PlayerInfo> p = new ArrayList<>();

        for (Map.Entry<String, RoomVO> entry : map.entrySet()) {
            RoomVO roomUser = entry.getValue();
            PlayerInfo gameUser = new PlayerInfo(round.getId(), roomUser.userId(), roomUser.color(), roomUser.nickname(), roomUser.team(), roomUser.isHost(), 1);
            RankInfo rankInfo = RankInfo.builder()
                    .killCnt(0)
                    .nickname(roomUser.nickname())
                    .userId(roomUser.userId())
                    .color(roomUser.color())
                    .build();
            p.add(gameUser);

            String userKey = "roomId:" + room.getId() + ":users";
            String rankKey = "roomId:" + room.getId() + ":ranks";

            redisUtil.saveData(userKey, roomUser.userId().toString(), gameUser);
            redisUtil.saveData(rankKey, roomUser.userId().toString(), rankInfo);

            User user = userService.findById(roomUser.userId());

            Player player = Player.builder()
                    .user(user)
                    .round(round)
                    .stamina(1)
                    .aliveTime("0")
                    .killCount(0)
                    .rank(0)
                    .isPlayer(true)
                    .team(roomUser.team().equals("A") ? 1 : 2)
                    .isQueen(false)
                    .build();

            players.add(player);
        }

        BattleFeildInGameResponse battleFeildInGameResponse = new BattleFeildInGameResponse(false, p);

        playerService.savePlayers(players);

        redisUtil.saveData("room:round", room.getId().toString(), round.getId());
        socketUtil.sendMessage("/games/" + room.getId().toString() + "/battle-field", battleFeildInGameResponse);
        return players.size();
    }

    public Round startNextRound(Round previousRound) {
        return roundService.startNextRound(previousRound);
    }

    @Transactional
    public void endRound(Long roomId, Long roundId) {
        System.out.println("\n\n player업데이트 하는 메서드");
        Round round = roundService.findById(roundId);
        round.finish();
        roundService.save(round);

        Room room = roomService.findById(round.getRoom().getId());
        roomService.isNotInGame(room);

        List<ClickDTO> attacks = redisUtil.getListData("roomId:" + roomId + ":availableClicks", ClickDTO.class);
        Map<Long, Player> playerMap = playerService.getPlayerMap(roundId);

        Long startTime = timeUtil.toNanoOfEpoch(round.getCreatedAt());

        if (round.getRoundNumber() != 1) {
            startTime -= 30 * 1_000_000_000L;
        }

        for (ClickDTO attack : attacks) {
            Long murderId = attack.getUserId();
            Player murderPlayer = playerMap.get(murderId);
            Long victimId = attack.getVictimId();
            Player victimPlayer = playerMap.get(victimId);

            if (victimPlayer == null && murderPlayer == null)
                throw new BusinessException(ErrorInfo.PLAYER_NOT_FOUND);

            Long attackTime = attack.getNanoSec();
            long aliveTime = attackTime - startTime;

            victimPlayer.updateOnAttack(murderPlayer, Long.toString(aliveTime));
            playerService.save(victimPlayer);
        }


        updateRanks(room, playerMap);

        savePlayerLogs(roomId, roundId);
        clearRedis(roomId);
    }

    @Transactional
    public void sendResult(Long roomId, Long roundId, Long nextRoundId, Long round1Id, Long round2Id, Long round3Id) { // 변경된 부분
        Round round = roundService.findById(roundId);
        int playTime;

        if (round.getRoundNumber() == 1) {
            playTime = (int) ChronoUnit.SECONDS.between(round.getUpdatedAt(), round.getCreatedAt());
        } else {
            playTime = (int) ChronoUnit.SECONDS.between(round.getUpdatedAt(), round.getCreatedAt()) - 30;
        }
        playTime = Math.abs(playTime);

        List<ResultResponse> results = new ArrayList<>();

        Map<Long, Player> playerMap = playerService.getPlayerMap(roundId);

        for (Player player : playerMap.values()) {
            Player murderPlayer = player.getMurderPlayer();

            if (murderPlayer == null) {
                results.add(new ResultResponse(
                        player.getUser().getId(),
                        player.getRank(),
                        player.getKillCount(),
                        playTime,
                        timeUtil.nanoToDouble(Long.parseLong(player.getAliveTime())),
                        "",
                        ""
                ));
                continue;
            }

            User murderUser = userService.findById(murderPlayer.getUser().getId());
            String murderNickname = murderUser.getNickname();
            String murderColor = murderUser.getColor().getHexColor();

            User playerUser = userService.findById(player.getUser().getId());

            results.add(new ResultResponse(
                    player.getUser().getId(),
                    player.getRank(),
                    player.getKillCount(),
                    playTime,
                    timeUtil.nanoToDouble(Long.parseLong(player.getAliveTime())),
                    murderNickname,
                    murderColor
            ));

        }

        List<FinalResultResponse> finals = null;
        if (round3Id != null) {
            finals = getFinalResult(round1Id, round2Id, round3Id);
            finals.sort(Comparator.comparingInt(FinalResultResponse::getFinalRank).reversed());
        }

        System.out.println("RoundEndResultResponse반환");
        socketUtil.sendMessage("/games/" + roomId + "/battle-field",
                new RoundEndResultResponse(true,
                        round.getRoundNumber(),
                        nextRoundId,
                        results,
                        finals
                )
        );
    }

    private List<FinalResultResponse> getFinalResult(Long round1Id, Long round2Id, Long round3Id) {

        System.out.println("3라운드라서 최종결과 추가");

        List<FinalResultResponse> finalResults = new ArrayList<>();

        Map<Long, Player> playerR1Map = playerService.getPlayerMap(round1Id);
        Map<Long, Player> playerR2Map = playerService.getPlayerMap(round2Id);
        Map<Long, Player> playerR3Map = playerService.getPlayerMap(round3Id);

        Round round1 = roundService.findById(round1Id);
        Round round2 = roundService.findById(round2Id);
        Round round3 = roundService.findById(round3Id);

        int r1Time = (int) ChronoUnit.SECONDS.between(round1.getCreatedAt(), round1.getUpdatedAt());
        int r2Time = (int) ChronoUnit.SECONDS.between(round2.getCreatedAt(), round2.getUpdatedAt()) - 30;
        int r3Time = (int) ChronoUnit.SECONDS.between(round3.getCreatedAt(), round3.getUpdatedAt()) - 30;

        int totalGameTime = r1Time + r2Time + r3Time;

        for (Player playerR1 : playerR1Map.values()) {
            Long userId = playerR1.getUser().getId();

            Player playerR2 = playerR2Map.get(userId);
            Player playerR3 = playerR3Map.get(userId);

            int totalKillCount = playerR1.getKillCount() + (playerR2 != null ? playerR2.getKillCount() : 0) + (playerR3 != null ? playerR3.getKillCount() : 0);

            long totalAliveNanoTime = parseNanoTime(playerR1.getAliveTime())
                    + (playerR2 != null ? parseNanoTime(playerR2.getAliveTime()) : 0)
                    + (playerR3 != null ? parseNanoTime(playerR3.getAliveTime()) : 0);

            double totalAliveTime = timeUtil.nanoToDouble(totalAliveNanoTime);

            finalResults.add(new FinalResultResponse(userId, totalGameTime, totalAliveTime, totalKillCount));
        }

        finalResults.sort(Comparator.comparing(FinalResultResponse::getTotalKillCount).reversed()
                .thenComparing(FinalResultResponse::getTotalAliveTime));

        String winnerName = null;
        String winnerColor = null;
        for (int i = 0; i < finalResults.size(); i++) {
            if (i == 0) {
                winnerName = userService.findById(finalResults.get(i).getUserId()).toString();
                winnerColor = userService.findById(finalResults.get(i).getUserId()).getColor().getHexColor();
            }
            finalResults.get(i).updateRank(i + 1);
            finalResults.get(i).updateWinner(winnerName, winnerColor);
        }

        return finalResults;
    }

    private long parseNanoTime(String nanoTime) {
        try {
            return Long.parseLong(nanoTime) * 1_000_000_000L;
        } catch (NumberFormatException e) {
            throw new BusinessException(ErrorInfo.THREAD_FORMAT_NOT_MATCHED);
        }
    }

    private void savePlayerLogs(Long roomId, Long roundId) {
        List<ClickDTO> data = redisUtil.getListData("roomId:" + roomId + ":clicks", ClickDTO.class);

        if (data == null || data.isEmpty()) {
            throw new BusinessException(ErrorInfo.ClICK_LOG_IS_EMPTY);
        }

        Map<Long, Player> playerMap = playerService.getPlayerMap(roundId);

        List<PlayerLog> logs = data.stream()
                .map(click -> playerLogService.createPlayerLog(click, playerMap))
                .collect(Collectors.toList());

        playerLogService.saveAll(logs);
    }


    @Transactional
    protected void updateRanks(Room room, Map<Long, Player> playersMap) {
        Map<String, RankInfo> ranks = redisUtil.getData("roomId:" + room.getId() + ":ranks", RankInfo.class);

        List<RankInfo> sortedRanks = new ArrayList<>(ranks.values());
        sortedRanks.sort((r1, r2) -> Integer.compare(r2.getKillCnt(), r1.getKillCnt()));

        int rank = 1;
        for (RankInfo rankInfo : sortedRanks) {
            Long userId = rankInfo.getUserId();
            Player player = playersMap.get(userId);

            if (player == null)
                throw new BusinessException(ErrorInfo.PLAYER_NOT_FOUND);

            player.updateRankAncKillCnt(rankInfo.getKillCnt(), rank++);
            playerService.save(player);
        }
    }

    private void clearRedis(Long roomId) {
        String firstKey = "roomId:" + roomId;

        redisUtil.deleteKey(firstKey + ":users");
        redisUtil.deleteKey(firstKey + ":ranks");
        redisUtil.deleteKey(firstKey + ":clicks");
        redisUtil.deleteKey(firstKey + ":availableClicks");
    }

    public void endGame(Long roomId) {
        Room room = roomService.findById(roomId);
        RoomInfo roomInfo = redisUtil.getLobbyRoomInfo(room.getId());

        roomInfo.gameEnd();
        roomService.gameEnd(room);
        redisUtil.saveData("roomInfo", String.valueOf(room.getId()), roomInfo);

        roundService.endThread(roomId);
        //todo 로비 vs 게임대기실
        socketUtil.sendRoomList();
    }

    public void sendDashBoard(long roomId, int roundNumber) {
        SummaryCountResponse summaryCount = roundService.getSummaryCount(roomId, roundNumber);
        socketUtil.sendMessage("/games/" + roomId + "/dashboard", summaryCount);
    }

    public void sendBattleField(long roomId, boolean isFinished) {
        roomService.findById(roomId);

        String key = "roomId:" + roomId + ":users";
        Map<String, PlayerInfo> data = redisUtil.getData(key, PlayerInfo.class);

        List<PlayerInfo> players = new ArrayList<>();

        for (Map.Entry<String, PlayerInfo> entry : data.entrySet()) {
            players.add(entry.getValue());
        }

        socketUtil.sendMessage("/games/" + roomId + "/battle-field", new BattleFeildInGameResponse(isFinished, players));
    }

    public void sendMention(Long roomId) {
        Map<String, String> mentions = redisUtil.getData("mention", String.class);
        String mention = mentions.get(roomId.toString());
        Room room = roomService.findById(roomId);
        User host = room.getUser();
        socketUtil.sendMessage("/games/" + roomId + "/mention", new MentionResponse(mention, host.getNickname(), host.getColor().getHexColor()));
    }

    @Transactional
    public void saveMention(Long userId, MentionRequest mentionRequest) {
        User user = userService.findById(userId);
        Room room = roomService.findById(mentionRequest.roomId());
        Round round = roundService.getRound(room.getId());

        socketUtil.sendMessage("/games/" + mentionRequest.roomId() + "/mention", new MentionResponse(mentionRequest.mention(), user.getNickname(), user.getColor().getHexColor()));

        round.updateAggro(mentionRequest.mention());
        roundService.save(round);
    }

    public void sendTime(Long roomId, int time) {
        new Thread(() -> {
            try {
                for (int sec = time; sec >= 0; sec--) {
                    socketUtil.sendMessage("/games/" + roomId + "/time", new TimeResponse(sec));
                    Thread.sleep(1000);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
}
