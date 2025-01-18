import { create } from "zustand";

// 定义枚举
export enum Status {
  Matching = "matching", // 匹配界面
  Playing = "playing", // 对战界面
}

// 定义接口
export interface PkState {
  status: Status;
  socket: WebSocket | null;
  opponent_username: string;
  opponent_avatar: string;
  game_map: any;
  a_id: number;
  a_sx: number;
  a_sy: number;
  b_id: number;
  b_sx: number;
  b_sy: number;
  game_map_object: any;
  loser: string;
}

// 定义 Store 的类型
interface PkStore extends PkState {
  setStatus: (status: Status) => void;
  setSocket: (socket: WebSocket | null) => void;
  setOpponent: (username: string, avatar: string) => void;
  setGameMap: (game_map: any) => void;
  setPlayerA: (id: number, sx: number, sy: number) => void;
  setPlayerB: (id: number, sx: number, sy: number) => void;
  setGameMapObject: (game_map_object: any) => void;
  setLoser: (loser: string) => void;
  reset: () => void;
}

// 创建 Store
const usePkStore = create<PkStore>((set) => ({
  // 初始状态
  status: Status.Matching,
  socket: null,
  opponent_username: "我的对手",
  opponent_avatar:
    "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
  game_map: null,
  a_id: 0,
  a_sx: 0,
  a_sy: 0,
  b_id: 0,
  b_sx: 0,
  b_sy: 0,
  game_map_object: null,
  loser: "",

  // 操作方法
  setStatus: (status) => set({ status }),
  setSocket: (socket) => set({ socket }),
  setOpponent: (username, avatar) =>
    set({ opponent_username: username, opponent_avatar: avatar }),
  setGameMap: (game_map) => set({ game_map }),
  setPlayerA: (id, sx, sy) => set({ a_id: id, a_sx: sx, a_sy: sy }),
  setPlayerB: (id, sx, sy) => set({ b_id: id, b_sx: sx, b_sy: sy }),
  setGameMapObject: (game_map_object) => set({ game_map_object }),
  setLoser: (loser) => set({ loser }),
  reset: () =>
    set({
      status: Status.Matching,
      socket: null,
      opponent_username: "我的对手",
      opponent_avatar:
        "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
      game_map: null,
      a_id: 0,
      a_sx: 0,
      a_sy: 0,
      b_id: 0,
      b_sx: 0,
      b_sy: 0,
      game_map_object: null,
      loser: "",
    }),
}));

export default usePkStore;
