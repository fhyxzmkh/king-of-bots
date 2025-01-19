package com.kob.backend.service.pk;

import com.kob.backend.consumer.WebSocketServer;
import org.springframework.stereotype.Service;

@Service
public class StartGameService {

    public String startGame(Integer aId, Integer bId) {
        WebSocketServer.startGame(aId, bId);

        return "startGame";
    }

}
