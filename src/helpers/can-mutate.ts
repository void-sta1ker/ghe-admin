import { sections } from "@/config/constants";

export default function canMutate(section: keyof typeof sections): boolean {
  const { role } = JSON.parse(localStorage.getItem("user") ?? '{role: ""}');

  return (
    sections[section].readonly.length === 0 ||
    !sections[section].readonly.includes(role)
  );
}
