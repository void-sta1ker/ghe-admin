// Function to fetch image data from URL and create a File object
async function createFileFromUrl(url: string): Promise<File | undefined> {
  try {
    // Fetch image data from URL
    const response = await fetch(url, { method: "GET", redirect: "follow" });
    const blob = await response.blob();

    // Create a File object from the fetched data
    const filename = url.substring(url.lastIndexOf("/") + 1); // Extract filename from URL
    const file = new File([blob], filename, { type: blob.type });

    return file;
  } catch (error) {
    console.error("Error creating File object:", error);
    // return new File([], "error.png", { type: "image/png" });
    return undefined;
  }
}

export default createFileFromUrl;
