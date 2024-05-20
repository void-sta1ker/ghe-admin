import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "@/utils/query-client";

interface Props {
  children: React.ReactElement;
}

export default function QueryProvider(props: Props): React.ReactElement {
  const { children } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      {children}
    </QueryClientProvider>
  );
}
