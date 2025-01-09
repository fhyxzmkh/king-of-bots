import { Menu, Dropdown, Button, Space, MenuProps } from "antd";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import useUserStore from "../store/userStore.ts";
import { useEffect, useState } from "react";

type MenuItem = Required<MenuProps>["items"][number];

const items1: MenuItem[] = [
  {
    label: <Link to="/pk">对战</Link>,
    key: "1",
  },
  {
    label: <Link to="/record">对局列表</Link>,
    key: "2",
  },
  {
    label: <Link to="/ranklist">排行榜</Link>,
    key: "3",
  },
];

export const Navbar = () => {
  const { user, clearUser } = useUserStore();
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");

  const selected = useRouterState({
    select: (state) => state.location,
  });

  useEffect(() => {
    const pathname = selected.pathname;

    if (pathname === "/pk") {
      setCurrent("1");
    } else if (pathname === "/record") {
      setCurrent("2");
    } else if (pathname === "/ranklist") {
      setCurrent("3");
    } else {
      setCurrent("");
    }
  }, [selected]);

  const items: MenuProps["items"] = [
    {
      label: (
        <div className="cursor-pointer flex items-center">
          <Link to="/user/bot">我的Bot</Link>
        </div>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div
          className="cursor-pointer"
          onClick={() => {
            clearUser();
            goLogin();
          }}
        >
          退出登录
        </div>
      ),
      key: "1",
    },
  ];

  const onClickMenuItem: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const goLogin = () => {
    navigate({
      to: "/user/account/login",
    });
  };

  const goRegister = () => {
    navigate({
      to: "/user/account/register",
    });
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-500 text-white">
      <div className="text-2xl font-bold">King of Bots</div>

      <div>
        <Menu
          theme="dark"
          className="bg-blue-500"
          onClick={onClickMenuItem}
          selectedKeys={[current]}
          mode="horizontal"
          items={items1}
        />
      </div>

      <Space>
        {user.is_login ? (
          <div className="hover:cursor-pointer">
            <UserOutlined className="mr-2" />
            <Dropdown menu={{ items }}>
              <Space>
                {user.username}
                <DownOutlined />
              </Space>
            </Dropdown>
          </div>
        ) : (
          <Space>
            <Button onClick={goLogin}>登录</Button>
            <Button onClick={goRegister}>注册</Button>
          </Space>
        )}
      </Space>
    </div>
  );
};

export default Navbar;
