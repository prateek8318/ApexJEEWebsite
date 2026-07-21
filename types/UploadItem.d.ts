type UploadItem = {
  uuid: string;
  error?: string;
  file: File;
  progress: number;
  status: "UPLOADING" | "COMPLETED" | "ERROR" | "STOPPED";
  uploadUrl: string;
};
