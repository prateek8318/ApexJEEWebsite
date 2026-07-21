"use client";
import { cn } from "@lib/utils";
import { toast } from "./toaster";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { formatBytes } from "@lib/formatBytes";
import { Ref, useEffect, useState } from "react";
import { Download, File, Upload, X } from "lucide-react";
import Dropzone, { DropzoneProps, FileRejection } from "react-dropzone";

interface FileInputProps extends Omit<DropzoneProps, "multiple"> {
  className?: string;
  onChange?: (files: File[]) => void;
  value?: File[];
}

const FileInput = ({
  ref,
  accept,
  disabled,
  maxFiles = 1,
  maxSize = 1024 * 1024 * 2,
  onChange,
  value,
  className,
  ...props
}: FileInputProps & {
  ref?: Ref<HTMLDivElement>;
}) => {
  const [files, setFiles] = useState<File[]>(value || []);

  const onDrop = async (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[],
  ) => {
    if (rejectedFiles.length > maxFiles) {
      toast.error("Error!", {
        description: `Cannot select more than ${maxFiles} ${maxFiles > 1 ? "files" : "file"}!`,
      });
      return;
    }
    if (files.length + acceptedFiles.length > maxFiles) {
      toast.error("Error!", {
        description: `Cannot select more than ${maxFiles} ${maxFiles > 1 ? "files" : "file"}!`,
      });
      return;
    }
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file }) => {
        toast.error("Error!", { description: `Cannot select ${file.name}!` });
      });
    }
    if (acceptedFiles.length > 0) {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      if (onChange) {
        await onChange(newFiles);
      }
    }
  };

  const onDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document?.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.download = file.name;
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const onRemove = async (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    if (onChange) {
      await onChange(newFiles);
    }
  };

  useEffect(() => {
    setFiles(value || []);
  }, [value]);

  return (
    <div
      className="has-focus:ring-ring relative flex flex-col gap-1 overflow-hidden rounded-xl outline-hidden has-focus:ring-2 has-focus:ring-offset-2"
      ref={ref}
    >
      <Dropzone
        accept={accept}
        disabled={disabled}
        maxFiles={maxFiles}
        maxSize={maxSize}
        multiple={maxFiles > 1}
        onDrop={onDrop}
        {...props}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            className={cn(
              "border-border bg-input flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border px-3 py-2 text-center outline-hidden",
              disabled && "cursor-not-allowed opacity-50",
              className,
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Upload aria-hidden="true" size={32} />
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <h1 className="text-foreground text-sm font-medium">
                {isDragActive
                  ? `Drop your ${maxFiles > 1 ? "files" : "file"} here`
                  : `Drop your ${maxFiles > 1 ? "files" : "file"} here or click to select your ${maxFiles > 1 ? "files" : "file"}`}
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm">
                You can upload{" "}
                {maxFiles > 1
                  ? `${maxFiles === Infinity ? "multiple" : maxFiles} files (up to ${formatBytes(maxSize)} each)`
                  : ` a file up to ${formatBytes(maxSize)}`}
              </p>
            </div>
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="h-fit w-full">
          <div className="max-h-40 space-y-4">
            {files?.map((file, index) => (
              <div
                className="bg-input flex w-full items-center justify-between gap-2 rounded-xl p-2"
                key={index}
              >
                <File size={36} strokeWidth={1} />
                <div className="flex w-full flex-col justify-center overflow-hidden">
                  <h4 className="text-foreground line-clamp-1 text-xs break-all">
                    {file.name}
                  </h4>
                  <p className="text-muted-foreground text-[10px] font-light">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <Button
                  className="size-8"
                  onClick={() => onDownload(file)}
                  size="icon"
                  variant="success"
                >
                  <Download size={16} />
                </Button>
                <Button
                  className="size-8"
                  onClick={() => onRemove(index)}
                  size="icon"
                  variant="destructive"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
};

FileInput.displayName = "FileInput";

export { FileInput };
