import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Group, Stack, Title, UnstyledButton } from "@mantine/core";
import { Table, type TableColumnsType, type TablePaginationConfig } from "antd";
import { PatternFormat } from "react-number-format";
import SearchInput from "@/components/search-input";
import { getUsers } from "../api";
import type { User } from "../types";

export default function Users(): React.ReactElement {
  const users = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsers();
      return res;
    },
  });

  const columns: TableColumnsType<User> = useMemo(
    () => [
      {
        key: "index",
        title: "№",
        render(_value, _record, index) {
          return index + 1;
        },
      },
      {
        key: "name",
        title: "Name",
        dataIndex: "firstName",
        render(value: string, record, _index) {
          return (
            <UnstyledButton className="text-blue-600" disabled>
              {`${value} ${record.lastName}`}
            </UnstyledButton>
          );
        },
      },
      {
        key: "phone-number",
        title: "Phone number",
        dataIndex: "phoneNumber",
        render(value, _record, _index) {
          return (
            <PatternFormat
              format="+### ## ### ## ##"
              value={value}
              displayType="text"
            />
          );
        },
      },
      {
        key: "role",
        title: "Role",
        dataIndex: "role",
      },
      {
        key: "merchant",
        title: "Merchant",
        dataIndex: "merchant",
      },
    ],
    [],
  );

  const onSearch = (text: string): void => {
    console.log("searching: ", text);
  };

  const paginationProps: TablePaginationConfig = {
    current: 1,
    pageSize: 10,
    total: users.data?.count ?? 0,
    showSizeChanger: true,
  };

  return (
    <Stack gap="xl">
      <Title>Users</Title>

      <Group justify="space-between">
        <SearchInput queryKey="users" fetcher={getUsers} onSearch={onSearch} />
      </Group>

      <Table
        columns={columns}
        dataSource={users.data?.results ?? []}
        loading={users.isLoading || users.isFetching}
        pagination={paginationProps}
        rowKey={(record) => record.id}
      />
    </Stack>
  );
}
