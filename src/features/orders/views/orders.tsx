import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Group,
  Stack,
  Title,
  UnstyledButton,
  ActionIcon,
  NumberFormatter,
  Modal,
  Text,
  SimpleGrid,
  Select,
  Button,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Table, type TableColumnsType, type TablePaginationConfig } from "antd";
import { PatternFormat } from "react-number-format";
import { FaEye } from "react-icons/fa";
import { getCartItemStatuses } from "@/features/profile";
import canSee from "@/helpers/can-see";
import Search from "@/components/search-input";
import { changeStatus, getOrders } from "../api";
import type { Order } from "../types";

export default function Orders(): React.ReactElement {
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure();

  const [orderId, setOrderId] = useState("");

  const [status, setStatus] = useState<string | null>(null);

  const orders = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await getOrders();
      return res;
    },
  });

  const statuses = useQuery({
    queryKey: ["order-statuses"],
    queryFn: getCartItemStatuses,
    select(data) {
      return data.results;
    },
    placeholderData: {
      results: [],
      count: 0,
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (payload: {
      orderId: string;
      cartId: string;
      itemId: string;
      status: string;
    }) => {
      const { itemId, cartId, orderId: order, status: statusId } = payload;
      const res = await changeStatus(itemId, {
        orderId: order,
        cartId,
        status: statusId,
      });
      return res;
    },
  });

  const columns: TableColumnsType<Order> = useMemo(
    () => [
      {
        key: "index",
        title: "№",
        render(_value, _record, index) {
          return index + 1;
        },
      },
      {
        key: "order-id",
        title: "Order ID",
        dataIndex: "id",
        render(value, _record, _index) {
          return (
            <UnstyledButton
              className="text-blue-600"
              onClick={() => {
                navigate(value);
              }}
            >
              {value}
            </UnstyledButton>
          );
        },
      },
      {
        key: "user",
        title: "User",
        dataIndex: "user",
        render(user, record, _index) {
          if (canSee("orders")) {
            return (
              <UnstyledButton
                className="text-blue-600"
                onClick={() => {
                  navigate(`/users/${record.id}`);
                }}
              >
                {user.name}
              </UnstyledButton>
            );
          }
          return user.name;
        },
      },
      {
        key: "phone-number",
        title: "Phone number",
        dataIndex: "user",
        render(user, _record, _index) {
          return (
            <PatternFormat
              format="+### ## ### ## ##"
              value={user.phoneNumber}
              displayType="text"
            />
          );
        },
      },
      {
        key: "total-price",
        title: "Total price",
        dataIndex: "total",
        render(value, _record, _index) {
          return (
            <NumberFormatter
              value={value}
              suffix=" som"
              thousandSeparator=" "
            />
          );
        },
      },
      {
        key: "status",
        title: "Status",
        dataIndex: "products",
        render(products, _record, _index) {
          return products?.at(0)?.status ?? "";
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
                  // navigate(record.id);
                  setOrderId(record.id);
                  open();
                }}
              >
                <FaEye />
              </ActionIcon>
            </Group>
          );
        },
      },
    ],
    [navigate, open],
  );

  const onSearch = (text: string): void => {
    console.log("searching: ", text);
  };

  const onChangeStatus = (): void => {
    if (status !== null) {
      order?.products.forEach((item) => {
        statusMutation.mutate({
          itemId: item._id,
          cartId: order.cart,
          orderId,
          status,
        });
      });

      setTimeout(() => {
        close();
        void orders.refetch();
      }, 500);
    }
  };

  const paginationProps: TablePaginationConfig = {
    current: 1,
    pageSize: 10,
    total: orders.data?.count ?? 0,
    showSizeChanger: true,
  };

  const order =
    orderId !== ""
      ? orders.data?.results?.find((o) => o.id === orderId)
      : undefined;

  return (
    <Stack gap="xl">
      <Title>Orders</Title>

      <Group justify="space-between">
        <Search
          queryKey="orders"
          fetcher={getOrders}
          onSearch={onSearch}
          nameAccessor="id"
        />
      </Group>

      <Table
        columns={columns}
        dataSource={orders.data?.results ?? []}
        loading={orders.isLoading || orders.isFetching}
        pagination={paginationProps}
        rowKey={(record) => record.id}
      />

      <Modal title="Order details" opened={opened} onClose={close}>
        {order?.products.map((product) => (
          <SimpleGrid key={product.product.id} cols={3}>
            <Text>{product.product.name}</Text>
            <Text>x {product.quantity}</Text>
            <NumberFormatter
              value={product.totalPrice}
              suffix=" som"
              thousandSeparator=" "
            />
          </SimpleGrid>
        ))}

        <Divider my="md" />
        <Stack>
          <Group justify="between">
            <Text flex={1}>New status:</Text>

            <Select
              placeholder="Select status"
              data={statuses.data}
              value={status}
              onChange={setStatus}
            />
          </Group>

          <Button
            variant="light"
            disabled={status === null}
            loading={statusMutation.isLoading}
            onClick={onChangeStatus}
            className="self-end"
          >
            Change
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
