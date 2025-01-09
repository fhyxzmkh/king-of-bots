import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import useUserStore from "../../../../store/userStore.ts";
import axios from "axios";

export const Route = createFileRoute("/user/account/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    const response = await axios.post(
      "http://localhost:8686/api/user/account/token",
      null,
      {
        params: {
          username: username,
          password: password,
        },
      },
    );

    const message: string = response.data.message;
    const token: string = response.data.token;

    if (message === "success") {
      setUser({ username: username, token: token, is_login: true });
      alert("Login success!");
      // 获取用户信息
      await getUserInfo(token);
      // 转到pk页面
      await navigate({
        to: "/pk",
      });
    } else {
      alert("Login failed! Username or password is incorrect.");
    }
  };

  const getUserInfo = async (token: string) => {
    const response = await axios.get(
      "http://localhost:8686/api/user/account/info",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = response.data;

    if (data.message === "success") {
      setUser({ id: data.id, avatar: data.avatar });
    }
  };

  const onFinish = (values: any) => {
    login(values.username, values.password);
  };

  return (
    <>
      <div className="mx-auto w-3/5 mt-4 h-auto flex justify-center items-center">
        <div className="w-full h-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="">Forgot password</a>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Log in
              </Button>
              or <a href="">Register now!</a>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
