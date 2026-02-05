"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, UserPlus, Shield, Building2 } from "lucide-react";

type User = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string | null;
    smi_name: string | null;
    department: string;
    position: string;
    created_at: string;
};

type SMI = {
    id: string;
    name: string;
};

export default function UserManagementPage() {
    const queryClient = useQueryClient();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: "",
        role: "ACCOUNTANT",
        smi_id: "",
        phone_number: "",
        department: "",
        position: "",
    });

    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await apiClient.get<User[]>("/api/auth/users/");
            // The backend currently returns paginated response or list depending on endpoint
            // Adjusting to handle potential pagination structure { results: [...] }
            const data = response.data as any;
            return Array.isArray(data) ? data : data.results || [];
        },
    });

    const { data: smis } = useQuery({
        queryKey: ["smis"],
        queryFn: async () => {
            const response = await apiClient.get<SMI[]>("/api/core/smis/");
            const data = response.data as any;
            return Array.isArray(data) ? data : data.results || [];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const payload = { ...data };
            // Ensure smi_id is null or a valid string, not empty string
            if (!payload.smi_id) {
                delete (payload as any).smi_id;
            }
            if (!payload.phone_number) delete (payload as any).phone_number;
            if (!payload.department) delete (payload as any).department;
            if (!payload.position) delete (payload as any).position;

            await apiClient.post("/api/auth/register/", payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsCreateDialogOpen(false);
            toast.success("User created successfully");
            setFormData({
                username: "",
                email: "",
                first_name: "",
                last_name: "",
                password: "",
                confirm_password: "",
                role: "ACCOUNTANT",
                smi_id: "",
                phone_number: "",
                department: "",
                position: "",
            });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create user");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match");
            return;
        }
        createMutation.mutate(formData);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage system users and their roles
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Username</label>
                                    <Input
                                        required
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({ ...formData, username: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First Name</label>
                                    <Input
                                        required
                                        value={formData.first_name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, first_name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Name</label>
                                    <Input
                                        required
                                        value={formData.last_name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, last_name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <Input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Confirm Password</label>
                                    <Input
                                        type="password"
                                        required
                                        value={formData.confirm_password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, confirm_password: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Role</label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, role: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">Administrator</SelectItem>
                                            <SelectItem value="PRINCIPAL_OFFICER">
                                                Principal Officer
                                            </SelectItem>
                                            <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
                                            <SelectItem value="COMPLIANCE_OFFICER">
                                                Compliance Officer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">SMI (Optional)</label>
                                    <Select
                                        value={formData.smi_id}
                                        onValueChange={(value) =>
                                            setFormData({ ...formData, smi_id: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select SMI" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {smis?.map((smi: any) => (
                                                <SelectItem key={smi.id} value={smi.id}>
                                                    {smi.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? "Creating..." : "Create User"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>SMI</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : users?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users?.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{user.username}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {user.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {user.role === "ADMIN" ? (
                                                <Shield className="h-4 w-4 text-primary" />
                                            ) : (
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            {user.role?.replace("_", " ")}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.smi_name || "-"}</TableCell>
                                    <TableCell>
                                        <div
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold max-w-fit ${user.user?.is_active
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {user.user?.is_active ? "Active" : "Inactive"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
