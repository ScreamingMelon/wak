package com.wak.game.domain.player;

import com.wak.game.domain.round.Round;
import com.wak.game.domain.user.User;
import com.wak.game.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "players")
public class Player extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "player_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "round_id", nullable = false)
    private Round round;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "murder_player_id")
    private Player murderPlayer;

    @Column(name = "stamina")
    private Integer stamina;

    @Column(name = "alive_time")
    private String aliveTime;

    @Column(name = "kill_cnt")
    private Integer killCount;

    @Column(name = "rank")
    private Integer rank;

    @Column(name = "is_player")
    private Boolean isPlayer;

    @Column(name = "team")
    private Integer team;

    @Column(name = "is_queen")
    private Boolean isQueen;

    @Builder
    public Player(User user, Round round, Player murderPlayer, Integer stamina, String aliveTime,
                  Integer killCount, Integer rank, Boolean isPlayer, Integer team, Boolean isQueen) {
        this.user = user;
        this.round = round;
        this.murderPlayer = murderPlayer;
        this.stamina = stamina;
        this.aliveTime = aliveTime;
        this.killCount = killCount;
        this.rank = rank;
        this.isPlayer = isPlayer;
        this.team = team;
        this.isQueen = isQueen;
    }

    public void updateOnAttack(Player murderPlayer, String aliveTime) {
        this.murderPlayer = murderPlayer;
        this.stamina -= 1;
        this.aliveTime = aliveTime;
    }

    public void updateRankAncKillCnt(int killCnt, int i) {
        this.killCount = killCnt;
        this.rank = i;
    }

    public void updateWinnerAliveTime(String time) {
        this.aliveTime = time;
    }
}
