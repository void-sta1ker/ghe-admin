import { useMemo, useState } from "react";
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
  NumberFormatter,
  Flex,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Table, type TableColumnsType, type TablePaginationConfig } from "antd";
import queryClient from "@/utils/query-client";
// import { type ColumnsType } from "antd/es/table";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import type { AxiosResponse } from "axios";
import type { TableRowSelection } from "antd/es/table/interface";
import LazyImage from "@/components/lazy-image";
import SearchInput from "@/components/search-input";
import ConfirmDelete from "../templates/confirm-delete";
import BulkImport from "../templates/bulk-import";
import { changeProductStatus, deleteProduct, getProducts } from "../api";
import type { Product } from "../types";

export default function Products(): React.ReactElement {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [productId, setProductId] = useState<string>();

  const [rowKeys, setRowKeys] = useState<React.Key[]>([]);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await changeProductStatus(id, isActive);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(["products"]);
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

  const products = useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      const res = await getProducts({ search });
      return res;
    },
    placeholderData: { results: [], count: 0 },
  });

  const columns: TableColumnsType<Product> = useMemo(
    () => [
      {
        key: "index",
        title: "№",
        render(_value, _record, index) {
          return index + 1;
        },
      },
      {
        key: "image",
        title: "Image",
        dataIndex: "images",
        render(value, _record, _index) {
          return (
            <Flex align="center" h={64} w={64}>
              <LazyImage
                src={value?.at(0)?.imageUrl ?? ""}
                fit="contain"
                alt="product"
                h={32}
              />
            </Flex>
          );
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
        key: "price",
        title: "Price",
        dataIndex: "price",
        render(value, _record, _index) {
          return (
            <NumberFormatter
              value={value}
              thousandSeparator=" "
              suffix=" so'm"
            />
          );
        },
      },
      { key: "sku", title: "SKU", dataIndex: "sku" },
      { key: "barcode", title: "Barcode", dataIndex: "barcode" },
      {
        key: "status",
        title: "Status",
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

              <ConfirmDelete
                onCancel={() => {
                  setProductId(undefined);
                }}
                onDeleteConfirm={onDeleteConfirm}
                onDeleteClick={() => {
                  setProductId(record.id);
                }}
              />
            </Group>
          );
        },
      },
    ],
    [navigate, statusMutation],
  );

  const onSearch = (text: string): void => {
    setSearch(text);
  };

  const onDeleteConfirm = ({ close }: { close: () => void }): void => {
    if (Array.isArray(rowKeys) && rowKeys.length > 0) {
      rowKeys.forEach((id) => {
        deleteMutation.mutate(id as string);
      });

      void queryClient.invalidateQueries({ queryKey: ["products"] });

      setRowKeys([]);

      notifications.show({
        title: "Success",
        message: "Products deleted successfully!",
        color: "green",
      });

      close();
    }

    if (typeof productId === "string") {
      deleteMutation.mutate(productId, {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: ["products"] });

          setProductId(undefined);

          notifications.show({
            title: "Success",
            message: "Product deleted successfully!",
            color: "green",
          });

          close();
        },
      });
    }
  };

  const paginationProps: TablePaginationConfig = {
    current: 1,
    pageSize: 10,
    total: products.data?.count,
    showSizeChanger: true,
  };

  const rowSelection: TableRowSelection<Product> = {
    type: "checkbox",
    selectedRowKeys: rowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: Product[]) => {
      setRowKeys(selectedRowKeys);

      console.log(
        `selectedRowKeys: ${selectedRowKeys.toString()}`,
        "selectedRows: ",
        selectedRows,
      );
    },
    getCheckboxProps: (record: Product) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <Stack gap="xl">
      <Title>Products</Title>

      <Group justify="space-between">
        <Group>
          <SearchInput
            queryKey="products"
            fetcher={getProducts}
            onSearch={onSearch}
            imageAccessor="images.0.imageUrl"
          />

          <ConfirmDelete
            onDeleteConfirm={onDeleteConfirm}
            renderButton={({ open }) =>
              rowKeys.length > 0 ? (
                <Button
                  variant="outline"
                  color="red"
                  rightSection={<MdDelete />}
                  onClick={open}
                >
                  Delete all
                </Button>
              ) : null
            }
          />
        </Group>

        <Group>
          <BulkImport />

          <Button
            onClick={() => {
              navigate("create");
            }}
          >
            New
          </Button>
        </Group>
      </Group>

      <Table
        columns={columns}
        dataSource={products.data?.results}
        loading={products.isLoading || products.isFetching}
        pagination={paginationProps}
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
      />
    </Stack>
  );
}
