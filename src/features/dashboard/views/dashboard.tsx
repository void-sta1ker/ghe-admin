import { useState } from "react";
import {
  Card,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { BarChart, DonutChart, LineChart } from "@mantine/charts";
import { DatePickerInput } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import { CiCalendar } from "react-icons/ci";
import CountUp from "react-countup";
import merge from "../helpers/merge";
import calcPercentage from "../helpers/calc-percentage";
import ProgressBar from "../components/progress-bar";
import InfoLine from "../components/info-line";
import {
  getCategoricalSales,
  getCustomerGrowth,
  getDashboardStatuses,
  getSummary,
  getTopProducts,
  getTotalSales,
} from "../api";
import {
  barData,
  customerData,
  donutData,
  initStatuses,
  salesData,
  segmentedData,
  statsData,
  statusTabs,
} from "../data";
import type { StatusProgress, Summary, StatusWColor } from "../types";

export default function Dashboard(): React.ReactElement {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  const summary = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
    placeholderData: { sales: 0, customers: 0, lowStock: 0, returns: 0 },
  });

  console.log(summary.data);

  const statuses = useQuery({
    queryKey: ["dashboard-statuses"],
    queryFn: getDashboardStatuses,
    placeholderData: { orders: [], reviews: [], merchants: [] },
  });

  console.log(statuses.data);

  const progressStatuses = Object.keys(statuses.data ?? {}).reduce(
    (acc: Partial<StatusProgress>, key) => {
      acc[key as keyof StatusProgress] = merge(
        initStatuses[key as keyof StatusProgress],
        statuses.data?.[key as keyof StatusProgress] ?? [],
        (m) => m.status,
      );

      return acc;
    },
    {},
  );

  console.log(progressStatuses);

  const topProducts = useQuery({
    queryKey: ["top-products"],
    queryFn: getTopProducts,
  });

  console.log(topProducts.data);

  const customerGrowth = useQuery({
    queryKey: ["customer-growth"],
    queryFn: getCustomerGrowth,
  });

  console.log(customerGrowth.data);

  const totalSales = useQuery({
    queryKey: ["total-sales"],
    queryFn: getTotalSales,
  });

  console.log(totalSales.data);

  const categoricalSales = useQuery({
    queryKey: ["categorical-sales"],
    queryFn: getCategoricalSales,
  });

  console.log(categoricalSales.data);

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <SegmentedControl data={segmentedData} defaultValue="month" />

        <DatePickerInput
          type="range"
          placeholder="Pick dates range"
          value={value}
          onChange={setValue}
          leftSection={<CiCalendar />}
          leftSectionPointerEvents="none"
          allowSingleDateInRange
          clearable
        />
      </Group>

      <SimpleGrid cols={2}>
        <Card withBorder p="lg">
          <Tabs defaultValue="orders">
            <Tabs.List>
              {statusTabs.map((tab) => (
                <Tabs.Tab
                  key={tab.key}
                  value={tab.key}
                  leftSection={<tab.icon />}
                >
                  {tab.title}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {statusTabs.map((tab) => (
              <Tabs.Panel key={tab.key} value={tab.key}>
                <ProgressBar
                  total={tab.progress.total(
                    progressStatuses[
                      tab.key as keyof StatusProgress
                    ] as StatusWColor[],
                  )}
                  statuses={(
                    progressStatuses[
                      tab.key as keyof StatusProgress
                    ] as StatusWColor[]
                  ).map(tab.progress.fragments)}
                />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Card>

        <SimpleGrid cols={4}>
          {statsData.map((entity) => (
            <Card
              key={entity.key}
              withBorder
              p="lg"
              component={Stack}
              justify="space-between"
            >
              <Stack>
                <Card bg={entity.color} className="self-start">
                  <entity.icon size={48} color="white" />
                </Card>

                <Text size="sm">{entity.title}</Text>
              </Stack>

              <CountUp
                end={summary?.data?.[entity.key as keyof Summary] ?? 0}
                duration={2}
                className={`text-2xl font-medium text-[--mantine-color-${entity.color}-6]`}
              />
            </Card>
          ))}
        </SimpleGrid>
      </SimpleGrid>

      <SimpleGrid cols={2}>
        <Card withBorder p="lg" component={Stack} gap="xl">
          <Title order={3}>Top selling products</Title>

          <BarChart
            h={300}
            data={barData}
            barProps={{ maxBarSize: 50 }}
            dataKey="month"
            type="stacked"
            series={[
              { name: "Laptops", color: "lime.6" },
              { name: "Smartphones", color: "violet.6" },
              { name: "Tablets", color: "cyan.6" },
            ]}
          />
        </Card>

        <Card withBorder p="lg" component={Stack} gap="xl">
          <Title order={3}>Customer growth</Title>

          <LineChart
            h={300}
            data={customerData}
            dataKey="date"
            series={[{ name: "Customers", color: "indigo.6" }]}
            curveType="linear"
            connectNulls
          />
        </Card>
      </SimpleGrid>

      <SimpleGrid cols={2}>
        <Card withBorder p="lg" component={Stack} gap="xl">
          <Title order={3}>Total sales</Title>

          <LineChart
            h={300}
            data={salesData}
            dataKey="date"
            yAxisProps={{ domain: [0, 100] }}
            referenceLines={[
              { y: 40, label: "Average sales", color: "red.6" },
              { x: "Mar", label: "Report out" },
            ]}
            series={[{ name: "Sales", color: "indigo.6" }]}
          />
        </Card>

        <Card withBorder p="lg" component={Stack} gap="xl">
          <Title order={3}>Categorical sales</Title>

          <Group justify="space-between" align="start" gap="xl">
            <DonutChart
              data={donutData}
              tooltipDataSource="segment"
              chartLabel="32"
              thickness={40}
              size={200}
            />

            <Stack flex={1}>
              {donutData.map((entity) => (
                <InfoLine
                  key={entity.name}
                  status={entity.name}
                  color={entity.color}
                  count={entity.value}
                  percentage={calcPercentage(
                    entity.value,
                    donutData.reduce((a, b) => a + b.value, 0),
                  )}
                />
              ))}
            </Stack>
          </Group>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
