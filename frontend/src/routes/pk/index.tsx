import { createFileRoute, redirect } from "@tanstack/react-router";
import { GameMap } from "../../components/GameMap.tsx";
import { isAuthenticated } from "../../utils/auth.tsx";
import { useEffect, useState } from "react";
import usePkStore, { Status } from "../../store/pkStore.ts";
import userStore from "../../store/userStore.ts";
import { Avatar, Button, Col, Modal, Row, Select, Space } from "antd";
import useUserStore from "../../store/userStore.ts";
import axios from "axios";

export const Route = createFileRoute("/pk/")({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/user/account/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = userStore();
  const {
    status,
    opponent_username,
    opponent_avatar,
    socket,
    loser,
    setStatus,
    setOpponent,
    setSocket,
    setGameMap,
    setPlayerA,
    setPlayerB,
    setLoser,
    reset,
  } = usePkStore();

  const [buttonText, setButtonText] = useState<string>("开始匹配");

  const [botList, setBotList] = useState([]);

  const [selectedBot, setSelectedBot] = useState("-1");

  useEffect(() => {
    reset();
    const socketUrl = `ws://localhost:8686/api/websocket/${user.token}`;
    const socket = new WebSocket(socketUrl);

    // 监听连接成功事件
    socket.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(socket);
    };

    // 监听服务器发送的消息
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      switch (data.event) {
        case "start-matching": {
          setOpponent(data.opponent_username, data.opponent_avatar);
          setTimeout(() => {
            setStatus(Status.Playing);
          }, 1000);
          setGameMap(data.game.game_map);
          setPlayerA(data.game.a_id, data.game.a_sx, data.game.a_sy);
          setPlayerB(data.game.b_id, data.game.b_sx, data.game.b_sy);
          break;
        }
        case "move": {
          console.log("move");
          const [snake0, snake1] = usePkStore.getState().game_map_object.snakes;
          snake0.set_direction(data.a_direction);
          snake1.set_direction(data.b_direction);
          break;
        }
        case "result": {
          console.log("result");
          console.log(data);
          const [snake0, snake1] = usePkStore.getState().game_map_object.snakes;
          if (data.loser === "all" || data.loser === "A") {
            snake0.status = "dead";
          }
          if (data.loser === "all" || data.loser === "B") {
            snake1.status = "dead";
          }
          setLoser(data.loser);

          break;
        }
        default: {
          console.warn("Unknown event:", data.event);
        }
      }
    };

    // 监听连接关闭事件
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // 监听错误事件
    // socket.onerror = (error) => {
    //   // console.error("WebSocket error:", error);
    // };

    // 组件卸载时关闭 WebSocket 连接
    return () => {
      socket.close();
      reset();
    };
  }, []);

  const handleClick = () => {
    if (buttonText === "开始匹配") {
      setButtonText("取消匹配");
      setStatus(Status.Matching);
      socket?.send(
        JSON.stringify({ event: "start-matching", bot_id: selectedBot }),
      );
    } else {
      setButtonText("开始匹配");
      socket?.send(JSON.stringify({ event: "stop-matching" }));
    }
  };

  useEffect(() => {
    if (loser === "") return;

    const { a_id, b_id } = usePkStore.getState();
    const { user } = useUserStore.getState();

    let content = "";
    if (loser === "all") {
      content = "平局";
    } else if (loser === "A" && Number(a_id) === Number(user.id)) {
      content = "你输了";
    } else if (loser === "B" && Number(b_id) === Number(user.id)) {
      content = "你输了";
    } else {
      content = "你赢了";
    }

    Modal.info({
      title: "游戏结束",
      content: (
        <div>
          <p className="text-2xl font-bold text-center w-full">{content}</p>
          <Space className="mt-4 mb-4 justify-center w-full">
            <Button
              color="primary"
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              重来
            </Button>
          </Space>
        </div>
      ),
    });
  }, [loser]);

  const fetchBotList = async () => {
    const response = await axios({
      method: "get",
      url: "http://localhost:8686/api/user/bot/getList",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.status === 200) {
      setBotList(response.data);
      console.log("bots: ");
      console.log(response.data);
    }
  };

  useEffect(() => {
    fetchBotList();
  }, []);

  return (
    <>
      {status === Status.Playing ? (
        <div className="mx-auto w-3/5 mt-4 h-[70vh]">
          <GameMap />
        </div>
      ) : null}
      {status === Status.Matching ? (
        <div className="mx-auto w-3/5 mt-4 h-[70vh] bg-gray-100 flex flex-col justify-center items-center">
          <Row className="h-3/5 w-full flex justify-center items-center">
            <Col span={8} className="flex flex-col justify-center items-center">
              <Avatar size={128} icon={<img src={user.avatar} alt="我" />} />
              <p className="font-bold text-xl mt-2">{user.username}</p>
            </Col>
            <Col span={8} className="w-full flex justify-center">
              <Select
                className="w-1/2"
                defaultValue="-1"
                onChange={(value: string) => setSelectedBot(value)}
                options={[
                  { value: "-1", label: "亲自上阵" },
                  ...botList.map((bot) => ({
                    value: bot.id.toString(),
                    label: bot.title.toString(),
                  })),
                ]}
              />
            </Col>
            <Col span={8} className="flex flex-col justify-center items-center">
              <Avatar
                size={128}
                icon={<img src={opponent_avatar} alt="我的对手" />}
              />
              <p className="font-bold text-xl mt-2">{opponent_username}</p>
            </Col>
          </Row>
          <Row className="h-2/5 w-full flex justify-center items-center">
            <Col span={24} className="flex justify-center">
              <Button color="primary" variant="outlined" onClick={handleClick}>
                {buttonText}
              </Button>
            </Col>
          </Row>
        </div>
      ) : null}
    </>
  );
}
