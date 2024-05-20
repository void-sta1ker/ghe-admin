import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  Group,
  Rating,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Table, type TableColumnsType, type TablePaginationConfig } from "antd";
import { FaRegThumbsUp, FaRegThumbsDown, FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import queryClient from "@/utils/query-client";
import canMutate from "@/helpers/can-mutate";
import canSee from "@/helpers/can-see";
import type { BaseEntity } from "@/types";
import SearchInput from "@/components/search-input";
import { approveReview, getReviews, rejectReview } from "../api";
import type { Review } from "../types";

export default function Reviews(): React.ReactElement {
  const navigate = useNavigate();

  const reviews = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await getReviews();
      return res;
    },
    placeholderData: { results: [], count: 0 },
  });

  const reviewMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      action: "approve" | "reject";
    }) => {
      const { id, action } = payload;

      if (action === "approve") {
        const res = await approveReview(id);
        return res;
      }

      const res = await rejectReview(id);
      return res;
    },
    onSuccess(_data, variables) {
      const { action } = variables;

      void queryClient.invalidateQueries({ queryKey: ["reviews"] });

      notifications.show({
        title: "Success",
        message: `Review ${action === "approve" ? "approved" : "rejected"}`,
        color: "green",
      });
    },
  });

  const columns: TableColumnsType<Review> = useMemo(() => {
    const cols: TableColumnsType<Review> = [
      {
        key: "index",
        title: "№",
        render(_value, _record, index) {
          return index + 1;
        },
      },
      {
        key: "title",
        title: "Title",
        dataIndex: "title",
      },
      {
        key: "review",
        title: "Review",
        dataIndex: "review",
        render(value: string) {
          return (
            <Tooltip label={value}>
              <Text size="sm">
                {value.length > 100 ? `${value.slice(0, 100)}...` : value}
              </Text>
            </Tooltip>
          );
        },
      },
      {
        key: "rating",
        title: "Rating",
        dataIndex: "rating",
        render(value: number) {
          return <Rating size="xs" value={value} readOnly />;
        },
      },
      {
        key: "is-recommended",
        title: "Recommended",
        dataIndex: "isRecommended",
        render(value: boolean) {
          return value ? (
            <FaRegThumbsUp color="green" />
          ) : (
            <FaRegThumbsDown color="red" />
          );
        },
      },
      {
        key: "product",
        title: "Product",
        dataIndex: "product",
        render(value: BaseEntity) {
          return (
            <UnstyledButton
              className="text-blue-600"
              onClick={() => {
                navigate(`/products/${value.id}`);
              }}
            >
              {value?.name}
            </UnstyledButton>
          );
        },
      },
      {
        key: "user",
        title: "User",
        dataIndex: "user",
        render(value: BaseEntity) {
          if (canSee("reviews")) {
            return (
              <UnstyledButton
                className="text-blue-600"
                onClick={() => {
                  navigate(`/users/${value.id}`);
                }}
              >
                {value?.name}
              </UnstyledButton>
            );
          }

          return value?.name;
        },
      },
      {
        key: "status",
        title: "Status",
        dataIndex: "status",
      },
    ];

    if (canMutate("reviews")) {
      cols.push({
        key: "actions",
        title: "Actions",
        render(_value, record, _index) {
          if (record.status !== "APPROVED") {
            return (
              <Group>
                <Tooltip label="Approve">
                  <ActionIcon
                    variant="light"
                    color="green"
                    onClick={() => {
                      onApprove(record.id);
                    }}
                  >
                    <FaCheck />
                    {/* <IoCheckmark /> */}
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Reject">
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => {
                      onReject(record.id);
                    }}
                  >
                    <IoClose size={24} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            );
          }

          return null;
        },
      });
    }

    return cols;
  }, [navigate]);

  const onSearch = (text: string): void => {
    console.log("searching: ", text);
  };

  const onApprove = (id: string): void => {
    reviewMutation.mutate({ id, action: "approve" });
  };

  const onReject = (id: string): void => {
    reviewMutation.mutate({ id, action: "reject" });
  };

  const paginationProps: TablePaginationConfig = {
    current: 1,
    pageSize: 10,
    total: reviews.data?.count ?? 0,
    showSizeChanger: true,
  };

  return (
    <Stack gap="xl">
      <Title>Reviews</Title>

      <Group justify="space-between">
        <SearchInput
          queryKey="reviews"
          fetcher={getReviews}
          onSearch={onSearch}
          nameAccessor="title"
        />
      </Group>

      <Table
        columns={columns}
        dataSource={reviews.data?.results}
        loading={reviews.isLoading || reviews.isFetching}
        pagination={paginationProps}
        rowKey={(record) => record.id}
      />
    </Stack>
  );
}
