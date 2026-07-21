"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@components/ui/button";
import ViewDialog from "./view-dialog";

type OptionsProps = {
  record: ConsentRecordType;
};

const Options = ({ record }: OptionsProps) => {
  const [openViewDialog, setOpenViewDialog] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-primary"
          onClick={() => setOpenViewDialog(true)}
        >
          <Eye size={18} />
        </Button>
      </div>

      <ViewDialog
        openDialog={openViewDialog}
        setOpenDialog={setOpenViewDialog}
        record={record}
      />
    </>
  );
};

export default Options;
