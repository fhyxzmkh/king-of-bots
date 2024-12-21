import { Menu, Dropdown } from "antd";
import { Link } from "@tanstack/react-router";
import { UserOutlined } from "@ant-design/icons";

export const Navbar = () => {
  const menu = (
    <Menu>
      <Menu.Item key="1">我的 Bot</Menu.Item>
      <Menu.Item key="2">退出</Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-500 text-white">
      {/* 网站名称 */}
      <div className="text-2xl font-bold">King of Bots</div>

      {/* 导航菜单 */}
      <div>
        <Menu mode="horizontal" theme="dark" className="bg-blue-500">
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

      {/* 用户信息 */}
      <div>
        <Dropdown overlay={menu} placement="bottomRight">
          <div className="cursor-pointer flex items-center">
            <UserOutlined className="mr-2" /> 当前用户
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
