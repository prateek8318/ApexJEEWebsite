import { fileTypeFromBlob } from "file-type";

export const urlToFile = async (url: string, name?: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${response.statusText}, Failed to fetch file!`);
    }
    const blob = await response.blob();
    const contentType = blob.type;
    const fileType = await fileTypeFromBlob(blob);
    const extension = fileType?.ext;
    const filename = extension
      ? `${name ?? "File"}.${extension}`
      : `${name ?? "File"}`;

    return new File([blob], filename, { type: contentType });
  } catch (error: unknown) {
    console.info(
      `Library: URL To File - ${(error as Error)?.message ?? "Internal server error!"}`,
    );
  }
};
