import { Avatar } from "@mantine/core";
import clsx from "clsx";

interface Props {
  img?: string;
  fullName: string;
  phone: React.ReactNode;
  extra?: React.ReactElement;
  className?: string;
  mainClassName?: string;
  fullNameClassName?: string;
  emailClassName?: string;
  long?: boolean;
  onClick?: () => void;
}

export default function UserProfile(props: Props): React.ReactElement {
  const {
    img,
    fullName,
    phone,
    extra,
    className,
    mainClassName,
    fullNameClassName,
    emailClassName,
    long,
    onClick,
  } = props;

  return (
    <div
      className={clsx(
        "flex items-center",
        typeof onClick === "function" ? "cursor-pointer" : "",
        (long as boolean) ? "justify-between" : "",
        className,
      )}
      onClick={onClick}
      aria-hidden
    >
      <div className={clsx("flex items-center gap-2", mainClassName)}>
        <Avatar src={img} alt="avatar" color="green" />

        {(long as boolean) ? (
          <div className="flex flex-col">
            <span
              className={clsx(
                "text-gray-700 text-sm font-semibold",
                fullNameClassName,
              )}
            >
              {fullName}
            </span>
            <span className={clsx("text-gray-500 text-sm", emailClassName)}>
              {phone}
            </span>
          </div>
        ) : null}
      </div>

      {(long as boolean) ? extra : null}
    </div>
  );
}

UserProfile.defaultProps = {
  img: "",
  extra: <span />,
  className: "",
  mainClassName: "",
  fullNameClassName: "",
  emailClassName: "",
  long: true,
  onClick: () => {
    //
  },
};
