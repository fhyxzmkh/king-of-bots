import { GameObject } from "./GameObject.js";
import { WallObject } from "./WallObject.js";
import { SnakeObject } from "./SnakeObject.js";

export class GameMapObject extends GameObject {
  constructor(ctx, parent, gameMap) {
    super();

    this.ctx = ctx;
    this.parent = parent;
    this.game_map = gameMap;

    this.L = 0;

    this.rows = 13;
    this.cols = 14;

    // this.inner_walls_count = 10;
    this.walls = [];

    this.snakes = [
      new SnakeObject(
        { id: 0, color: "#4876EC", r: this.rows - 2, c: 1 },
        this,
      ),
      new SnakeObject(
        { id: 1, color: "#F94848", r: 1, c: this.cols - 2 },
        this,
      ),
    ];
  }

  // check_connectivity(g, sx, sy, tx, ty) {
  //   if (sx < 0 || sx >= this.rows || sy < 0 || sy >= this.cols || g[sx][sy]) {
  //     return false; // 越界或当前点是障碍物
  //   }
  //   if (sx === tx && sy === ty) return true;
  //
  //   g[sx][sy] = true; // 标记访问过
  //
  //   const dx = [-1, 0, 1, 0];
  //   const dy = [0, 1, 0, -1];
  //
  //   for (let i = 0; i < 4; i++) {
  //     let x = sx + dx[i],
  //       y = sy + dy[i];
  //     if (this.check_connectivity(g, x, y, tx, ty)) return true;
  //   }
  //
  //   return false;
  // }

  create_walls() {
    // const g = [];
    //
    // for (let r = 0; r < this.rows; r++) {
    //   g[r] = [];
    //   for (let c = 0; c < this.cols; c++) {
    //     g[r][c] = false;
    //   }
    // }
    //
    // // 给四周加上障碍物
    // for (let r = 0; r < this.rows; r++) {
    //   g[r][0] = g[r][this.cols - 1] = true;
    // }
    //
    // for (let c = 0; c < this.cols; c++) {
    //   g[0][c] = g[this.rows - 1][c] = true;
    // }
    //
    // // 创建随机障碍物
    // for (let i = 0; i < this.inner_walls_count / 2; i++) {
    //   for (let j = 0; j < 1000; j++) {
    //     let r = Math.floor(Math.random() * this.rows);
    //     let c = Math.floor(Math.random() * this.cols);
    //     if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue;
    //     if (
    //       (r === this.rows - 2 && c === 1) ||
    //       (r === 1 && c === this.cols - 2)
    //     )
    //       continue;
    //
    //     g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
    //     break;
    //   }
    // }
    //
    // const copy_g = JSON.parse(JSON.stringify(g));
    // if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2))
    //   return false;

    const g = JSON.parse(this.game_map);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (g[r][c]) {
          this.walls.push(new WallObject(r, c, this));
        }
      }
    }

    // return true;
  }

  add_listening_events() {
    this.ctx.canvas.focus();

    const [snake0, snake1] = this.snakes;
    this.ctx.canvas.addEventListener("keydown", (e) => {
      if (e.key === "w") snake0.set_direction(0);
      else if (e.key === "d") snake0.set_direction(1);
      else if (e.key === "s") snake0.set_direction(2);
      else if (e.key === "a") snake0.set_direction(3);
      else if (e.key === "ArrowUp") snake1.set_direction(0);
      else if (e.key === "ArrowRight") snake1.set_direction(1);
      else if (e.key === "ArrowDown") snake1.set_direction(2);
      else if (e.key === "ArrowLeft") snake1.set_direction(3);
    });
  }

  start() {
    // for (;;) if (this.create_walls()) break;

    this.create_walls();

    this.add_listening_events();
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

  check_ready() {
    // 判断两条蛇是否都准备好下一回合了
    for (const snake of this.snakes) {
      if (snake.status !== "idle") return false;
      if (snake.direction === -1) return false;
    }
    return true;
  }

  next_step() {
    // 让两条蛇进入下一回合
    for (const snake of this.snakes) {
      snake.next_step();
    }
  }

  check_valid(cell) {
    // 检测目标位置是否合法：没有撞到两条蛇的身体和障碍物
    for (const wall of this.walls) {
      if (wall.r === cell.r && wall.c === cell.c) return false;
    }

    for (const snake of this.snakes) {
      let k = snake.cells.length;
      if (!snake.check_tail_increasing()) {
        // 当蛇尾会前进的时候，蛇尾不要判断
        k--;
      }
      for (let i = 0; i < k; i++) {
        if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
          return false;
      }
    }

    return true;
  }

  update() {
    this.update_size();
    if (this.check_ready()) {
      this.next_step();
    }
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
