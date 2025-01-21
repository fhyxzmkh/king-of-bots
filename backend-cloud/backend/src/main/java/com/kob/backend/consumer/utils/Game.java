package com.kob.backend.consumer.utils;

import com.alibaba.fastjson.JSONObject;
import com.kob.backend.consumer.WebSocketServer;
import com.kob.backend.entity.Bot;
import com.kob.backend.entity.Record;
import lombok.Getter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.concurrent.locks.ReentrantLock;

public class Game extends Thread{

    final private Integer rows;

    final private Integer cols;

    final private Integer inner_walls_count;

    @Getter
    private boolean[][] g;

    final static private int[] dx = {-1, 0, 1, 0};
    final static private int[] dy = {0, 1, 0, -1};

    @Getter
    private final Player playerA;

    @Getter
    private final Player playerB;

    private String status = "playing"; // playing finished

    private String loser = ""; // all:平局 A:A输 B:B输

    private Integer nextStepA = null;

    private Integer nextStepB = null;

    private final ReentrantLock lock = new ReentrantLock();

    private final static String addBotUrl = "http://127.0.0.1:8688/api/bot/add";

    private static boolean isFirst = true;


    public Game(Integer rows, Integer cols, Integer inner_walls_count, Integer idA, Bot botA, Integer idB, Bot botB) {
        this.rows = rows;
        this.cols = cols;
        this.inner_walls_count = inner_walls_count;
        this.g = new boolean[rows][cols];

        Integer botAId = (botA == null ? -1 : botA.getId());
        String botACode = (botA == null ? "" : botA.getContent());

        Integer botBId = (botB == null ? -1 : botB.getId());
        String botBCode = (botB == null ? "" : botB.getContent());

        this.playerA = new Player(idA, botAId, botACode, rows - 2, 1, new ArrayList<>());
        this.playerB = new Player(idB, botBId, botBCode, 1, cols - 2, new ArrayList<>());
    }

    // 检查从 (sx, sy) 到 (tx, ty) 是否连通
    private boolean checkConnectivity(int sx, int sy, int tx, int ty) {
        if (sx < 0 || sx >= this.rows || sy < 0 || sy >= this.cols || g[sx][sy]) {
            return false;
        }

        if (sx == tx && sy == ty) {
            return true;
        }

        g[sx][sy] = true; // 标记当前点已访问

        for (int i = 0; i < 4; i++) {
            int x = sx + dx[i];
            int y = sy + dy[i];
            if (checkConnectivity(x, y, tx, ty)) {
                g[sx][sy] = false; // 恢复当前点为未访问状态
                return true;
            }
        }

        g[sx][sy] = false; // 恢复当前点为未访问状态
        return false;
    }

    private boolean draw() {

         for (int r = 0; r < this.rows; r++) {
           for (int c = 0; c < this.cols; c++) {
             g[r][c] = false;
           }
         }

        // 给四周加上障碍物
        for (int r = 0; r < this.rows; r++) {
            g[r][0] = g[r][this.cols - 1] = true;
        }

        for (int c = 0; c < this.cols; c++) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建随机障碍物
        Random random = new Random();

        for (int i = 0; i < this.inner_walls_count / 2; i++) {
            for (int j = 0; j < 1000; ++ j) {
                int r = random.nextInt(this.rows); // 随机生成行索引
                int c = random.nextInt(this.cols); // 随机生成列索引

                // 如果当前位置或对称位置已经有障碍物，则跳过
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) {
                    continue;
                }

                // 如果随机位置是起点或终点附近，则跳过
                if ((r == this.rows - 2 && c == 1) || (r == 1 && c == this.cols - 2)) {
                    continue;
                }

                // 设置当前位置和对称位置为障碍物
                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
                break; // 成功设置障碍物后跳出内层循环
            }
        }

