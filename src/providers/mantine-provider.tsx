// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

interface Props {
  children: React.ReactElement;
}

const theme = createTheme({
  primaryColor: "green",
  fontFamily: "Roboto, sans-serif",
});

export default function ThemeProvider(props: Props): React.ReactElement {
  const { children } = props;

  return (
    <MantineProvider theme={theme}>
      <Notifications />

      {children}
    </MantineProvider>
  );
}
