import { useEffect, useState } from "react";
import {
  Group,
  Stack,
  Modal,
  TextInput,
  ScrollArea,
  Menu,
  Box,
  LoadingOverlay,
  Text,
  Button,
  Center,
  ActionIcon,
} from "@mantine/core";
import {
  useClickOutside,
  useDebouncedValue,
  useInputState,
} from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products";
import LazyImage from "@/components/lazy-image";
import { FaCheck, FaPlus } from "react-icons/fa";
import queryClient from "@/utils/query-client";
import { updateCategory } from "../api";

interface Props {
  categoryId: string;
  categoryTitle: string;
  modalOpened: boolean;
  closeModal: () => void;
  categoryProductIds: string[];
}

export default function ProductsModal(props: Props): React.ReactElement {
  const {
    categoryId,
    categoryTitle,
    modalOpened,
    closeModal,
    categoryProductIds,
  } = props;

  const [search, setSearch] = useInputState("");

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [opened, setOpened] = useState(false);

  const [loadingProductId, setLoadingProductId] = useState<string>();

  const products = useQuery({
    queryKey: ["products", categoryId, categoryProductIds],
    queryFn: async () => {
      const res = await getProducts({
        ids: categoryProductIds,
      });

      return res;
    },
    enabled: categoryId !== "",
    select(data) {
      return data.results;
    },
  });

  const searchProducts = useQuery({
    queryKey: ["products", categoryId, "search", debouncedSearch],
    queryFn: async () => {
      const res = await getProducts({
        search: debouncedSearch,
        limit: 10,
      });
      return res;
    },
    select(data) {
      return data.results;
    },
    placeholderData: { results: [], count: 0 },
  });

  const categoryMutation = useMutation({
    mutationFn: async (payload: { products: string[] }) => {
      const res = await updateCategory(categoryId, payload);
      return res;
    },
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      setLoadingProductId(undefined);
    },
  });

  const ref = useClickOutside(() => {
    setOpened(false);
  });

  useEffect(() => {
    setOpened(Boolean(debouncedSearch.trim()));
  }, [debouncedSearch]);

  return (
    <Modal
      opened={modalOpened}
      onClose={closeModal}
      title={`Category: ${categoryTitle}`}
    >
      <Stack>
        <Group>
          <Menu
            opened={opened}
            trapFocus={false}
            width="target"
            // onClose={() => {
            //   setOpened(false);
            // }}
          >
            <Menu.Target>
              <TextInput
                ref={ref}
                label="Add/remove category products"
                placeholder="Search products"
                flex={1}
                value={search}
                onChange={setSearch}
                onFocus={() => {
                  if (
                    !opened &&
                    typeof searchProducts.data?.length === "number" &&
                    searchProducts.data?.length > 0
                  ) {
                    setOpened(true);
                  }
                }}
                onClick={() => {
                  if (
                    !opened &&
                    typeof searchProducts.data?.length === "number" &&
                    searchProducts.data?.length > 0
                  ) {
                    setOpened(true);
                  }
                }}
              />
            </Menu.Target>

            <Menu.Dropdown ref={ref}>
              <Box pos="relative" mih={200}>
                <LoadingOverlay
                  visible={products.isLoading}
                  zIndex={1000}
                  overlayProps={{ radius: "sm", blur: 2 }}
                />

                {searchProducts.data?.map((entity) => (
                  <Menu.Item key={entity.id}>
                    <Group>
                      <Center w={32} className="rounded border">
                        <LazyImage
                          src={entity.images?.[0]?.imageUrl}
                          fit="contain"
                          alt="entity"
                          h={32}
                        />
                      </Center>

                      <Text size="sm" flex={1}>
                        {entity.name}
                      </Text>

                      {categoryProductIds.includes(entity.id) ? (
                        <ActionIcon
                          variant="light"
                          loading={
                            categoryMutation.isLoading &&
                            loadingProductId === entity.id
                          }
                          onClick={() => {
                            setLoadingProductId(entity.id);
                            categoryMutation.mutate({
                              products: categoryProductIds.filter(
                                (id) => id !== entity.id,
                              ),
                            });
                          }}
                        >
                          <FaCheck />
                        </ActionIcon>
                      ) : (
                        <ActionIcon
                          variant="light"
                          loading={
                            categoryMutation.isLoading &&
                            loadingProductId === entity.id
                          }
                          onClick={() => {
                            setLoadingProductId(entity.id);
                            categoryMutation.mutate({
                              products: [...categoryProductIds, entity.id],
                            });
                          }}
                        >
                          <FaPlus />
                        </ActionIcon>
                      )}
                    </Group>
                  </Menu.Item>
                ))}

                {searchProducts.data?.length === 0 && (
                  <Menu.Item>
                    <Text c="dimmed">No results</Text>
                  </Menu.Item>
                )}
              </Box>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <ScrollArea h={250}>
          {typeof products.data?.length === "number" &&
          products.data?.length > 0
            ? products.data?.map((p) => (
                <Group key={p.id} mb="4px">
                  <Center w={64} className="rounded border">
                    <LazyImage
                      src={p.images?.[0]?.imageUrl}
                      fit="contain"
                      alt="entity"
                      h={64}
                    />
                  </Center>

                  <Text size="sm" flex={1}>
                    {p.name}
                  </Text>
                </Group>
              ))
            : null}
        </ScrollArea>
      </Stack>
    </Modal>
  );
}
