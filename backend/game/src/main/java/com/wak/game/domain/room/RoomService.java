package com.wak.game.domain.room;

import com.wak.game.application.vo.RoomVO;
import com.wak.game.domain.user.User;
import com.wak.game.global.error.ErrorInfo;
import com.wak.game.global.error.exception.BusinessException;
import com.wak.game.global.util.RedisUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RedisUtil redisUtil;

    private final RedisTemplate<String, Object> redisTemplate;

    public Room findById(Long roomId) {
        return roomRepository.findById(roomId).orElseThrow(() -> new BusinessException(ErrorInfo.ROOM_NOT_EXIST));
    }

    public Room findByUser(User user){
        return roomRepository.findByUser(user).orElseThrow(() -> new BusinessException(ErrorInfo.ROOM_NOT_EXIST));
    }

    public boolean checkPassword(Room room, String password) {
        if (room.getRoomPassword().equals("") || room.getRoomPassword() == null) return true;
        if (room.getRoomPassword().equals(password)) return true;
        else throw new BusinessException(ErrorInfo.ROOM_PASSWORD_IS_WRONG);
    }

    public void deleteRoom(Room room) {
        roomRepository.deleteRoom(room.getId());
    }

    //C U
    public void saveObject(String key, String hashkey, Object data) {
        redisTemplate.opsForHash().put(key, hashkey, data);
    }

    public boolean isHost(User user, Room room) {
        RoomVO userRoom = redisUtil.getRoomUserInfo(room.getId(), user);
        if(userRoom.isHost())
            return true;

        throw new BusinessException(ErrorInfo.ROOM_NOT_HOST);
    }

    public <T> Map<String, T> getData(String key, Class<T> classType) {
        Map<Object, Object> rawMap = redisTemplate.opsForHash().entries(key);
        Map<String, T> typedMap = new HashMap<>();
        for (Map.Entry<Object, Object> entry : rawMap.entrySet()) {
            typedMap.put((String) entry.getKey(), classType.cast(entry.getValue()));
        }
        return typedMap;
    }
    public Room save(User user, String roomName, String roomPassword, short limitPlayer, RoomType mode){
       if (roomRepository.findByUser(user).orElse(null) != null)
           throw new BusinessException(ErrorInfo.ROOM_ALREADY_EXIST);
        return roomRepository.save(Room.builder()
                .user(user)
                .roomName(roomName)
                .roomPassword(roomPassword)
                .limitPlayers(limitPlayer)
                .mode(mode)
                .build());
    }

    public void isInGame(Room room) {
        if(room.isStart())
            throw new BusinessException(ErrorInfo.ROOM_ALREADY_STARTED);
    }

    public void isNotInGame(Room room) {
        if(!room.isStart())
            throw new BusinessException(ErrorInfo.ROOM_ALREADY_ENDED);
    }

    @Transactional
    public void gameStart(Room room) {
        roomRepository.startGame(room.getId());
    }

    @Transactional
    public void gameEnd(Room room) {
        roomRepository.endGame(room.getId());
    }
}
