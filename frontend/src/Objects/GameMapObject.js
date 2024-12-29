import { GameObject } from "./GameObject.js";
import { WallObject } from "./WallObject.js";

export class GameMapObject extends GameObject {
  constructor(ctx, parent) {
    super();

    this.ctx = ctx;
    this.parent = parent;
    this.L = 0;

    this.rows = 13;
    this.cols = 13;

    this.inner_walls_count = 10;
    this.walls = [];
  }

  check_connectivity(g, sx, sy, tx, ty) {
    if (sx < 0 || sx >= this.rows || sy < 0 || sy >= this.cols || g[sx][sy]) {
      return false; // 越界或当前点是障碍物
    }
    if (sx === tx && sy === ty) return true;

    g[sx][sy] = true; // 标记访问过

    const dx = [-1, 0, 1, 0];
    const dy = [0, 1, 0, -1];

    for (let i = 0; i < 4; i++) {
      let x = sx + dx[i],
        y = sy + dy[i];
      if (this.check_connectivity(g, x, y, tx, ty)) return true;
    }

    return false;
  }

  create_walls() {
    const g = [];

    for (let r = 0; r < this.rows; r++) {
      g[r] = [];
      for (let c = 0; c < this.cols; c++) {
        g[r][c] = false;
      }
    }

    // 给四周加上障碍物
    for (let r = 0; r < this.rows; r++) {
      g[r][0] = g[r][this.cols - 1] = true;
    }

    for (let c = 0; c < this.cols; c++) {
      g[0][c] = g[this.rows - 1][c] = true;
    }

    // 创建随机障碍物
    for (let i = 0; i < this.inner_walls_count / 2; i++) {
      for (let j = 0; j < 1000; j++) {
        let r = Math.floor(Math.random() * this.rows);
        let c = Math.floor(Math.random() * this.cols);
        if (g[r][c] || g[c][r]) continue;
        if (
          (r === this.rows - 2 && c === 1) ||
          (r === 1 && c === this.cols - 2)
        )
          continue;

        g[r][c] = g[c][r] = true;
        break;
      }
    }

    const copy_g = JSON.parse(JSON.stringify(g));
    if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2))
      return false;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (g[r][c]) {
          this.walls.push(new WallObject(r, c, this));
        }
      }
    }

    return true;
  }

  start() {
    for (;;) if (this.create_walls()) break;
  }

  update_size() {
    this.L = Math.floor(
      Math.min(
        this.parent.clientWidth / this.cols,
        this.parent.clientHeight / this.rows,
      ),
    );
    this.ctx.canvas.width = this.L * this.cols;
    this.ctx.canvas.height = this.L * this.rows;
  }

  update() {
    this.update_size();
    this.render();
  }

  render() {
    const color_even = "#AAD751";
    const color_odd = "#A2D149";

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.ctx.fillStyle = (i + j) % 2 === 0 ? color_even : color_odd;
        this.ctx.fillRect(j * this.L, i * this.L, this.L, this.L);
      }
    }
  }
}
