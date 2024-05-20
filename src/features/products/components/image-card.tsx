import { useState } from "react";
import { Card, Image } from "@mantine/core";

interface Props {
  imageSrc: string;
  children?:
    | React.ReactElement
    | ((states: CardStates) => React.ReactElement | null);
}

interface CardStates {
  hovered: boolean;
}

export default function ImageCard(props: Props): React.ReactElement {
  const { imageSrc, children } = props;

  const [hovered, setHovered] = useState(false);

  return (
    <Card
      key={imageSrc}
      bg="gray.1"
      h={128}
      w={128}
      className="flex items-center justify-center"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      {typeof children === "function" ? children({ hovered }) : children}
      <Image src={imageSrc} alt="product" h={96} fit="contain" />
    </Card>
  );
}

ImageCard.defaultProps = {
  children: null,
};
