import { ActionIcon, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MdDelete } from "react-icons/md";

interface ModalProps {
  opened: boolean;
  open: () => void;
  close: () => void;
}

interface Props {
  onDeleteClick?: () => void;
  onCancel?: () => void;
  onDeleteConfirm: (modalProps: ModalProps) => void;
  renderButton?: (modalProps: ModalProps) => React.ReactElement | null;
}

export default function ConfirmDelete(props: Props): React.ReactElement {
  const { onDeleteClick, onCancel, onDeleteConfirm, renderButton } = props;

  const [opened, { open, close }] = useDisclosure(false);

  const onClose = (): void => {
    onCancel?.();
    close();
  };

  return (
    <>
      {typeof renderButton === "function" ? (
        renderButton({ opened, open, close })
      ) : (
        <ActionIcon
          variant="light"
          color="red"
          onClick={() => {
            onDeleteClick?.();
            open();
          }}
        >
          <MdDelete />
        </ActionIcon>
      )}

      <Modal centered opened={opened} onClose={onClose}>
        <Stack align="center">
          <Text>Are you sure want to delete this product?</Text>
          <Group>
            <Button variant="subtle" onClick={onClose}>
              No
            </Button>

            <Button
              variant="subtle"
              color="red"
              onClick={() => {
                onDeleteConfirm({ opened, open, close });
              }}
            >
              Yes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

ConfirmDelete.defaultProps = {
  onDeleteClick: () => {
    //
  },
  onCancel: () => {
    //
  },
  renderButton: null,
};
