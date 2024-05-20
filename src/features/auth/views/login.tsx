import { useRef, useState } from "react";
import { Center, Flex, Image } from "@mantine/core";
import { Carousel, type Embla } from "@mantine/carousel";
import { useCountdown } from "usehooks-ts";
import VerificationCode from "../templates/verification-code";
import LoginForm from "../templates/login-form";
import LangAffix from "../components/lang-affix";
import type { AuthResponse, User } from "../types";

export default function Login(): React.ReactElement {
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",
  });

  const pinInputRef = useRef<HTMLInputElement>(null);

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  });

  const onLoginSuccess = (res: AuthResponse): void => {
    setToken(res.token);
    setUser(res.user);
  };

  return (
    <Flex h="100vh">
      <LangAffix />

      <Center className="flex-1" bg="#F8FBF5">
        <Image src="/greenhaven.png" alt="Logo" w={250} h={250} m="auto" />
      </Center>

      <Center className="flex-1">
        <Carousel
          getEmblaApi={setEmbla}
          draggable={false}
          withControls={false}
          withKeyboardEvents={false}
          slideGap="xl"
          w={300}
          onSlideChange={(index) => {
            if (index === 1) {
              startCountdown();

              setTimeout(() => {
                pinInputRef.current?.focus();
              }, 500);
            }
          }}
        >
          <Carousel.Slide>
            <LoginForm embla={embla} onLoginSuccess={onLoginSuccess} />
          </Carousel.Slide>

          <Carousel.Slide>
            <VerificationCode
              embla={embla}
              token={token}
              user={user}
              count={count}
              pinInputRef={pinInputRef}
              resetCountdown={resetCountdown}
              startCountdown={startCountdown}
            />
          </Carousel.Slide>
        </Carousel>
      </Center>
    </Flex>
  );
}
