import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Group,
  Stack,
  Title,
  Button,
  Switch,
  UnstyledButton,
  ActionIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Table, type TableColumnsType, type TablePaginationConfig } from "antd";
import queryClient from "@/utils/query-client";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import type { AxiosResponse } from "axios";
import SearchInput from "@/components/search-input";
import type { BaseEntity } from "@/types";
import { changeBrandStatus, deleteBrand, getBrands } from "../api";
import type { Brand } from "../types";

export default function Brands(): React.ReactElement {
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await changeBrandStatus(id, isActive);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(["brands"]);
    },
    onError(error: AxiosResponse, variables, context) {
      console.error(error, variables, context);

      notifications.show({
        title: "Error",
        message: error.data.message,
        color: "red",
      });
    },
  });

  const brands = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await getBrands();
      return res;
    },
  });

  const columns: TableColumnsType<Brand> = useMemo(
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
        dataIndex: "name",
        render(value, record, _index) {
          return (
            <UnstyledButton
              className="text-blue-600"
              onClick={() => {
                navigate(record.id);
              }}
            >
              {value}
            </UnstyledButton>
          );
        },
      },
      {
        key: "merchant",
        title: "Merchant",
        dataIndex: "merchant",
        render(value: BaseEntity | null, _record, _index) {
          if (value !== null) {
            return (
              <UnstyledButton
                className="text-blue-600"
                onClick={() => {
                  navigate(`/merchants/${value.id}`);
                }}
              >
                {value.name}
              </UnstyledButton>
            );
          }

          return null;
        },
      },
      {
        key: "active",
        title: "Active",
        dataIndex: "isActive",
        render(value: boolean, _record, _index) {
          return (
            <Switch
              classNames={{
                track: "cursor-pointer",
              }}
              defaultChecked={value}
              onChange={(e) => {
                statusMutation.mutate({
                  id: _record.id,
                  isActive: e.target.checked,
                });
              }}
            />
          );
        },
      },
      {
        key: "actions",
        title: "Actions",
        render(_value, record, _index) {
          return (
            <Group>
              <ActionIcon
                variant="light"
                color="gray"
                onClick={() => {
                  navigate(record.id);
                }}
              >
                <FaEye />
              </ActionIcon>

              <ActionIcon
                variant="light"
                color="red"
                onClick={() => {
                  deleteMutation.mutate(record.id);
                }}
              >
                <MdDelete />
              </ActionIcon>
            </Group>
          );
        },
      },
    ],
    [navigate, deleteMutation, statusMutation],
  );

  const onSearch = (text: string): void => {
    console.log("searching: ", text);
  };

  const paginationProps: TablePaginationConfig = {
    current: 1,
    pageSize: 10,
    total: brands.data?.count ?? 0,
    showSizeChanger: true,
  };

  return (
    <Stack gap="xl">
      <Title>Brands</Title>

      <Group justify="space-between">
        <SearchInput
          queryKey="brands"
          fetcher={getBrands}
          onSearch={onSearch}
        />

        <Button
          onClick={() => {
            navigate("create");
          }}
        >
          New
        </Button>
      </Group>

      <Table
        columns={columns}
        dataSource={brands.data?.results ?? []}
        loading={brands.isLoading || brands.isFetching}
        pagination={paginationProps}
        rowKey={(record) => record.id}
      />
    </Stack>
  );
}
