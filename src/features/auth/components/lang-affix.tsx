import { Affix, Image, Menu, UnstyledButton } from "@mantine/core";
import { useLangContext } from "@/contexts";

const langMap = {
  en: "/united-kingdom.png",
  ru: "/russia.png",
  uz: "/uzbekistan.png",
};

export default function LangAffix(): React.ReactElement {
  const { lang, changeLang } = useLangContext();

  return (
    <Affix position={{ top: 20, right: 20 }}>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <UnstyledButton variant="transparent" w="32px" h="32px">
            <Image src={langMap[lang]} alt="lang" />
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <Image src="/united-kingdom.png" alt="lang" w="32px" h="32px" />
            }
            onClick={() => {
              changeLang("en");
            }}
          >
            English
          </Menu.Item>
          <Menu.Item
            leftSection={
              <Image src="/russia.png" alt="lang" w="32px" h="32px" />
            }
            onClick={() => {
              changeLang("ru");
            }}
          >
            Русский
          </Menu.Item>
          <Menu.Item
            leftSection={
              <Image src="/uzbekistan.png" alt="lang" w="32px" h="32px" />
            }
            onClick={() => {
              changeLang("uz");
            }}
          >
            O&apos;zbekcha
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Affix>
  );
}
