import { Outlet } from "react-router-dom";
import useMatchEither from "@/hooks/use-match-either";

interface Props {
  of: React.ReactElement;
  childPaths: string | string[];
}

export default function Container(props: Props): React.ReactElement {
  const { of, childPaths } = props;

  const match = useMatchEither(
    typeof childPaths === "string" ? [childPaths] : childPaths,
  );

  if (match) {
    return <Outlet />;
  }

  return of;
}
