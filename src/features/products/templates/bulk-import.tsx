import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { isObject } from "radash";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Modal, JsonInput, Button, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import queryClient from "@/utils/query-client";
import formToFormData from "@/helpers/form-to-formdata";
import type { AxiosResponse } from "axios";
import { createProduct } from "../api";
import type { ProductData } from "../types";
import isProductShape from "../helpers/is-product-shape";

export default function BulkImport(): React.ReactElement {
  const [opened, { open, close }] = useDisclosure(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const placeHolderFlag = useRef(false);

  const importMutation = useMutation({
    mutationFn: async (products: ProductData[]) => {
      const responses = await Promise.all(
        products.map(async (product) => {
          const res = await createProduct(formToFormData(product));
          return res;
        }),
      );

      return responses;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(["products"]);

      close();

      notifications.show({
        title: "Success",
        message: "Products imported successfully!",
        color: "green",
      });
    },
    onError(error: AxiosResponse, variables, context) {
      console.log(error, variables, context);

      notifications.show({
        title: "Error",
        message: error.data.message,
        color: "red",
      });
    },
  });

  const form = useForm({
    initialValues: {
      products: "",
    },
    validate: {
      products: (value) => {
        try {
          const products = JSON.parse(value);

          if (!Array.isArray(products)) {
            return "Invalid JSON, must be an array";
          }

          if (products.length === 0) {
            return "Invalid JSON, must contain at least one product";
          }

          if (!products.every(isObject)) {
            return "Invalid JSON, must contain only objects";
          }

          if (!products.every(isProductShape)) {
            return "Invalid JSON, must contain only valid products";
          }
        } catch (err) {
          return "Invalid JSON";
        }

        return null;
      },
    },
  });

  const onSubmit = form.onSubmit((values) => {
    console.log(values);
    importMutation.mutate(JSON.parse(values.products));
  });

  useEffect(() => {
    if (inputRef.current !== null && !placeHolderFlag.current) {
      placeHolderFlag.current = true;

      inputRef.current.placeholder =
        '[\n {\n  "name": "",\n  "description": "",\n  "sku": "",\n  "barcode": "",\n  "quantity": "",\n  "price": "",\n  "brand": "",\n  "images": [],\n  "isActive": true,\n }\n]';
    }
  });

  return (
    <>
      <Button variant="outline" onClick={open}>
        Bulk import
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Bulk import"
        centered
        keepMounted
      >
        <Stack component="form" onSubmit={onSubmit}>
          <JsonInput
            ref={inputRef}
            label="Products.json"
            // fuck jsx
            // placeholder='{
            //   "name": "",
            //   "description": "",
            //   "sku": "",
            //   "barcode": "",
            //   "quantity": "",
            //   "price": "",
            //   "brand": "",
            //   "images": [],
            //   "isActive": true,
            // }'
            validationError="Invalid JSON"
            formatOnBlur
            autosize
            minRows={13}
            maxRows={16}
            {...form.getInputProps("products")}
          />

          <Group justify="end">
            <Button variant="light" color="red" onClick={close}>
              Cancel
            </Button>

            <Button
              variant="light"
              type="submit"
              loading={importMutation.isLoading}
            >
              Import
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
