"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchApiKeys } from "@/modules/[workspace-id]/api-keys/actions";
import Row from "@/components/[workspace-id]/[api-key]/Row";
import { CreateKeyDialog } from "@/components/[workspace-id]/[api-key]/CreateKeyDialog";

export default function ApiKeysPage() {
  const params = useParams();
  const workspaceId = params["workspace-id"] as string;
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const {
    data: apiKeys = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [fetchApiKeys.key, workspaceId],
    queryFn: () => fetchApiKeys(workspaceId),
  });

  return (
    <div className="container mx-auto py-10">
      <CreateKeyDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={refetch}
      />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground mt-2">
            Manage your API keys to access the Humpback search API. Keep your
            API keys secure and never share them publicly.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => setShowCreateDialog(true)}
            disabled={isLoading}
          >
            <Plus />
            Create new key
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Name</TableHead>
                <TableHead className="w-[50%]">API Key</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <Row key={key.id} apiKey={key} onDelete={refetch} />
              ))}
              {apiKeys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No API keys found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
