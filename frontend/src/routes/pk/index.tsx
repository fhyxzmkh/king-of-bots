import { createFileRoute, redirect } from "@tanstack/react-router";
import { GameMap } from "../../components/GameMap.jsx";
import { isAuthenticated } from "../../utils/auth.tsx";
import { useEffect, useState } from "react";
import usePkStore, { Status } from "../../store/pkStore.ts";
import userStore from "../../store/userStore.ts";
import { Avatar, Button, Col, Row } from "antd";

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
    game_map,
    setStatus,
    setOpponent,
    setSocket,
    setGameMap,
  } = usePkStore();

  const [buttonText, setButtonText] = useState<string>("开始匹配");

  useEffect(() => {
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

      if (data.event === "start-matching") {
        setOpponent(data.opponent_username, data.opponent_avatar);
        setTimeout(() => {
          setStatus(Status.Playing);
        }, 2000);
        setGameMap(data.game_map);
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
      setSocket(null);
      setStatus(Status.Matching);
      setOpponent(
        "我的对手",
        "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
      );
    };
  }, []);

  const handleClick = () => {
    if (buttonText === "开始匹配") {
      setButtonText("取消匹配");
      setStatus(Status.Matching);
      socket?.send(JSON.stringify({ event: "start-matching" }));
    } else {
      setButtonText("开始匹配");
      // setStatus(Status.Playing);
      socket?.send(JSON.stringify({ event: "stop-matching" }));
    }
  };

  return (
    <>
      {status === Status.Playing ? (
        <div className="mx-auto w-3/5 mt-4 h-[70vh]">
          <GameMap gameMap={game_map} />
        </div>
      ) : null}
      {status === Status.Matching ? (
        <div className="mx-auto w-3/5 mt-4 h-[70vh] bg-gray-100 flex flex-col justify-center items-center">
          <Row className="h-3/5 w-full flex justify-center items-center">
            <Col
              span={12}
              className="flex flex-col justify-center items-center"
            >
              <Avatar size={128} icon={<img src={user.avatar} alt="我" />} />
              <p className="font-bold text-xl mt-2">{user.username}</p>
            </Col>
            <Col
              span={12}
              className="flex flex-col justify-center items-center"
            >
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
