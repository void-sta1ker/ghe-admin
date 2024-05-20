import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  MultiSelect,
  SimpleGrid,
  Stack,
  Switch,
  TextInput,
  Textarea,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useDebouncedValue, useInputState } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoIosArrowBack } from "react-icons/io";
import { getProducts } from "@/features/products";
import queryClient from "@/utils/query-client";
import genSlug from "@/helpers/gen-slug";
import type { AxiosResponse } from "axios";
import { initialValues, validate } from "../data";
import { createCategory, getCategory, updateCategory } from "../api";
import type { CategoryData } from "../types";

export default function CreateCategory(): React.ReactElement {
  const { categoryId = "" } = useParams();

  const navigate = useNavigate();

  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const [search, setSearch] = useInputState("");

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const category = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: async () => {
      const res = await getCategory(categoryId);
      return res;
    },
    select(data) {
      return data;
    },
    enabled: Boolean(categoryId),
  });

  const products = useQuery({
    queryKey: ["products", categoryId, debouncedSearch],
    queryFn: async () => {
      const res = await getProducts({ categoryId, search: debouncedSearch });
      return res;
    },
    select(data) {
      return data.results.map(({ id, name }) => ({ value: id, label: name }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryData }) => {
      const res = await updateCategory(id, data);
      return res;
    },
    onSuccess: () => {
      navigate("/categories");
      void queryClient.invalidateQueries(["categories"]);
    },
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      navigate("/categories");
      void queryClient.invalidateQueries(["categories"]);
    },
    onError: (res: AxiosResponse, _variables, _context) => {
      console.error(res);
      notifications.show({
        title: "Error",
        message: res.data?.message,
        color: "red",
      });
    },
  });

  const form = useForm({ initialValues, validate });

  const onSubmit = form.onSubmit((values) => {
    if (categoryId !== "") {
      updateMutation.mutate({ id: categoryId, data: values });
    } else {
      createMutation.mutate(values);
    }
  });

  const onGoBack = (): void => {
    navigate(-1);
  };

  const initializeForm = async (values: CategoryData): Promise<void> => {
    form.setValues(values);
    form.resetDirty(values);
  };

  useEffect(() => {
    if (typeof category.data !== "undefined") {
      void initializeForm(category.data).then(() => {
        setIsOverlayVisible(false);
      });
    }

    if (categoryId === "") {
      setIsOverlayVisible(false);
    }
  }, [category.data, categoryId]);

  useEffect(() => {
    if (category.isError) {
      notifications.show({
        title: "Error",
        message: category.error?.data?.message ?? "Something went wrong",
        color: "red",
      });

      setIsOverlayVisible(false);
    }
  }, [category.isError]);

  console.log(form.values);

  console.log(products.data);

  return (
    <Stack gap="lg" pos="relative">
      <LoadingOverlay
        visible={isOverlayVisible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Group>
        <ActionIcon variant="light" color="dark" onClick={onGoBack}>
          <IoIosArrowBack />
        </ActionIcon>

        <Title>Category details</Title>
      </Group>

      <form onSubmit={onSubmit}>
        <SimpleGrid cols={2} mt="lg">
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Category name"
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Slug"
            placeholder="Category slug"
            classNames={{
              input: "pr-[100px]",
              section: "w-[100px]",
            }}
            rightSection={
              <UnstyledButton
                classNames={{
                  root: "text-[12px]",
                }}
                c="blue"
                fw={500}
                onClick={() => {
                  form.setFieldValue("slug", genSlug(form.values.name));
                }}
              >
                Auto generate
              </UnstyledButton>
            }
            {...form.getInputProps("slug")}
          />

          <MultiSelect
            label="Products"
            placeholder="Add or remove products"
            searchable
            data={products.data}
            {...form.getInputProps("products")}
          />

          <Textarea
            withAsterisk
            label="Description"
            placeholder="Enter description"
            {...form.getInputProps("description")}
          />
        </SimpleGrid>

        <Switch
          mt="md"
          label="Status"
          classNames={{
            track: "cursor-pointer",
            label: "cursor-pointer",
          }}
          {...form.getInputProps("isActive", { type: "checkbox" })}
        />

        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            loading={createMutation.isLoading || updateMutation.isLoading}
            disabled={!form.isDirty()}
          >
            {categoryId !== "" ? "Update" : "Create"}
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
