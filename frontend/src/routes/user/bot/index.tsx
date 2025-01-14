import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../../../utils/auth.tsx";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
  TableProps,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import userStore from "../../../store/userStore.ts";
import { EditorComponent } from "../../../components/EditorComponent.tsx";

export const Route = createFileRoute("/user/bot/")({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/user/account/login" });
    }
  },
  component: RouteComponent,
});

interface DataType {
  key: string;
  name: string;
  description: string | null;
  content: string | null;
  create_time: string;
}

function RouteComponent() {
  const { user } = userStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      key: "create_time",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            color="primary"
            variant="outlined"
            onClick={() => handleChange(record.key)}
          >
            修改
          </Button>
          <Button
            color="danger"
            variant="outlined"
            onClick={() => handleDelete(record.key)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const [selectedBot, setSelectedBot] = useState<DataType>({
    key: "",
    name: "",
    description: "",
    content: "",
    create_time: "",
  });
  const handleChange = (bot_id: string) => {
    const botToEdit = data.find((item) => item.key === bot_id);
    if (botToEdit !== undefined) setSelectedBot(botToEdit);
    setIsModalOpen2(true);
  };

  const handleDelete = async (bot_id: string) => {
    const response = await axios({
      method: "post",
      url: "http://localhost:8686/api/user/bot/remove",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      params: {
        bot_id: bot_id,
      },
    });

    if (response.status === 200) {
      alert("Bot deleted successfully!");
      await fetchTableData();
    } else {
      alert("Failed to delete bot!");
    }
  };

  const [data, setData] = useState<DataType[]>([]);
  const fetchTableData = async () => {
    const response = await axios({
      method: "get",
      url: "http://localhost:8686/api/user/bot/getList",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.status === 200) {
      const tableData = response.data.map((bot) => ({
        key: bot.id,
        name: bot.title,
        description: bot.description,
        content: bot.content,
        create_time: bot.createTime,
      }));

      setData(tableData);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const onFinish = (values: any) => {
    const addBot = async () => {
      const response = await axios({
        method: "post",
        url: "http://localhost:8686/api/user/bot/add",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          title: values.name,
          description: values.description,
          content: values.content,
        },
      });

      const message: string = response.data.message;
      if (message === "success") {
        alert("Bot created successfully!");
        fetchTableData();
        setIsModalOpen(false);
      } else {
        alert("Failed to create bot!");
      }
    };

    addBot();
  };

  const onFinish2 = (values: any) => {
    const updateBot = async () => {
      const response = await axios({
        method: "post",
        url: "http://localhost:8686/api/user/bot/update",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          bot_id: selectedBot.key,
          title: values.name,
          description: values.description,
          content: values.content,
        },
      });

      const message: string = response.data.message;
      if (message === "success") {
        alert("Bot updated successfully!");
        setIsModalOpen2(false);
      } else {
        alert("Failed to update bot!");
      }
    };

    updateBot();
  };

  return (
    <>
      <div className="w-3/5 mt-4 flex mx-auto">
        <div className="w-full">
          <Row>
            <Col span={8} className="flex justify-center">
              <div className="w-36 h-36 bg-white">
                <Avatar
                  shape="square"
                  className="w-full h-full"
                  icon={
                    user.avatar ? (
                      <img src={user.avatar} alt="avatar" />
                    ) : (
                      <UserOutlined />
                    )
                  }
                />
              </div>
            </Col>
            <Col
              span={16}
              className="bg-white h-auto max-h-screen overflow-y-auto"
            >
              <div className="flex justify-between items-center m-4">
                <div className="text-xl font-bold">我的Bot</div>
                <div>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => setIsModalOpen(true)}
                  >
                    新建Bot
                  </Button>
                </div>
              </div>
              <Table<DataType> columns={columns} dataSource={data} />
            </Col>
          </Row>
        </div>
      </div>

      <Modal
        title="创建Bot"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
        destroyOnClose={true}
      >
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="名称"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input bot's name!",
              },
            ]}
          >
            <Input placeholder="input bot name" />
          </Form.Item>
          <Form.Item label="简介" name="description">
            <Input placeholder="input bot description" />
          </Form.Item>
          <Form.Item label="代码" name="content">
            <EditorComponent />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改Bot"
        open={isModalOpen2}
        onCancel={() => setIsModalOpen2(false)}
        footer={false}
        destroyOnClose={true}
      >
        <Divider />
        <Form
          layout="vertical"
          onFinish={onFinish2}
          initialValues={{
            name: selectedBot.name,
            description: selectedBot.description,
            content: selectedBot.content,
          }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input bot's name!",
              },
            ]}
          >
            <Input placeholder="input bot name" />
          </Form.Item>
          <Form.Item label="简介" name="description">
            <Input placeholder="input bot description" />
          </Form.Item>
          <Form.Item label="代码" name="content">
            <EditorComponent />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
