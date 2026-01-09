import { type FileDb } from "../validators/fileValidator";
import { Trash2 } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ArrowUpDown } from "lucide-react"
import { useState } from "react";

interface Props {
    files: FileDb[];
    isLoading: boolean;
    fileId: string | number | null;
    setFileId: (id: string | number) => void;
    deleteFile: (id: string | number) => void;
}

export default function FileList({ files, isLoading, fileId, setFileId, deleteFile }: Props) {
    const columns: ColumnDef<FileDb>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nombre
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
        },
        {
            id: "delete",
            enableHiding: false,
            cell: ({ row }) => {
                const id = (row.original as any)["id"] as string;
                return (
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                            e.preventDefault();
                            deleteFile(id);
                        }}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                )
            },
        },

        {
            id: "see",
            enableHiding: false,
            cell: ({ row }) => {
                const id = (row.original as any)["id"] as string;
                return (
                    <Button size="sm" variant="ghost" onClick={() => setFileId(id)}>
                        Ver
                    </Button>
                )
            },
        },
    ];
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const table = useReactTable({
        data: files,
        columns,
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5,
            },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Archivos</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <ul className="flex flex-col divide-y">
                        {[1, 2, 3].map((i) => (
                            <li key={i} className="flex items-center justify-between py-2">
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <div className="ml-4 w-28 flex items-center justify-end gap-2">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-8 w-12" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="w-full">
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Filtar por nombres"
                                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("name")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                                className={(row.original as any)["id"] == fileId ? "bg-muted" : ""}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {table.getRowModel().rows.length} de {table.getFilteredRowModel().rows.length} resultados.
                                </p>
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}