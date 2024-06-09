package com.wak.game.domain.player;

import com.wak.game.domain.round.Round;
import com.wak.game.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long>, PlayerRepositoryDSL {
    List<Player> findAllByRoundId(Long roundId);

    Optional<Player> findByUserAndRound(User user, Round round);
}
