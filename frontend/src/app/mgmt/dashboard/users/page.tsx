"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@/lib/enum/roles.enum";
import { CreateUserDialog } from "@/components/mgmt/create-user-dialog";
import { ActivateUserDialog } from "@/components/mgmt/user-activate-dialog";
import { DeactivateUserDialog } from "@/components/mgmt/user-deactivate-dialog";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  isActive: boolean;
  admin: {
    id: string;
    created_at: string;
    updated_at: string;
  } | null;
  customer: {
    id: string;
    created_at: string;
    updated_at: string;
    country: string;
    state: string;
    city: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export default function UsersPage() {
  const [userToDeactivate, setUserToDeactivate] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [userToActivate, setUserToActivate] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data as User[];
    },
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case Role.EDITOR:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case Role.REVIEWER:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  useEffect(() => {

    if (userToDeactivate || userToActivate) {
      document.body.style.pointerEvents = "none";
    }

    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [userToDeactivate, userToActivate]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage system users and their roles
            </CardDescription>
          </div>
          <CreateUserDialog />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((user) => (
                  <TableRow
                    key={user.id}
                    className={!user.isActive ? "opacity-70" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.email}</div>
                        <div className="text-muted-foreground">
                          {user.phone_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getRoleBadgeColor(user.role)}
                      >
                        {user.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.admin ? (
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 hover:bg-purple-100"
                        >
                          Admin
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                        >
                          Customer
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800 hover:bg-gray-100"
                        >
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/mgmt/dashboard/users/${user.id}`)
                            }
                          >
                            View
                          </DropdownMenuItem>
                          {user.isActive ? (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                setUserToDeactivate({
                                  id: user.id,
                                  name: user.name,
                                })
                              }
                            >
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                setUserToActivate({
                                  id: user.id,
                                  name: user.name,
                                })
                              }
                            >
                              Activate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {userToDeactivate && (
        <DeactivateUserDialog
          userId={userToDeactivate.id}
          userName={userToDeactivate.name}
          isOpen={!!userToDeactivate}
          onOpenChange={(open) => {
            if (!open) setUserToDeactivate(null);
          }}
        />
      )}

      {userToActivate && (
        <ActivateUserDialog
          userId={userToActivate.id}
          userName={userToActivate.name}
          isOpen={!!userToActivate}
          onOpenChange={(open) => {
            if (!open) setUserToActivate(null);
          }}
        />
      )}
    </div>
  );
}
