import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../../utils/auth.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../../store/userStore.ts";
import { Button, Modal, Space, Table, TableProps } from "antd";
import { GameMap } from "../../components/GameMap.tsx";

export const Route = createFileRoute("/record/")({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/user/account/login" });
    }
  },
  component: RouteComponent,
});

interface DataType {
  key: string;
  playerA: string;
  playerB: string;
  pk_result: string;
  pk_time: string;
}

function RouteComponent() {
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(10); // 每页大小

  const [isLoading, setIsLoading] = useState(false); // 加载状态

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "玩家A",
      key: "playerA",
      render: (_, record) => (
        <Space>
          <img
            src={record.a_avatar}
            alt="玩家A头像"
            style={{ width: 24, height: 24, borderRadius: "50%" }}
          />
          <span>{record.a_username}</span>
        </Space>
      ),
    },
    {
      title: "玩家B",
      key: "playerB",
      render: (_, record) => (
        <Space>
          <img
            src={record.b_avatar}
            alt="玩家B头像"
            style={{ width: 24, height: 24, borderRadius: "50%" }}
          />
          <span>{record.b_username}</span>
        </Space>
      ),
    },
    {
      title: "对局结果",
      dataIndex: ["record", "loser"],
      key: "pk_result",
      render: (loser) => {
        if (loser === "all") {
          return "平局";
        } else if (loser === "A") {
          return "玩家B胜利";
        } else if (loser === "B") {
          return "玩家A胜利";
        } else {
          return "未知结果";
        }
      },
    },
    {
      title: "对局时间",
      dataIndex: ["record", "createTime"],
      key: "pk_time",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              setIsModalOpen(true);
              setSelectedRecord(record);
            }}
          >
            查看对局详情
          </Button>
        </Space>
      ),
    },
  ];

  const fetchData = async (page, size) => {
    setIsLoading(true); // 开始加载
    const response = await axios({
      method: "get",
      url: "http://localhost:8686/api/record/getList",
      headers: {
        Authorization: `Bearer ${useUserStore.getState().user.token}`,
      },
      params: {
        page: page, // 当前页码
        page_size: size, // 每页大小
      },
    });

    const formattedRecords = response.data.records.map((record) => ({
      ...record,
      key: record.record.id,
    }));

    setRecords(formattedRecords);
    setTotalRecords(response.data.records_count);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  return (
    <>
      <div className="w-4/5 mx-auto mt-4">
        <Table<DataType>
          columns={columns}
          dataSource={records}
          loading={isLoading}
          pagination={{
            current: currentPage, // 当前页码
            pageSize: pageSize, // 每页大小
            total: totalRecords, // 总记录数
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true, // 显示每页大小切换器
            pageSizeOptions: ["10", "20", "50"], // 每页大小选项
          }}
        />
      </div>
      <Modal
        title="对局回放"
        width={800}
        height={600}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={false}
        destroyOnClose={true}
      >
        <GameMap recordParams={selectedRecord} />
      </Modal>
    </>
  );
}
