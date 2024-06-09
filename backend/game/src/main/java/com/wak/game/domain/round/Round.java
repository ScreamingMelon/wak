package com.wak.game.domain.round;

import com.wak.game.domain.room.Room;
import com.wak.game.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "rounds")
public class Round extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "round_id", nullable = false)
    private Long id;

    @Column(name = "round_number", nullable = false)
    private int roundNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "aggro")
    private String aggro;

    @Column(name = "show_nickname")
    private Boolean showNickname;

    @Builder
    public Round(int roundNumber, Room room, String aggro, Boolean showNickname) {
        this.roundNumber = roundNumber;
        this.room = room;
        this.aggro = aggro;
        this.showNickname = showNickname;
    }

    public void finish() {
        updateDeleted(true);
    }

    public void updateAggro(String mention) {
        this.aggro = mention;
    }
}
