import "@/lib";

interface Props {
  children: React.ReactElement;
}

export default function PrototypeExtensionsProvider(
  props: Props,
): React.ReactElement {
  const { children } = props;

  return children;
}
