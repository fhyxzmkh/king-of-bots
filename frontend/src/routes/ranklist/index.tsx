import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../../utils/auth.tsx";
import { Space, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../../store/userStore.ts";

export const Route = createFileRoute("/ranklist/")({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/user/account/login" });
    }
  },
  component: RouteComponent,
});

interface DataType {
  key: string;
  player: string;
  rating: number;
}

function RouteComponent() {
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(10); // 每页大小

  const [isLoading, setIsLoading] = useState(false); // 加载状态

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "玩家",
      key: "player",
      render: (_, user) => (
        <Space>
          <img
            src={user.avatar}
            alt="玩家A头像"
            style={{ width: 24, height: 24, borderRadius: "50%" }}
          />
          <span>{user.username}</span>
        </Space>
      ),
    },
    {
      title: "天梯积分",
      dataIndex: ["rating"],
      key: "rating",
    },
  ];

  const fetchData = async (page, size) => {
    setIsLoading(true); // 开始加载
    const response = await axios({
      method: "get",
      url: "http://localhost:8686/api/ranklist/getList",
      headers: {
        Authorization: `Bearer ${useUserStore.getState().user.token}`,
      },
      params: {
        page: page, // 当前页码
        page_size: size, // 每页大小
      },
    });

    const formattedRecords = response.data.users.map((user) => ({
      ...user,
      key: user.id,
    }));

    setRecords(formattedRecords);
    setTotalRecords(response.data.records_count);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  return (
    <div className="w-3/5 mx-auto mt-4">
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
  );
}
