import {
  QueryProvider,
  AuthProvider,
  RouteProvider as Routes,
  LangProvider,
  MantineProvider,
  AntdProvider,
  PrototypeExtensionsProvider,
} from "./providers";

export default function App(): React.ReactElement {
  return (
    <PrototypeExtensionsProvider>
      <MantineProvider>
        <AntdProvider>
          <LangProvider>
            <QueryProvider>
              <AuthProvider>
                <Routes />
              </AuthProvider>
            </QueryProvider>
          </LangProvider>
        </AntdProvider>
      </MantineProvider>
    </PrototypeExtensionsProvider>
  );
}
