package com.kob.backend.utils;

import lombok.Getter;

import java.util.Random;

public class Game {

    final private Integer rows;

    final private Integer cols;

    final private Integer inner_walls_count;

    @Getter
    private boolean[][] g;

    final static private int[] dx = {-1, 0, 1, 0};
    final static private int[] dy = {0, 1, 0, -1};

    public Game(Integer rows, Integer cols, Integer inner_walls_count) {
        this.rows = rows;
        this.cols = cols;
        this.inner_walls_count = inner_walls_count;
        this.g = new boolean[rows][cols];
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
        while (true) {
            if (draw()) break;
        }
    }
}
