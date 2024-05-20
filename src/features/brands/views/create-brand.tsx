import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IoIosArrowBack } from "react-icons/io";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMerchants } from "@/features/merchants";
import queryClient from "@/utils/query-client";
import formToFormData from "@/helpers/form-to-formdata";
import dataToForm from "../helpers/data-to-form";
import { initialValues, validate, fileMap } from "../data";
import { createBrand, getBrand, updateBrand } from "../api";
import type { BrandData } from "../types";

export default function CreateBrand(): React.ReactElement {
  const { brandId = "" } = useParams();

  const navigate = useNavigate();

  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const brand = useQuery({
    queryKey: ["brands", brandId],
    queryFn: async () => {
      const res = await getBrand(brandId);
      return res;
    },
    enabled: Boolean(brandId),
  });

  const merchants = useQuery({
    queryKey: ["merchants", brandId],
    queryFn: async () => {
      const res = await getMerchants();
      return res;
    },
    select(data) {
      return data.results.map(({ id, name }) => ({ value: id, label: name }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const res = await updateBrand(id, data);
      return res;
    },
    onSuccess: () => {
      navigate("/brands");
      void queryClient.invalidateQueries(["brands"]);
    },
  });

  const createMutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      navigate("/brands");
      void queryClient.invalidateQueries(["brands"]);
    },
  });

  const form = useForm({ initialValues, validate });

  const onSubmit = form.onSubmit((values) => {
    const formData = formToFormData(values);

    if (brandId !== "") {
      updateMutation.mutate({ id: brandId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  });

  const onGoBack = (): void => {
    navigate(-1);
  };

  const initializeForm = async (brandData: BrandData): Promise<void> => {
    const values = dataToForm(brandData);
    form.setValues(values);
    form.resetDirty(values);
  };

  useEffect(() => {
    if (typeof brand.data !== "undefined") {
      void initializeForm(brand.data).then(() => {
        setIsOverlayVisible(false);
      });
    }

    if (brandId === "") {
      setIsOverlayVisible(false);
    }
  }, [brand.data, brandId]);

  useEffect(() => {
    if (brand.isError) {
      notifications.show({
        title: "Error",
        message: brand.error?.data?.message ?? "Something went wrong",
        color: "red",
      });

      setIsOverlayVisible(false);
    }
  }, [brand.isError]);

  console.log(form.values, fileMap.entries());

  console.log(merchants.data);

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

        <Title>Brand details</Title>
      </Group>

      <form onSubmit={onSubmit}>
        <SimpleGrid cols={2} mt="lg">
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Brand name"
            {...form.getInputProps("name")}
          />

          <Select
            label="Merchant"
            placeholder="Select merchant"
            data={merchants.data}
            {...form.getInputProps("merchant")}
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
            {brandId !== "" ? "Update" : "Create"}
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
