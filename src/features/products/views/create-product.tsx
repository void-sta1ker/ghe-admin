import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ActionIcon,
  Button,
  ColorInput,
  Group,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePickerInput as DatePicker } from "@mantine/dates";
import {
  Dropzone,
  type FileRejection,
  type FileWithPath,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { HiOutlinePlus } from "react-icons/hi2";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sift } from "radash";
import { getBrands } from "@/features/brands";
import queryClient from "@/utils/query-client";
import createFileFromUrl from "@/helpers/create-file-from-url";
import formToFormData from "@/helpers/form-to-formdata";
import DropzoneBody from "@/components/dropzone-body";
import dataToForm from "../helpers/data-to-form";
import { initialValues, validate, fileMap } from "../data";
import { createProduct, getProduct, updateProduct } from "../api";
import type { ProductData } from "../types";

export default function CreateProduct(): React.ReactElement {
  const { productId = "" } = useParams();

  const navigate = useNavigate();

  const [images, setImages] = useState<string[]>([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const openRef = useRef<() => void>(null);

  const product = useQuery({
    queryKey: ["products", productId],
    queryFn: async () => {
      const res = await getProduct(productId);
      return res;
    },
    enabled: Boolean(productId),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await getBrands();
      return res;
    },
    select(data) {
      return data.results.map(({ id, name }) => ({ value: id, label: name }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const res = await updateProduct(id, data);
      return res;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(["products"]);
      navigate("/products");

      notifications.show({
        title: "Success",
        message: "Product updated successfully!",
        color: "green",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries(["products"]);
      navigate("/products");

      notifications.show({
        title: "Success",
        message: "Product created successfully!",
        color: "green",
      });
    },
  });

  const form = useForm({ initialValues, validate });

  const onImgDelete = (img: string): void => {
    form.setFieldValue("images", [
      ...form.values.images.filter((i) => i !== fileMap.get(img)),
    ]);

    URL.revokeObjectURL(img);
    fileMap.delete(img);

    setImages(images.filter((i) => i !== img));
  };

  const onImgPreview = (img: string): void => {
    console.log(img);
  };

  const onDrop = (files: FileWithPath[]): void => {
    console.log("accepted files", files);
    form.setFieldValue("images", [...form.values.images, ...files]);

    const urls = files.map((file) => {
      const url = URL.createObjectURL(file);
      fileMap.set(url, file);
      return url;
    });

    setImages((prev) => [...prev, ...urls]);
  };

  const onReject = (files: FileRejection[]): void => {
    console.log("rejected files", files);
  };

  const onSubmit = form.onSubmit((values) => {
    const formData = formToFormData(values);

    if (productId !== "") {
      updateMutation.mutate({ id: productId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  });

  const onGoBack = (): void => {
    navigate(-1);
  };

  const initializeForm = async (productData: ProductData): Promise<void> => {
    const files = await Promise.all(
      productData.images.map(async (img) => {
        const file = await createFileFromUrl(img.imageUrl);

        typeof file !== "undefined" && fileMap.set(img.imageUrl, file);

        return file;
      }),
    );

    setImages(productData.images.map(({ imageUrl }) => imageUrl));

    const values = dataToForm(productData, sift(files));
    form.setValues(values);
    form.resetDirty(values);
  };

  useEffect(() => {
    if (productId !== "" && typeof product.data !== "undefined") {
      void initializeForm(product.data).then(() => {
        setIsOverlayVisible(false);
      });
    }

    if (productId === "") {
      setIsOverlayVisible(false);
    }
  }, [product.data, productId]);

  useEffect(() => {
    if (product.isError) {
      notifications.show({
        title: "Error",
        message: product.error?.data?.message ?? "Something went wrong",
        color: "red",
      });

      setIsOverlayVisible(false);
    }
  }, [product.isError]);

  console.log(form.values, fileMap.entries());

  return (
    <Stack gap="lg" pos="relative">
      <LoadingOverlay
        visible={isOverlayVisible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Group>
        <ActionIcon variant="light" color="dark" onClick={onGoBack}>
          <IoIosArrowBack />
        </ActionIcon>

        <Title>
          {productId === "" ? "Create product" : "Edit product details"}
        </Title>
      </Group>

      <form onSubmit={onSubmit}>
        <Dropzone
          openRef={openRef}
          activateOnClick={images.length === 0}
          onDrop={onDrop}
          onReject={onReject}
          maxSize={5 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          <DropzoneBody
            images={images}
            onImgPreview={onImgPreview}
            onImgDelete={onImgDelete}
            openRef={openRef}
          />
        </Dropzone>

        <SimpleGrid cols={3} mt="lg">
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Product name"
            {...form.getInputProps("name")}
          />

          <TextInput
            type="number"
            withAsterisk
            label="Quantity"
            placeholder="Enter quantity"
            {...form.getInputProps("quantity")}
          />

          <TextInput
            type="number"
            withAsterisk
            label="Price"
            placeholder="Enter price"
            {...form.getInputProps("price")}
          />

          <TextInput
            type="number"
            label="Discount price"
            placeholder="Enter price"
            {...form.getInputProps("discountedPrice")}
          />

          <DatePicker
            allowDeselect
            label="Discount start date"
            placeholder="Enter start date"
            {...form.getInputProps("discountStart")}
          />

          <DatePicker
            allowDeselect
            label="Discount end date"
            placeholder="Enter end date"
            {...form.getInputProps("discountEnd")}
          />

          <TextInput
            withAsterisk
            label="SKU"
            placeholder="Enter SKU"
            {...form.getInputProps("sku")}
          />

          <TextInput
            type="number"
            withAsterisk
            label="Barcode"
            placeholder="Enter barcode"
            {...form.getInputProps("barcode")}
          />

          <Select
            label="Brand"
            placeholder="Select"
            data={brands}
            clearable
            {...form.getInputProps("brand")}
          />

          {form.values.colors.slice(0, 1).map((color, index) => (
            <ColorInput
              key={color}
              swatches={swatches}
              swatchesPerRow={5}
              closeOnColorSwatchClick
              label={`Color ${index + 1}`}
              placeholder="Enter color"
              {...form.getInputProps(`colors.${index}`)}
              rightSection={
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    form.insertListItem("colors", "", index + 1);
                  }}
                >
                  <HiOutlinePlus />
                </ActionIcon>
              }
            />
          ))}

          {form.values.colors.slice(1).map((color, index) => (
            <ColorInput
              key={color}
              swatches={swatches}
              swatchesPerRow={5}
              closeOnColorSwatchClick
              label={`Color ${index + 2}`}
              placeholder="Enter color"
              {...form.getInputProps(`colors.${index + 1}`)}
              rightSection={
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    form.removeListItem("colors", index + 1);
                  }}
                >
                  <IoCloseOutline />
                </ActionIcon>
              }
            />
          ))}

          <Textarea
            withAsterisk
            label="Description"
            placeholder="Enter description"
            {...form.getInputProps("description")}
          />
        </SimpleGrid>

        <Switch
          mt="md"
          label="Status"
          classNames={{
            track: "cursor-pointer",
            label: "cursor-pointer",
          }}
          {...form.getInputProps("isActive", { type: "checkbox" })}
        />

        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            loading={createMutation.isLoading || updateMutation.isLoading}
            disabled={!form.isDirty()}
          >
            {productId !== "" ? "Update" : "Create"}
          </Button>
        </Group>
      </form>
    </Stack>
  );
}

const swatches = [
  "#2e2e2e",
  "#868e96",
  "#fa5252",
  "#e64980",
  "#be4bdb",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
];
