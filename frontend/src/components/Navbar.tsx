import { Menu, Dropdown } from "antd";
import { Link, useLocation } from "@tanstack/react-router";
import { UserOutlined } from "@ant-design/icons";

export const Navbar = () => {
  const location = useLocation(); // 获取当前路径

  // 根据路径设置选中的菜单项
  const getMenuKey = () => {
    if (location.pathname.startsWith("/pk")) return "1";
    if (location.pathname.startsWith("/record")) return "2";
    if (location.pathname.startsWith("/ranklist")) return "3";
    return ""; // 默认没有选中
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">我的 Bot</Menu.Item>
      <Menu.Item key="2">退出</Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-500 text-white">
      <div className="text-2xl font-bold">King of Bots</div>

      <div>
        <Menu
          mode="horizontal"
          theme="dark"
          className="bg-blue-500"
          selectedKeys={[getMenuKey()]} // 动态设置选中项
        >
          <Menu.Item key="1" className="font-bold">
            <Link to="/pk">对战</Link>
          </Menu.Item>
          <Menu.Item key="2" className="font-bold">
            <Link to="/record">对局列表</Link>
          </Menu.Item>
          <Menu.Item key="3" className="font-bold">
            <Link to="/ranklist">排行榜</Link>
          </Menu.Item>
        </Menu>
      </div>

      <div>
        <Dropdown overlay={menu} placement="bottomRight">
          <div className="cursor-pointer flex items-center">
            <UserOutlined className="mr-2" />
            <Link to="/user/bot">当前用户</Link>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
