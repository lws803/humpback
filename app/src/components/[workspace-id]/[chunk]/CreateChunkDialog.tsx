"use client";

import { useParams } from "next/navigation";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createChunk } from "@/modules/[workspace-id]/chunks/actions";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(256, "Title must be less than 256 characters"),
  content: z.string().min(1, "Content is required"),
  source_url: z.string().url("Please enter a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateChunkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateChunkDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateChunkDialogProps) {
  const params = useParams();
  const workspaceId = params["workspace-id"] as string;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      source_url: "",
    },
  });

  const { isSubmitting } = form.formState;

  const { mutate: createPost } = useMutation({
    mutationFn: (values: FormValues) => createChunk(workspaceId, values),
    onSuccess: () => {
      toast.success("Post Created", {
        description: "Your post has been created successfully",
      });
      form.reset();
      onSuccess();
      onClose();
    },
    onError: (error) => {
      const message =
        error instanceof PostgrestError
          ? error.message
          : "Failed to create post";
      toast.error("Error", { description: message });
    },
  });

  function onSubmit(values: FormValues) {
    createPost(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Create a new post to share with your audience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter post title"
              disabled={isSubmitting}
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              className="h-32"
              disabled={isSubmitting}
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source_url">Source URL</Label>
            <Input
              id="source_url"
              placeholder="https://example.com"
              disabled={isSubmitting}
              {...form.register("source_url")}
            />
            {form.formState.errors.source_url && (
              <p className="text-sm text-destructive">
                {form.formState.errors.source_url.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
