import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PatternFormat } from "react-number-format";
import { getMerchants } from "@/features/merchants";
import queryClient from "@/utils/query-client";
import { IoIosArrowBack } from "react-icons/io";
import dataToForm from "../helpers/data-to-form";
import { initialValues, validate } from "../data";
import { getProfile, getRoles, updateProfile } from "../api";
import type { ProfileData } from "../types";

export default function Profile(): React.ReactElement {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const navigate = useNavigate();

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const roles = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    select(data) {
      return data.results;
    },
  });

  const merchants = useQuery({
    queryKey: ["merchants"],
    queryFn: async () => {
      const res = await getMerchants();
      return res;
    },
    select(data) {
      return data.results.map(({ id, name }) => ({ value: id, label: name }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      void queryClient.invalidateQueries(["profile"]);

      form.resetDirty();

      notifications.show({
        title: "Success",
        message: res.message,
        color: "green",
      });
    },
  });

  console.log(profile.data);

  const form = useForm({
    initialValues,
    validate,
  });

  const onSubmit = form.onSubmit((values) => {
    updateMutation.mutate({
      ...values,
      phoneNumber: values.phoneNumber.replace(/\D/g, ""),
    });
  });

  const onGoBack = (): void => {
    navigate(-1);
  };

  const initializeForm = async (profileData: ProfileData): Promise<void> => {
    const values = dataToForm(profileData);
    form.setValues(values);
    form.resetDirty(values);
  };

  useEffect(() => {
    if (typeof profile.data !== "undefined") {
      void initializeForm(profile.data).then(() => {
        setIsOverlayVisible(false);
      });
    }
  }, [profile.data]);

  useEffect(() => {
    if (profile.isError) {
      notifications.show({
        title: "Error",
        message: profile.error?.data?.message ?? "Something went wrong",
        color: "red",
      });

      setIsOverlayVisible(false);
    }
  }, [profile.isError]);

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

        <Title>Profile details</Title>
      </Group>

      <form onSubmit={onSubmit}>
        <SimpleGrid cols={2} mt="lg">
          <TextInput
            withAsterisk
            label="First name"
            placeholder="First name"
            {...form.getInputProps("firstName")}
          />

          <TextInput
            withAsterisk
            label="Last name"
            placeholder="Last name"
            {...form.getInputProps("lastName")}
          />

          <PatternFormat
            customInput={TextInput}
            format="+998 ## ### ## ##"
            mask="_"
            withAsterisk
            label="Phone number"
            placeholder="+998"
            {...form.getInputProps("phoneNumber")}
          />

          <Select
            label="Role"
            placeholder="Select role"
            data={roles.data}
            {...form.getInputProps("role")}
            disabled
          />

          <Select
            label="Merchant"
            placeholder="Select merchant"
            data={merchants.data}
            {...form.getInputProps("merchant")}
          />
        </SimpleGrid>

        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            loading={updateMutation.isLoading}
            disabled={!form.isDirty()}
          >
            Update
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
