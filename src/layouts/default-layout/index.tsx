import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Button,
  Group,
  Image,
  Modal,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { PatternFormat } from "react-number-format";
import { TbLogout } from "react-icons/tb";
import UserProfile from "@/components/user-profile";
import type { User } from "@/features/auth";
import type { CustomRoute } from "@/types";
import useDefaultLayoutState from "./state";

interface Props {
  children: React.ReactElement;
  sidebarRoutes: CustomRoute[];
}

export default function DefaultLayout(props: Props): React.ReactElement {
  const { children, sidebarRoutes } = props;

  const {
    items,
    lang,
    handleLangChange,
    onLogout,
    modalOpened,
    openModal,
    closeModal,
  } = useDefaultLayoutState(sidebarRoutes);

  const [sidebarOpened, { toggle: toggleSidebar }] = useDisclosure();

  const isMobile = useMediaQuery("(max-width: 767px)") ?? false;

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") ??
      `{"id": "", "firstName": "", "lastName": "", "phoneNumber": "", "role": ""}`,
  ) as User;

  return (
    <AppShell
      header={{ height: 60, collapsed: !isMobile }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !sidebarOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={sidebarOpened} onClick={toggleSidebar} size="sm" />
          <Image src="/greenhaven-transparent.png" alt="brand logo" w={30} />
          <Text fw={500} size="17px">
            Admin Panel
            <img
              src="https://dilshod-me.netlify.app/icons/underline.svg"
              alt="underline"
              width={100}
            />
          </Text>
        </Group>
      </AppShell.Header>
      {/* bg="#f8fbf5" */}
      <AppShell.Navbar p="md">
        <AppShell.Section visibleFrom="sm">
          <Group gap={16} p={8}>
            <UnstyledButton
              onClick={() => {
                navigate("/");
              }}
            >
              <Image
                src="/greenhaven-transparent.png"
                alt="brand logo"
                w={30}
              />
            </UnstyledButton>
            <Text fw={500} size="17px">
              Admin Panel
              <img
                src="https://dilshod-me.netlify.app/icons/underline.svg"
                alt="underline"
                width={100}
              />
            </Text>
          </Group>
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          <Stack gap={8} py="sm" className="flex-1">
            {items.map((item) => (
              <NavLink
                key={item.key}
                className="rounded-md font-medium text-gray-700 data-[active=true]:text-green-600"
                classNames={{
                  label: "text-base",
                }}
                component="button"
                label={item.label}
                active={item.isActive}
                onClick={item.onClick}
              />
            ))}
          </Stack>
        </AppShell.Section>
        <AppShell.Section>
          <UserProfile
            fullName={`${user.firstName} ${user.lastName}`}
            phone={
              <PatternFormat
                format="+### ## ### ## ##"
                value={user.phoneNumber}
                displayType="text"
              />
            }
            extra={
              <ActionIcon
                variant="white"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal();
                }}
              >
                <TbLogout size={24} />
              </ActionIcon>
            }
            onClick={() => {
              navigate("/profile");
            }}
          />

          <Modal opened={modalOpened} onClose={closeModal} centered>
            <Stack align="center">
              <Text>Are you sure want to log out?</Text>
              <Group>
                <Button variant="subtle" color="red" onClick={closeModal}>
                  No
                </Button>
                <Button variant="subtle" onClick={onLogout}>
                  Yes
                </Button>
              </Group>
            </Stack>
          </Modal>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Box px="md">{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
