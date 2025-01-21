package com.kob.backend.service.pk;

import com.kob.backend.consumer.WebSocketServer;
import org.springframework.stereotype.Service;

@Service
public class StartGameService {

    public String startGame(Integer aId, Integer aBotId, Integer bId, Integer bBotId) {
        WebSocketServer.startGame(aId, aBotId, bId, bBotId);

        return "startGame";
    }

}
