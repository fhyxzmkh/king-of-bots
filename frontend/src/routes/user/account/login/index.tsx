import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import useUserStore from "../../../../store/userStore";

export const Route = createFileRoute("/user/account/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { login } = useUserStore();
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    login(values.username, values.password).then(() => {
      navigate({
        to: "/pk",
      });
    });
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
              <Button block type="primary" htmlType="submit">
                Log in
              </Button>
              or{" "}
              <Link to="/user/account/register" className="font-black">
                Register now!
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
