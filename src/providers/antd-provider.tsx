import { ConfigProvider, App, type ThemeConfig } from "antd";

interface Props {
  children: React.ReactElement;
}

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#40c057",
  },
};

export default function AntdProvider(props: Props): React.ReactElement {
  const { children } = props;

  return (
    <App>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </App>
  );
}
