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
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Table, type TableColumnsType, type TablePaginationConfig } from "antd";
import { PatternFormat } from "react-number-format";
import queryClient from "@/utils/query-client";
import { MdDelete } from "react-icons/md";
import { FaCheck, FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import SearchInput from "@/components/search-input";
import type { AxiosResponse } from "axios";
import type { BaseEntity } from "@/types";
import {
  approveMerchant,
  changeMerchantStatus,
  deleteMerchant,
  getMerchants,
  rejectMerchant,
} from "../api";
import type { Merchant } from "../types";

export default function Merchants(): React.ReactElement {
  const navigate = useNavigate();

  const merchants = useQuery({
    queryKey: ["merchants"],
    queryFn: async () => {
      const res = await getMerchants();
      return res;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMerchant,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await changeMerchantStatus(id, isActive);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(["merchants"]);
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

  const approveMutation = useMutation({
    mutationFn: approveMerchant,
    onSuccess(_data, _variables, _context) {
      void queryClient.invalidateQueries({ queryKey: ["merchants"] });

      notifications.show({
        message: "Success",
        color: "green",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectMerchant,
    onSuccess(_data, _variables, _context) {
      void merchants.refetch();

      notifications.show({
        message: "Success",
        color: "green",
      });
    },
  });

  const columns: TableColumnsType<Merchant> = useMemo(
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
        key: "brand-name",
        title: "Brand",
        dataIndex: "brand",
        render(value: BaseEntity | null, _record, _index) {
          if (value !== null) {
            return (
              <UnstyledButton
                className="text-blue-600"
                onClick={() => {
                  navigate(`/brands/${value.id}`);
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
        key: "status",
        title: "Status",
        dataIndex: "status",
      },
      {
        key: "active",
        title: "Active",
        dataIndex: "isActive",
        render(value: boolean, record, _index) {
          return (
            <Switch
              classNames={{
                track: "cursor-pointer",
              }}
              defaultChecked={value}
              onChange={(e) => {
                statusMutation.mutate({
                  id: record.id,
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
          if (record.status === "WAITING_APPROVAL") {
            return (
              <Group>
                <Tooltip label="Approve">
                  <ActionIcon
                    variant="light"
                    color="green"
                    loading={approveMutation.isLoading}
                    onClick={() => {
                      onApprove(record.id);
                    }}
                  >
                    <FaCheck />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Reject">
                  <ActionIcon
                    variant="light"
                    color="red"
                    loading={rejectMutation.isLoading}
                    onClick={() => {
                      onReject(record.id);
                    }}
                  >
                    <IoClose size={24} />
                  </ActionIcon>
                </Tooltip>

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
          }

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

  const onApprove = (id: string): void => {
    approveMutation.mutate(id);
  };

  const onReject = (id: string): void => {
    rejectMutation.mutate(id);
  };

  const paginationProps: TablePaginationConfig = {
    current: 1,
    pageSize: 10,
    total: merchants.data?.count ?? 0,
    showSizeChanger: true,
  };

  return (
    <Stack gap="xl">
      <Title>Merchants</Title>

      <Group justify="space-between">
        <SearchInput
          queryKey="merchants"
          fetcher={getMerchants}
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
        dataSource={merchants.data?.results ?? []}
        loading={merchants.isLoading || merchants.isFetching}
        pagination={paginationProps}
        rowKey={(record) => record.id}
      />
    </Stack>
  );
}
