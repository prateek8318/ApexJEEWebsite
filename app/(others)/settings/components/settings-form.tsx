"use client";

import { z } from "zod";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userProfileApi } from "@/lib/api/user/profile";
import { UserProfile } from "@/types/user-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { toast } from "@/components/ui/toaster";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, User, CalendarIcon, Loader2 } from "lucide-react";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useSession from "@/stores/session";
import type { AxiosError } from "axios";

const SettingsSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  examTarget: z.enum(["jee_main", "jee_advanced", "neet"]).optional(),
  targetYear: z.coerce.number().min(2024, "Year must be 2024 or later").max(2035, "Year must be 2035 or earlier").optional(),
  examDate: z.date().optional().nullable(),
  prepStartDate: z.date().optional().nullable(),
  prepEndDate: z.date().optional().nullable(),
});

type SettingsFormValues = z.infer<typeof SettingsSchema>;

interface SettingsFormProps {
  initialData: UserProfile;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const queryClient = useQueryClient();
  const { session, setSession } = useSession();
  
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.profileImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsSchema as any),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      examTarget: initialData.examTarget,
      targetYear: initialData.targetYear,
      examDate: initialData.examDate ? new Date(initialData.examDate) : null,
      prepStartDate: initialData.prepStartDate ? new Date(initialData.prepStartDate) : null,
      prepEndDate: initialData.prepEndDate ? new Date(initialData.prepEndDate) : null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: SettingsFormValues) => {
      const formData = new FormData();
      
      // Append basic fields
      if (values.name !== initialData.name) formData.append("name", values.name);
      if (values.email !== initialData.email) formData.append("email", values.email);
      if (values.phone !== initialData.phone) formData.append("phone", values.phone);
      if (values.examTarget) formData.append("examTarget", values.examTarget);
      if (values.targetYear) formData.append("targetYear", values.targetYear.toString());
      if (values.examDate) formData.append("examDate", values.examDate.toISOString());
      if (values.prepStartDate) formData.append("prepStartDate", values.prepStartDate.toISOString());
      if (values.prepEndDate) formData.append("prepEndDate", values.prepEndDate.toISOString());
      
      // Append image
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      return userProfileApi.updateProfile(formData);
    },
    onSuccess: (response) => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      
      // Update session if basic info changed
      if (response.data) {
        setSession({
          ...session,
          name: response.data.name,
          email: response.data.email,
          avatarUrl: response.data.profileImage,
        });
      }
    },
    onError: (error: unknown) => {
      toast.error("Failed to update profile", {
        description:
          ((error as AxiosError)?.response?.data as any)?.message ||
          ((error as AxiosError)?.response?.data as string) ||
          "Internal server error",
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File is too large", { description: "Please select an image smaller than 2MB" });
        return;
      }
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: SettingsFormValues) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Profile Image Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-muted bg-muted">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10">
                <User className="h-10 w-10 text-primary" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Profile Picture</h3>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, or WebP. Max 2MB.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
              >
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload new
              </Button>
              {profileImageFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setProfileImageFile(null);
                    setImagePreview(initialData.profileImage || null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  disabled={isPending}
                >
                  Remove
                </Button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Basic Information</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <PhoneInput placeholder="Enter mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Target Exam Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Target Exam Details</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="examTarget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Target</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target exam" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="jee_main">JEE Main</SelectItem>
                      <SelectItem value="jee_advanced">JEE Advanced</SelectItem>
                      <SelectItem value="neet">NEET</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2027" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="examDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expected Exam Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Preparation Window */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Preparation Window</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="prepStartDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prepEndDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
