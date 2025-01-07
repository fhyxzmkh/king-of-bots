import { GameObject } from "./GameObject.js";
import { CellObject } from "./CellObject.js";

export class SnakeObject extends GameObject {
  constructor(info, gameMap) {
    super();

    this.id = info.id;
    this.color = info.color;
    this.gameMap = gameMap;

    this.cells = [new CellObject(info.r, info.c)]; // 存放蛇的身体，cells[0]是蛇头
    this.next_cell = null; // 下一步的目标位置

    this.speed = 5; // 每秒移动的格子数
    this.direction = -1; // -1为静止, 0为上, 1为右, 2为下, 3为左
    this.status = "idle"; // idle为静止, moving为正在移动, dead为死亡

    this.dr = [-1, 0, 1, 0];
    this.dc = [0, 1, 0, -1];

    this.step = 0;
    this.eps = 1e-2;

    this.eye_direction = 0;
    if (this.id === 1) this.eye_direction = 2; // 左下角的蛇初始朝上，右上角的蛇朝下

    this.eye_dx = [
      // 蛇眼睛不同方向的x的偏移量
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1],
    ];
    this.eye_dy = [
      // 蛇眼睛不同方向的y的偏移量
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1],
    ];
  }

  start() {}

  set_direction(d) {
    this.direction = d;
  }

  check_tail_increasing() {
    // 检测当前回合，蛇的长度是否增加
    if (this.step <= 10) return true;
    if (this.step % 3 === 1) return true;
    return false;
  }

  next_step() {
    // 将蛇的状态变为走下一步
    const d = this.direction;

    this.next_cell = new CellObject(
      this.cells[0].r + this.dr[d],
      this.cells[0].c + this.dc[d],
    );
    this.eye_direction = d;
    this.direction = -1;
    this.status = "moving";
    this.step += 1;

    const k = this.cells.length;
    for (let i = k; i > 0; i--) {
      this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
    }

    if (!this.gameMap.check_valid(this.next_cell)) {
      // 下一步操作撞了，蛇瞬间去世
      this.status = "dead";
    }
  }

  update_move() {
    const dx = this.next_cell.x - this.cells[0].x;
    const dy = this.next_cell.y - this.cells[0].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.eps) {
      // 走到目标点了
      this.cells[0] = this.next_cell; // 添加一个新蛇头
      this.next_cell = null;
      this.status = "idle";

      if (!this.check_tail_increasing()) {
        // 蛇不变长
        this.cells.pop();
      }
    } else {
      const move_distance = (this.speed * this.timedelta) / 1000; // 每两帧之间走的距离
      this.cells[0].x += (move_distance * dx) / distance;
      this.cells[0].y += (move_distance * dy) / distance;

      if (!this.check_tail_increasing()) {
        const k = this.cells.length;
        const tail = this.cells[k - 1],
          tail_target = this.cells[k - 2];
        const tail_dx = tail_target.x - tail.x;
        const tail_dy = tail_target.y - tail.y;
        tail.x += (move_distance * tail_dx) / distance;
        tail.y += (move_distance * tail_dy) / distance;
      }
    }
  }

  update() {
    // 每一帧执行一次
    if (this.status === "moving") {
      this.update_move();
    }
    this.render();
  }

  render() {
    const L = this.gameMap.L;
    const ctx = this.gameMap.ctx;

    ctx.fillStyle = this.color;
    if (this.status === "dead") {
      ctx.fillStyle = "white";
    }

    for (const cell of this.cells) {
      ctx.beginPath();
      ctx.arc(cell.x * L, cell.y * L, (L / 2) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 1; i < this.cells.length; i++) {
      const a = this.cells[i - 1],
        b = this.cells[i];
      if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps)
        continue;
      if (Math.abs(a.x - b.x) < this.eps) {
        ctx.fillRect(
          (a.x - 0.4) * L,
          Math.min(a.y, b.y) * L,
          L * 0.8,
          Math.abs(a.y - b.y) * L,
        );
      } else {
        ctx.fillRect(
          Math.min(a.x, b.x) * L,
          (a.y - 0.4) * L,
          Math.abs(a.x - b.x) * L,
          L * 0.8,
        );
      }
    }

    ctx.fillStyle = "black";
    for (let i = 0; i < 2; i++) {
      const eye_x =
        (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
      const eye_y =
        (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;

      ctx.beginPath();
      ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
