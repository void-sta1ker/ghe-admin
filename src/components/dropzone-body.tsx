import { ActionIcon, Box, Group, Overlay, Text, rem } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IoImageOutline, IoClose, IoAddOutline } from "react-icons/io5";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import ImageCard from "../features/products/components/image-card";

interface Props {
  images: string[];
  onImgPreview: (img: string) => void;
  onImgDelete: (img: string) => void;
  openRef: React.RefObject<() => void>;
}

export default function DropzoneBody(props: Props): React.ReactElement {
  const { images, onImgPreview, onImgDelete, openRef } = props;

  const hasImages = images.length > 0;

  return (
    <>
      {!hasImages ? (
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <AiOutlineCloudUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-blue-6)",
              }}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IoClose
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-red-6)",
              }}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <Group>
              <IoImageOutline
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-dimmed)",
                }}
              />

              <Box>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attach as many files as you like, each file should not exceed
                  5mb
                </Text>
              </Box>
            </Group>
          </Dropzone.Idle>
        </Group>
      ) : null}

      {hasImages ? (
        <Group className="pointer-events-auto">
          {images.map((image) => (
            <ImageCard key={image} imageSrc={image}>
              {({ hovered }) =>
                hovered ? (
                  <Overlay
                    color="#000"
                    backgroundOpacity={0.5}
                    component={Group}
                    className="justify-center"
                  >
                    <ActionIcon
                      variant="white"
                      color="dark"
                      onClick={() => {
                        onImgPreview(image);
                      }}
                    >
                      <FaEye />
                    </ActionIcon>
                    <ActionIcon
                      variant="white"
                      color="red"
                      onClick={() => {
                        onImgDelete(image);
                      }}
                    >
                      <MdDelete />
                    </ActionIcon>
                  </Overlay>
                ) : null
              }
            </ImageCard>
          ))}

          <ActionIcon
            variant="light"
            color="gray"
            className="w-32 h-32"
            onClick={() => {
              openRef.current?.();
            }}
          >
            <IoAddOutline
              style={{
                width: rem(52),
                height: rem(52),
              }}
            />
          </ActionIcon>
        </Group>
      ) : null}
    </>
  );
}
