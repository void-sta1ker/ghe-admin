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
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { PatternFormat } from "react-number-format";
import { IoIosArrowBack } from "react-icons/io";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBrands } from "@/features/brands";
import { getMerchantStatuses } from "@/features/profile";
import queryClient from "@/utils/query-client";
import dataToForm from "../helpers/data-to-form";
import { initialValues, validate } from "../data";
import { createMerchant, getMerchant, updateMerchant } from "../api";
import type { MerchantData } from "../types";

export default function CreateMerchant(): React.ReactElement {
  const { merchantId = "" } = useParams();

  const navigate = useNavigate();

  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const merchant = useQuery({
    queryKey: ["merchants", merchantId],
    queryFn: async () => {
      const res = await getMerchant(merchantId);
      return res;
    },
    enabled: Boolean(merchantId),
  });

  const brands = useQuery({
    queryKey: ["brands", merchantId],
    queryFn: async () => {
      const res = await getBrands();
      return res;
    },
    select(data) {
      return data.results.map(({ id, name }) => ({ value: id, label: name }));
    },
  });

  const merchantStatuses = useQuery({
    queryKey: ["merchant-statuses"],
    queryFn: getMerchantStatuses,
    select(data) {
      return data.results;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MerchantData }) => {
      const res = await updateMerchant(id, data);
      return res;
    },
    onSuccess: () => {
      navigate("/merchants");
      void queryClient.invalidateQueries(["merchants"]);
    },
  });

  const createMutation = useMutation({
    mutationFn: createMerchant,
    onSuccess: () => {
      navigate("/merchants");
      void queryClient.invalidateQueries(["merchants"]);
    },
  });

  const form = useForm({ initialValues, validate });

  const onSubmit = form.onSubmit((values) => {
    if (merchantId !== "") {
      updateMutation.mutate({
        id: merchantId,
        data: { ...values, phoneNumber: values.phoneNumber.replace(/\D/g, "") },
      });
    } else {
      createMutation.mutate({
        ...values,
        phoneNumber: values.phoneNumber.replace(/\D/g, ""),
      });
    }
  });

  const onGoBack = (): void => {
    navigate(-1);
  };

  const initializeForm = async (merchantData: MerchantData): Promise<void> => {
    if (merchantId !== "") {
      const values = dataToForm(merchantData);
      form.setValues(values);
      form.resetDirty(values);
    }
  };

  useEffect(() => {
    if (typeof merchant.data !== "undefined") {
      void initializeForm(merchant.data).then(() => {
        setIsOverlayVisible(false);
      });
    }

    if (merchantId === "") {
      setIsOverlayVisible(false);
    }
  }, [merchant.data, merchantId]);

  useEffect(() => {
    if (merchant.isError) {
      notifications.show({
        title: "Error",
        message: merchant.error?.data?.message ?? "Something went wrong",
        color: "red",
      });

      setIsOverlayVisible(false);
    }
  }, [merchant.isError]);

  console.log(form.values);

  console.log(brands.data);

  console.log(merchantStatuses.data);

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

        <Title>Merchant details</Title>
      </Group>

      <form onSubmit={onSubmit}>
        <SimpleGrid cols={2} mt="lg">
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Merchant name"
            {...form.getInputProps("name")}
          />

          <PatternFormat
            withAsterisk
            customInput={TextInput}
            format="+998 ## ### ## ##"
            mask="_"
            label="Phone number"
            placeholder="+998"
            {...form.getInputProps("phoneNumber")}
          />

          <TextInput
            label="Brand name"
            placeholder="Enter brand name"
            {...form.getInputProps("brandName")}
          />

          <Select
            label="Brand"
            placeholder="Select brand"
            data={brands.data}
            {...form.getInputProps("brand")}
          />

          <TextInput
            withAsterisk
            label="Business"
            placeholder="Enter business"
            {...form.getInputProps("business")}
          />

          <Select
            label="Status"
            placeholder="Select status"
            data={merchantStatuses.data}
            {...form.getInputProps("status")}
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
            {merchantId !== "" ? "Update" : "Create"}
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
