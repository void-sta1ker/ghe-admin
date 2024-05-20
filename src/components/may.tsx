import { actions, sections } from "@/config/constants";
import useTopPath from "@/hooks/use-top-path";

interface Props {
  I: string;
  children: React.ReactElement;
}

export default function May(props: Props): React.ReactElement | null {
  const { children, I: action } = props;

  const { role } = JSON.parse(localStorage.getItem("user") ?? '{role: ""}') as {
    role: string;
  };

  const path = useTopPath();

  if (path in sections) {
    const section = sections[path as keyof typeof sections];
    const allowed = section.access.includes(role);

    if (allowed) {
      if (section.readonly.includes(role) && action !== actions.read) {
        return null;
      }

      return children;
    }
  }

  return null;
}
