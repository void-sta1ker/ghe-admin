import { QueryClient } from "@tanstack/react-query";
import settings from "@/config/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: settings.staleTime,
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export default queryClient;
