import { ColorSwatch, Group, Text } from "@mantine/core";

interface Props {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export default function InfoLine(props: Props): React.ReactElement {
  const { status, count, percentage, color } = props;

  return (
    <Group justify="between">
      <Group gap="6px" flex={1}>
        <ColorSwatch color={color} size="16px" />

        <Text size="sm">{status}</Text>
      </Group>

      <Group gap="4px">
        <Text>{count}</Text>

        <Text size="sm" c="dimmed">
          ({percentage}%)
        </Text>
      </Group>
    </Group>
  );
}
