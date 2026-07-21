"use client";
import { Dispatch, SetStateAction } from "react";
import { ImagePlus, Link2, Menu } from "lucide-react";
import { ScrollArea } from "@components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";


type ViewDialogProps = {
	openDialog: boolean;
	setOpenDialog: Dispatch<SetStateAction<boolean>>;
	record: ConsentRecordType;
};
const ViewDialog = ({ openDialog, setOpenDialog, record }: ViewDialogProps) => {
	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog} aria-hidden={!openDialog}>
			<DialogContent onOpenAutoFocus={event => event.preventDefault()}>
				<DialogHeader>
					<DialogTitle>{"View Consent Record"}</DialogTitle>
					<DialogDescription>{"View consent record details"}</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-96 w-full">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{record?.consentId && (
							<div className="flex w-full gap-2">
								<Menu className="shrink-0 text-primary" size={20} />
								<div className="flex w-full flex-col">
									<h1 className="text-xs text-muted-foreground">Consent ID</h1>
									<p className="break-all text-sm font-medium">{record?.consentId}</p>
								</div>
							</div>
						)}
						{record?.purpose && (
							<div className="flex w-full gap-2">
								<Link2 className="shrink-0 text-primary" size={20} />
								<div className="flex w-full flex-col">
									<h1 className="text-xs text-muted-foreground">Purpose</h1>
									<p className="break-all text-sm font-medium">{record?.purpose}</p>
								</div>
							</div>
						)}
						{record?.platform && (
							<div className="flex w-full gap-2">
								<ImagePlus className="shrink-0 text-primary" size={20} />
								<div className="flex w-full flex-col">
									<h1 className="text-xs text-muted-foreground">Platform</h1>
									<p className="break-all text-sm font-medium">{record?.platform}</p>
								</div>
							</div>
						)}
						{record?.status && (
							<div className="flex w-full gap-2">
								<Menu className="shrink-0 text-primary" size={20} />
								<div className="flex w-full flex-col">
									<h1 className="text-xs text-muted-foreground">Status</h1>
									<p className="break-all text-sm font-medium">{record?.status}</p>
								</div>
							</div>
						)}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default ViewDialog;
