import { Flex, Loader } from "@mantine/core";

export default function Spinner(): React.ReactElement {
  return (
    <Flex pos="relative" h="90vh" align="center" justify="center">
      <Loader />
    </Flex>
  );
}
