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
  game_map: string | null;
}

// 定义 Store 的类型
interface PkStore extends PkState {
  setStatus: (status: Status) => void;
  setSocket: (socket: WebSocket | null) => void;
  setOpponent: (username: string, avatar: string) => void;
  setGameMap: (game_map: string | null) => void;
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

  // 操作方法
  setStatus: (status) => set({ status }),
  setSocket: (socket) => set({ socket }),
  setOpponent: (username, avatar) =>
    set({ opponent_username: username, opponent_avatar: avatar }),
  setGameMap: (game_map) => set({ game_map }),
  reset: () =>
    set({
      status: Status.Matching,
      socket: null,
      opponent_username: "",
      opponent_avatar: "",
      game_map: null,
    }),
}));

export default usePkStore;
