import { isEmpty } from "ramda";

function formToFormData(values: Record<string, unknown>): FormData {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (!isEmpty(item)) {
          formData.append(key, item);
        }
      });
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    formData.append(key, value?.toString() ?? "");
  });

  // for (const [key, value] of Object.entries(values)) {
  //   if (Array.isArray(value)) {
  //     for (const item of value) {
  //       formData.append(`${key}[]`, item);
  //     }
  //   }

  //   if (typeof value === "object") {
  //     for (const [subKey, subValue] of Object.entries(value)) {
  //       formData.append(`${key}[${subKey}]`, subValue);
  //     }
  //   }

  //   if (typeof value === "boolean") {
  //     formData.append(key, value ? "1" : "0");
  //   }

  //   if (typeof value === "number") {
  //     formData.append(key, value.toString());
  //   }

  //   formData.append(key, value);

  //   if (typeof value === "string") {
  //     formData.append(key, value);
  //   }

  //   if (typeof value === "undefined") {
  //     formData.append(key, "");
  //   }

  //   if (value === null) {
  //     formData.append(key, "");
  //   }

  //   if (value === "") {
  //     formData.append(key, "");
  //   }
  // }

  return formData;
}

export default formToFormData;