        return checkConnectivity(this.rows - 2, 1, 1, this.cols - 2);
    }

    public void createMap() {
        for (int i = 1; i <= 30000; ++ i) {
            if (draw()) break;
        }
    }

    public void setNextStepA(Integer nextStepA) {
        lock.lock();
        try {
            this.nextStepA = nextStepA;
        } finally {
            lock.unlock();
        }
    }

    public void setNextStepB(Integer nextStepB) {
        lock.lock();
        try {
            this.nextStepB = nextStepB;
        } finally {
            lock.unlock();
        }
    }

    private String getInput(Player player) {
        Player me, you;

        if (playerA.getId().equals(player.getId())) {
            me = playerA;
            you = playerB;
        } else {
            me = playerB;
            you = playerA;
        }

        StringBuilder stringBuilder = new StringBuilder();

        stringBuilder.append(JSONObject.toJSONString(g))
                .append("#")
                .append(me.getSx())
                .append("#")
                .append(me.getSy())
                .append("#(")
                .append(me.getStepString())
                .append(")#")
                .append(you.getSx())
                .append("#")
                .append(you.getSy())
                .append("#(")
                .append(you.getStepString())
                .append(")");

        return stringBuilder.toString();
    }

    private void sendBotCode(Player player) {
        if (player.getBotId().equals(-1)) return ;

        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("user_id", player.getId().toString());
        data.add("bot_code", player.getBotCode());
        data.add("input", getInput(player));

        WebSocketServer.restTemplate.postForObject(addBotUrl, data, String.class);
    }

    private boolean nextStep() {
        // 等待两个玩家的下一步操作

        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        sendBotCode(playerA);
        sendBotCode(playerB);

        // 每个回合每个用户有10s时间操作 100 * 100 = 10000ms = 10s
        for (int i = 0; i < 100; ++ i) {
            try {
                Thread.sleep(100);
                lock.lock();
                try {
                    if (nextStepA != null && nextStepB != null) {
                        playerA.getSteps().add(nextStepA);
                        playerB.getSteps().add(nextStepB);
                        return true;
                    }
                } finally {
                    lock.unlock();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        return false;
    }

    private boolean checkValid(List<Cell> cellsA, List<Cell> cellsB) {
        int n = cellsA.size();
        Cell cell = cellsA.get(n - 1);
        if (g[cell.x][cell.y]) return false;

        for (int i = 0; i < n - 1; i ++ ) {
            if (cellsA.get(i).x == cell.x && cellsA.get(i).y == cell.y)
                return false;
        }

        for (int i = 0; i < n - 1; i ++ ) {
            if (cellsB.get(i).x == cell.x && cellsB.get(i).y == cell.y)
                return false;
        }

        return true;
    }


    private void judge() { // 判断两名玩家下一步操作是否合法
        List<Cell> cellsA = playerA.getCells();
        List<Cell> cellsB = playerB.getCells();

        boolean validA = checkValid(cellsA, cellsB);
        boolean validB = checkValid(cellsB, cellsA);

        if (!validA || !validB) {
            status = "finished";

            if (!validA && !validB) {
                loser = "all";
            } else if (!validA) {
                loser = "A";
            } else {
                loser = "B";
            }
        }

    }

    private void sendMessageToAll(String message) {
        if (WebSocketServer.users.get(playerA.getId()) != null)
            WebSocketServer.users.get(playerA.getId()).sendMessageToClient(message);

        if (WebSocketServer.users.get(playerB.getId()) != null)
            WebSocketServer.users.get(playerB.getId()).sendMessageToClient(message);
    }

    private void sendMoveInfo() { // 向两个client发送移动信息
        lock.lock();
        try {
            JSONObject resp = new JSONObject();
            resp.put("event", "move");
            resp.put("a_direction", nextStepA);
            resp.put("b_direction", nextStepB);
            sendMessageToAll(resp.toJSONString());
            nextStepA = nextStepB = null;
            System.out.println("there!");
        } finally {
            lock.unlock();
        }
    }

    private void saveToDatabase() {
        Record record = new Record(
                null,
                playerA.getId(),
                playerA.getSx(),
                playerA.getSy(),
                playerB.getId(),
                playerB.getSx(),
                playerB.getSy(),
                playerA.getStepString(),
                playerB.getStepString(),
                JSONObject.toJSONString(g),
                loser,
                new Date()
        );

        WebSocketServer.recordMapper.insert(record);
    }

    private void sendResult() { // 向两个client公布结果
        JSONObject resp = new JSONObject();
        resp.put("event", "result");
        resp.put("loser", loser);
        sendMessageToAll(resp.toJSONString());
        saveToDatabase();
    }

    @Override
    public void run() {

        if (isFirst) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                isFirst = false;
            }
        }

        for (int i = 0; i < 1000; i ++ ) {
            if (nextStep()) {  // 是否获取了两条蛇的下一步操作
                judge();
                if (status.equals("playing")) {
                    sendMoveInfo();
                } else {
                    sendResult();
                    break;
                }
            } else {
                status = "finished";
                lock.lock();
                try {
                    if (nextStepA == null && nextStepB == null) {
                        loser = "all";
                    } else if (nextStepA == null) {
                        loser = "A";
                    } else {
                        loser = "B";
                    }
                } finally {
                    lock.unlock();
                }

                sendResult();
                break;
            }
        }
    }

}
