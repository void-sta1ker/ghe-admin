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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { Table, type TableColumnsType, type TablePaginationConfig } from "antd";
import queryClient from "@/utils/query-client";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import type { AxiosResponse } from "axios";
import canMutate from "@/helpers/can-mutate";
import SearchInput from "@/components/search-input";
import { changeCategoryStatus, deleteCategory, getCategories } from "../api";
import type { Category } from "../types";
import ProductsModal from "../templates/products-modal";

export default function Categories(): React.ReactElement {
  const navigate = useNavigate();

  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const [categoryId, setCategoryId] = useState("");

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await changeCategoryStatus(id, isActive);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(["categories"]);
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

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      return res;
    },
  });

  const columns: TableColumnsType<Category> = useMemo(() => {
    const cols: TableColumnsType<Category> = [
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
                if (canMutate("categories")) {
                  navigate(record.id);
                } else {
                  setCategoryId(record.id);
                  openModal();
                }
              }}
            >
              {value}
            </UnstyledButton>
          );
        },
      },
      {
        key: "products-count",
        title: "Products count",
        dataIndex: "products",
        render(value: string[], _record, _index) {
          return <NumberFormatter value={value.length} thousandSeparator=" " />;
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
              disabled={!canMutate("categories")}
            />
          );
        },
      },
    ];

    if (canMutate("categories")) {
      cols.push({
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
      });
    }

    return cols;
  }, [navigate, openModal, deleteMutation, statusMutation]);

  const onSearch = (text: string): void => {
    console.log("searching: ", text);
  };

  const paginationProps: TablePaginationConfig = {
    current: 1,
    pageSize: 10,
    total: categories.data?.count ?? 0,
    showSizeChanger: true,
  };

  return (
    <Stack gap="xl">
      <Title>Categories</Title>

      <Group justify="space-between">
        <SearchInput
          queryKey="categories"
          fetcher={getCategories}
          onSearch={onSearch}
          imageAccessor="image.imageUrl"
        />

        {canMutate("categories") ? (
          <Button
            onClick={() => {
              navigate("create");
            }}
          >
            New
          </Button>
        ) : null}
      </Group>

      <Table
        columns={columns}
        dataSource={categories.data?.results ?? []}
        loading={categories.isLoading || categories.isFetching}
        pagination={paginationProps}
        rowKey={(record) => record.id}
      />

      <ProductsModal
        categoryId={categoryId}
        categoryTitle={
          categories?.data?.results?.find((c) => c.id === categoryId)?.name ??
          ""
        }
        modalOpened={modalOpened}
        closeModal={closeModal}
        categoryProductIds={
          categories?.data?.results?.find((c) => c.id === categoryId)
            ?.products ?? []
        }
      />
    </Stack>
  );
}
