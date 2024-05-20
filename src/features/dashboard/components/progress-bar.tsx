import { Progress, SimpleGrid, Stack } from "@mantine/core";
import calcPercentage from "../helpers/calc-percentage";
import InfoLine from "./info-line";

interface Props {
  total: number;
  statuses: Array<{ label: string; count: number; color: string }>;
}

export default function ProgressBar(props: Props): React.ReactElement {
  const { total, statuses } = props;

  return (
    <Stack pt="lg">
      <Progress.Root size="xl">
        {statuses.map((status) => (
          <Progress.Section
            key={status.label}
            value={calcPercentage(status.count, total)}
            color={status.color}
          >
            {/* <Progress.Label>{status.label}</Progress.Label> */}
          </Progress.Section>
        ))}
      </Progress.Root>

      <SimpleGrid cols={1}>
        {statuses.map((status) => (
          <InfoLine
            key={status.label}
            status={status.label}
            count={status.count}
            percentage={calcPercentage(status.count, total)}
            color={`var(--mantine-color-${status.color}-6)`}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
