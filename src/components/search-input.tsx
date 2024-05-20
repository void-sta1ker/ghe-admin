import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Box,
  Group,
  LoadingOverlay,
  Menu,
  Text,
  TextInput,
} from "@mantine/core";
import {
  useClickOutside,
  useDebouncedValue,
  useInputState,
} from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { get } from "radash";
import { FiSearch } from "react-icons/fi";
import type { BaseEntity, ListResponse } from "@/types";
import LazyImage from "./lazy-image";

interface Props {
  onSearch: (text: string) => void;
  fetcher: ({
    search,
  }: {
    search: string;
  }) => Promise<ListResponse<BaseEntity>>;
  queryKey: string;
  imageAccessor?: string;
  nameAccessor?: string;
}

export default function SearchInput(props: Props): React.ReactElement {
  const {
    onSearch,
    queryKey,
    fetcher,
    imageAccessor = "",
    nameAccessor = "",
  } = props;

  const navigate = useNavigate();

  const [search, setSearch] = useInputState("");

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [opened, setOpened] = useState(false);

  const ref = useClickOutside(() => {
    setOpened(false);
  });

  const products = useQuery({
    queryKey: [queryKey, "search-list", debouncedSearch],
    queryFn: async () => {
      const res = await fetcher({
        search: debouncedSearch,
      });
      return res;
    },
    select(data) {
      return data.results;
    },
    enabled: Boolean(debouncedSearch.trim()),
  });

  console.log(products.data);

  const entityData = (products.data ?? []).slice(0, 5);

  useEffect(() => {
    setOpened(Boolean(debouncedSearch.trim()));
  }, [debouncedSearch]);

  return (
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
          value={search}
          onChange={setSearch}
          placeholder="Search"
          onFocus={() => {
            if (!opened && entityData.length > 0) {
              setOpened(true);
            }
          }}
          onClick={() => {
            if (!opened && entityData.length > 0) {
              setOpened(true);
            }
          }}
          rightSection={
            <ActionIcon
              variant="transparent"
              color="gray"
              className="hover:text-[#40C057]"
              onClick={() => {
                onSearch(search);
              }}
            >
              <FiSearch />
            </ActionIcon>
          }
        />
      </Menu.Target>

      <Menu.Dropdown ref={ref}>
        <Box pos="relative" mih={200}>
          <LoadingOverlay
            visible={products.isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          {entityData.map((entity) => {
            const hasImage = imageAccessor.length > 0;
            const imageSrc = get(entity, imageAccessor, "") as string;

            const hasName = nameAccessor.length > 0;
            const entityName = get(entity, nameAccessor, "") as string;

            return (
              <Menu.Item
                key={entity.id}
                onClick={() => {
                  navigate(`${entity.id}`);
                  setOpened(false);
                }}
              >
                <Group>
                  {typeof imageSrc === "string" && hasImage && (
                    <LazyImage
                      src={imageSrc}
                      fit="contain"
                      alt="entity"
                      h={32}
                    />
                  )}

                  <Text size="sm" flex={1}>
                    {hasName ? entityName : entity.name}
                  </Text>
                </Group>
              </Menu.Item>
            );
          })}

          {entityData.length === 0 && (
            <Menu.Item>
              <Text c="dimmed">No results</Text>
            </Menu.Item>
          )}
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
}

SearchInput.defaultProps = {
  imageAccessor: "",
  nameAccessor: "",
};
