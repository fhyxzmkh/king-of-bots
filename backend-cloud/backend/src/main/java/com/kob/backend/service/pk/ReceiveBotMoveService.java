package com.kob.backend.service.pk;

import com.kob.backend.consumer.WebSocketServer;
import com.kob.backend.consumer.utils.Game;
import org.springframework.stereotype.Service;

@Service
public class ReceiveBotMoveService {

    public String receiveBotMove(Integer userId, Integer direction) {
        System.out.println("move-direction: " + userId + " " + direction);

        if (WebSocketServer.users.get(userId) != null) {
            Game game = WebSocketServer.users.get(userId).game;
            if (game != null) {
                if (game.getPlayerA().getId().equals(userId)) {
                    game.setNextStepA(direction);
                } else if (game.getPlayerB().getId().equals(userId)) {
                    game.setNextStepB(direction);
                }
            }
        }


        return "receive bot move success";
    }

}
