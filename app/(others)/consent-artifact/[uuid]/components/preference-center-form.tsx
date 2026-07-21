"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Languages, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Badge } from "@components/ui/badge";
import { Form, FormField, FormItem, FormMessage } from "@components/ui/form";
import { consentPreferences } from "@data/my-consent";
import {
  UserPreferenceSelectionSchema,
  type UserPreferenceSelectionValues,
} from "@schemas/preferenceCenter";

const PreferenceCenterForm = () => {
  const router = useRouter();

  // tracks dismissed (non-required) PII tags per preference: { prefId: Set<label> }
  const [dismissedPii, setDismissedPii] = useState<Record<string, Set<string>>>(
    {},
  );

  const form = useForm<UserPreferenceSelectionValues>({
    defaultValues: { selectedConsents: [] },
    mode: "onTouched",
    resolver: zodResolver(UserPreferenceSelectionSchema),
  });

  const selectedConsents = form.watch("selectedConsents");

  const toggleConsent = (id: string) => {
    const current = form.getValues("selectedConsents");
    const updated = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    form.setValue("selectedConsents", updated, { shouldValidate: true });
  };

  const dismissPii = (prefId: string, label: string) => {
    setDismissedPii((prev) => {
      const existing = new Set(prev[prefId]);
      existing.add(label);
      return { ...prev, [prefId]: existing };
    });
  };

  const onSubmit = (_data: UserPreferenceSelectionValues) => {
    // TODO: add API call here
    toast.success("Preferences saved successfully.");
  };

  return (
    <div className="w-full bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex h-10 w-16 items-center justify-center rounded-md border border-border bg-muted text-xs font-semibold text-muted-foreground">
            LOGO
          </div>
          <h2 className="text-base font-semibold text-foreground">Preference Center</h2>
        </div>
        <Languages className="h-6 w-6 text-primary" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-8 py-8 space-y-8">
            {/* Heading & description */}
            <div className="flex flex-col gap-2 max-w-3xl">
              <h1 className="text-2xl font-bold text-foreground">User Preference Center</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Manage your data consent preferences below. Select the purposes for which you agree
                to share your personal information. You may update your choices at any time and your
                preferences will be saved accordingly.
              </p>
            </div>

            {/* Preference list */}
            <FormField
              control={form.control}
              name="selectedConsents"
              render={() => (
                <FormItem>
                  <div className="rounded-xl border border-border divide-y divide-border">
                    {consentPreferences.map((pref) => {
                      const isChecked = selectedConsents?.includes(pref.id);
                      return (
                        <div
                          key={pref.id}
                          className="flex gap-4 px-6 py-5 hover:bg-muted/40 transition-colors"
                        >
                          <Checkbox
                            id={pref.id}
                            checked={isChecked}
                            onCheckedChange={() => toggleConsent(pref.id)}
                            className="mt-1 shrink-0"
                          />
                          <div className="space-y-2 flex-1">
                            <label
                              htmlFor={pref.id}
                              className="text-sm font-semibold text-foreground cursor-pointer"
                            >
                              {pref.title}
                            </label>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {pref.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-xs font-medium text-muted-foreground">
                                PII :
                              </span>
                              {pref?.pii
                                ?.filter(
                                  (tag) =>
                                    tag?.required ||
                                    !dismissedPii[pref.id]?.has(tag?.label),
                                )
                                .map((tag) =>
                                  tag?.required ? (
                                    <Badge
                                      key={tag.label}
                                      variant="outline"
                                      className="text-xs px-2.5 py-0.5 rounded-full text-muted-foreground"
                                    >
                                      {tag.label}
                                    </Badge>
                                  ) : (
                                    <Badge
                                      key={tag.label}
                                      variant="outline"
                                      className="text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 text-primary border-primary"
                                    >
                                      {tag.label}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          dismissPii(pref.id, tag.label)
                                        }
                                        className="ml-0.5 hover:text-destructive transition-colors"
                                        aria-label={`Remove ${tag.label}`}
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ),
                                )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-border bg-muted/20">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Save Preferences</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PreferenceCenterForm;
