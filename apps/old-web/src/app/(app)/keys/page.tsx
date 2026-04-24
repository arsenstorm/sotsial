// Components

// Utils
import { format } from "date-fns";
import { headers } from "next/headers";
// React
import { Suspense } from "react";
// Better Auth
import { auth } from "@/auth";
import { KeyStatusToggle } from "@/components/key-status-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Skeleton } from "@/components/ui/skeleton";
// UI
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code } from "@/components/ui/text";
import { KeyCreateDialog } from "./page.client";

export default async function KeysPage() {
  return (
    <div>
      <KeyCreateDialog />
      <Card
        className="my-4"
        description="Check out our documentation or contact support."
        title="Need help with your API keys?"
      />
      <Divider className="my-6" soft />
      <Suspense fallback={<Skeleton />}>
        <KeysTable />
      </Suspense>
    </div>
  );
}

async function KeysTable() {
  const headersList = await headers();

  const keys = await auth.api.listApiKeys({
    headers: headersList,
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Key ID</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader>Created At</TableHeader>
          <TableHeader>Key Hint</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>
            <span className="sr-only">Actions</span>
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {keys?.map((key) => (
          <TableRow key={key.id}>
            <TableCell>{key.id}</TableCell>
            <TableCell>{(key.name as string) ?? "Unnamed Key"}</TableCell>
            <TableCell>
              <time dateTime={key.createdAt.toString()}>
                {format(key.createdAt, "MMM, d, yyyy h:mm a")}
              </time>
            </TableCell>
            <TableCell>
              <Code>{key.start}</Code>
            </TableCell>
            <TableCell>
              <KeyStatusToggle enabled={key.enabled} id={key.id} />
            </TableCell>
            <TableCell className="text-right">
              <Button href={`/keys/${key.id}`}>Manage Key</Button>
            </TableCell>
          </TableRow>
        ))}
        {keys.length === 0 && (
          <TableRow>
            <TableCell className="text-center" colSpan={6}>
              No keys found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
