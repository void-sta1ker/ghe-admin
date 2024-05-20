import {
  Button,
  Group,
  PinInput,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type { Embla } from "@mantine/carousel";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { AxiosResponse } from "axios";
import useAuthStore from "../hooks/auth-store";
import { checkPhone } from "../api";
import type { User } from "../types";

interface Props {
  embla: Embla | null;
  token: string;
  user: User;
  count: number;
  pinInputRef: React.RefObject<HTMLInputElement>;
  resetCountdown: () => void;
  startCountdown: () => void;
}

export default function VerificationCode(props: Props): React.ReactElement {
  const { token, user, count, pinInputRef, resetCountdown, startCountdown } =
    props;

  const { resendCode } = useAuthStore();

  const checkPhoneMutation = useMutation({
    mutationFn: checkPhone,
    onSuccess: (res) => {
      const { success } = res;

      if (success) {
        localStorage.setItem("access_token", token);
        // localStorage.setItem("refresh_token", res.refresh_token);
        localStorage.setItem("user", JSON.stringify({ ...user }));

        // setIsAuth(true);
        window.location.reload();
      }
    },
    onError: (res: AxiosResponse) => {
      console.error(res);

      notifications.show({
        title: "Error",
        message: res.data?.message,
        color: "red",
      });
    },
  });

  const form = useForm({
    initialValues: {
      code: "",
    },
    validate: {
      code: (value) => (value.length < 6 ? "Invalid code" : null),
    },
  });

  const onSubmit = form.onSubmit((values) => {
    checkPhoneMutation.mutate({
      token,
      phoneNumber: user.phoneNumber.replace(/\D/g, ""),
      otp: values.code,
    });
  });

  const onResend = (): void => {
    resendCode();
    resetCountdown();
    startCountdown();
  };

  return (
    <Stack
      // eslint-disable-next-line react/jsx-props-no-spreading
      renderRoot={(_props) => <form onSubmit={onSubmit} {..._props} />}
    >
      <Title ta="center">Verification code</Title>
      <Text ta="center" c="dimmed">
        Please enter a 6-digit code we sent to you at +1****0455
      </Text>

      <PinInput
        ref={pinInputRef}
        length={6}
        placeholder="0"
        type="number"
        oneTimeCode
        mask
        {...form.getInputProps("code")}
      />

      <Group align="baseline" justify="space-between">
        <Group gap="4px" align="baseline">
          <Text size="14px" fw={500} c="dimmed">
            Resend code in
          </Text>

          <Text c="blue">
            {dayjs().startOf("day").second(count).format("mm:ss")}
          </Text>
        </Group>

        {count === 0 && (
          <UnstyledButton
            c="blue"
            className="hover:underline"
            onClick={onResend}
          >
            Resend
          </UnstyledButton>
        )}
      </Group>

      <Button type="submit" loading={checkPhoneMutation.isLoading}>
        Login
      </Button>
    </Stack>
  );
}
