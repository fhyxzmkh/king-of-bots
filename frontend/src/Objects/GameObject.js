const GAME_OBJECTS = [];

export class GameObject {
  constructor() {
    GAME_OBJECTS.push(this);
    this.timedelta = 0;
    this.has_called_start = false;
  }

  start() {
    // 只执行一次
  }

  update() {
    // 每帧执行一次，除了第一帧
  }

  on_destroy() {
    // 删除之前执行
  }

  destroy() {
    this.on_destroy();

    // 删除对象
    for (let i = 0; i < GAME_OBJECTS.length; i++) {
      const obj = GAME_OBJECTS[i];
      if (obj === this) {
        GAME_OBJECTS.splice(i, 1);
        break;
      }
    }
  }
}

let last_timestamp; // 上一次执行的时刻
const step = (timestamp) => {
  for (let obj of GAME_OBJECTS) {
    if (!obj.has_called_start) {
      obj.has_called_start = true;
      obj.start();
    } else {
      obj.timedelta = timestamp - last_timestamp;
      obj.update();
    }
  }

  last_timestamp = timestamp;
  requestAnimationFrame(step);
};

requestAnimationFrame(step);
