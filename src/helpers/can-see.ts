import { sections } from "@/config/constants";

export default function canSee(section: keyof typeof sections): boolean {
  const { role } = JSON.parse(localStorage.getItem("user") ?? '{role: ""}');

  return (
    sections[section].access.length === 0 ||
    !sections[section].access.includes(role)
  );
}
