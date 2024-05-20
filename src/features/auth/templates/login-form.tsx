import { useEffect } from "react";
import {
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type { Embla } from "@mantine/carousel";
import { useMutation } from "@tanstack/react-query";
import { isNumber } from "radash";
import { PatternFormat } from "react-number-format";
import type { AxiosResponse } from "axios";
import useAuthStore from "../hooks/auth-store";
import { login } from "../api";
import type { AuthResponse } from "../types";

interface Props {
  embla: Embla | null;
  onLoginSuccess: (res: AuthResponse) => void;
}

export default function LoginForm(props: Props): React.ReactElement {
  const { embla, onLoginSuccess } = props;

  const { setResendCode } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (res) => {
      onLoginSuccess(res);
      embla?.scrollNext();
    },
    onError: (res: AxiosResponse) => {
      if (isNumber(res.status) && res.status > 0) {
        notifications.show({
          title: "Error",
          message: res.data?.message,
          color: "red",
        });
      }
    },
  });

  const form = useForm({
    initialValues: {
      phoneNumber: "",
      password: "",
    },

    validate: {
      phoneNumber: (value) => {
        if (value.trim() === "") {
          return "This field cannot be empty";
        }
        return null;
      },
      password: (value) => {
        if (value.trim() === "") {
          return "This field cannot be empty";
        }
        return null;
      },
    },
  });

  const onSubmit = form.onSubmit((values) => {
    loginMutation.mutate({
      ...values,
      phoneNumber: values.phoneNumber.replace(/\D/g, ""),
    });
  });

  useEffect(() => {
    setResendCode(() => {
      loginMutation.mutate({
        ...form.values,
        phoneNumber: form.values.phoneNumber.replace(/\D/g, ""),
      });
    });
  }, [setResendCode, form.values]);

  return (
    <Stack
      // eslint-disable-next-line react/jsx-props-no-spreading
      renderRoot={(_props) => <form onSubmit={onSubmit} {..._props} />}
    >
      <Title ta="center">Admin Panel</Title>
      <Text ta="center" c="dimmed">
        Enter your credentials to login
      </Text>

      <PatternFormat
        customInput={TextInput}
        format="+998 ## ### ## ##"
        mask="_"
        label="Phone number"
        placeholder="+998"
        {...form.getInputProps("phoneNumber")}
      />

      <PasswordInput
        label="Password"
        placeholder="Enter password"
        {...form.getInputProps("password")}
      />

      <Button type="submit" loading={loginMutation.isLoading}>
        Next
      </Button>
    </Stack>
  );
}
