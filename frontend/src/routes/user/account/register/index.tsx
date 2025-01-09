import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";

export const Route = createFileRoute("/user/account/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const register = async (
    username: string,
    password: string,
    confirmPassword: string,
  ) => {
    const response = await axios.post(
      "http://localhost:8686/api/user/account/register",
      null,
      {
        params: {
          username: username,
          password: password,
          confirmPassword: confirmPassword,
        },
      },
    );

    const message: string = response.data.message;

    if (message === "success") {
      alert("Register success!");
      await navigate({
        to: "/user/account/login",
      });
    }
  };

  const onFinish = (values: any) => {
    // console.log("Received values of form: ", values);
    register(values.username, values.password, values.confirm);
  };

  return (
    <>
      <div className="mx-auto w-3/5 mt-4 h-auto flex justify-center items-center">
        <div className="w-full h-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <Form name="register" onFinish={onFinish} scrollToFirstError>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!",
                      ),
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Should accept agreement")),
                },
              ]}
            >
              <Checkbox>I am not a robot.</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
