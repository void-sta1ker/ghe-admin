import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import clsx from "clsx";
import { useAuthContext, useLangContext } from "@/contexts";
import { colors } from "@/config/theme";
import getTopSection from "@/helpers/get-top-section";
import queryClient from "@/utils/query-client";
import type { AppLang, CustomRoute } from "@/types";

interface DefaultLayoutState {
  lang: AppLang;
  handleLangChange: (value: AppLang) => void;
  onLogout: () => void;
  modalOpened: boolean;
  openModal: () => void;
  closeModal: () => void;
  items: Array<{
    key: string;
    label: JSX.Element;
    isActive: boolean;
    onClick: () => void;
  }>;
}

export default function useDefaultLayoutState(
  sidebarRoutes: CustomRoute[],
): DefaultLayoutState {
  const navigate = useNavigate();

  const { lang, changeLang: handleLangChange } = useLangContext();

  const { pathname } = useLocation();

  const { setIsAuth } = useAuthContext();

  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const topSection = getTopSection(pathname).at(-1);

  const items = useMemo(() => {
    const routes = sidebarRoutes.map(({ path, title, Icon }) => ({
      key: path as string,
      label: (
        <Group className={clsx("h-full gap-6")}>
          {typeof Icon !== "undefined" ? <Icon fontSize={20} /> : null}
          {title ?? ""}
        </Group>
      ),
      isActive: path === topSection,
      onClick: () => {
        navigate(path as string);
      },
    }));

    return routes.slice(0, -1);
  }, [sidebarRoutes, topSection, navigate]);

  const onLogout = (): void => {
    closeModal();
    localStorage.clear();
    queryClient.clear();
    setIsAuth(false);
  };

  return {
    items,
    lang,
    handleLangChange,
    onLogout,
    modalOpened,
    openModal,
    closeModal,
  };
}
