
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronDown, Plus } from "lucide-react"
import type { Material } from "@/materialModule/validators/materialValidators"
import type { Thickness } from "@/materialModule/validators/thicknessValidators"
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useState, useCallback } from "react"
import { useOpenClose } from "@/utilities/hooks"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { materialSchema } from "@/materialModule/validators/materialValidators"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

interface AlertDialogProps {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setIsOpen: (isOpen: boolean) => void;
    rowData?: Partial<Material> | Partial<Thickness>;
    buttonName: string;
    onConfirm: (() => Promise<void>) | ((data: any) => Promise<void>);
    icon?: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "ghost";
    status: any;
    hasWeight?: boolean;
}

function DeleteAlertDialog({ isOpen, buttonName, icon, variant, close, toggle, onConfirm, status }: AlertDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={toggle}>
            <AlertDialogTrigger asChild>
                <Button type="button" variant={variant || "destructive"} disabled={status?.isLoading}>
                    {icon}
                    {buttonName}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará el item de forma permanente. ¿Desea continuar?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancelar</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                await onConfirm("");
                                close();
                            }}
                        >
                            Eliminar
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function SaveAlertDialog({ isOpen, buttonName, toggle, icon, variant, onConfirm, status, rowData, hasWeight }: AlertDialogProps) {
    const form = useForm<Material | Thickness>({
        resolver: zodResolver(materialSchema) as Resolver<Material | Thickness>,
        mode: "onChange",
        defaultValues: {
            name: rowData?.name || "",
            price: rowData?.price || 0,
            weight: (rowData as Material)?.weight || 0
        },
    })
    return (
        <AlertDialog open={isOpen} onOpenChange={toggle}>
            <AlertDialogTrigger asChild>
                <Button type="button" variant={variant || "default"} disabled={status?.isLoading}>
                    {icon}
                    {status?.isLoading ? "Guardando..." : buttonName}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar guardado</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Deseas guardar los cambios realizados?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onConfirm)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Precio"
                                            {...field}
                                            onChange={(e) => {
                                                const v = (e.target as HTMLInputElement).value
                                                field.onChange(v === "" ? undefined : Number(v))
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {hasWeight && (
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Peso</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Peso"
                                                {...field}
                                                onChange={(e) => {
                                                    const v = (e.target as HTMLInputElement).value
                                                    field.onChange(v === "" ? undefined : Number(v))
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button variant="outline">Cancelar</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    type="submit"
                                    disabled={status?.isLoading}
                                >
                                    Guardar
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

interface TableProps {
    data: (Material | Thickness)[];
    idName: string;
    useAdminData: (refect?: (() => void) | undefined) => {
        onSave: (data: Material | Thickness) => Promise<void>;
        onEdit: (id: number | null, data: Material | Thickness) => Promise<void>;
        onDelete: (id: number | null) => Promise<void>;
        status: any;
    };
    refetch?: (() => void) | undefined;
}

export function ItemTable({ data, idName, useAdminData, refetch }: TableProps) {
    const { onSave, onEdit, onDelete } = useAdminData(refetch);
    const hasWeight = idName === "materialId" || (data[0] as Material)?.weight !== undefined;

    const columns: ColumnDef<Material | Thickness>[] = [
        {
            accessorKey: idName,
            header: "id",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue(idName)}</div>
            ),
        },
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
            accessorKey: "price",
            header: () => <div className="text-right">Precio</div>,
            cell: ({ row }) => {
                return <div className="text-right font-medium">{row.getValue("price")}</div>
            },
        },
        {
            accessorKey: "lastModification",
            header: () => <div className="text-right">Ultima Modificación</div>,
            cell: ({ row }) => {
                return <div className="text-right font-medium">{(row.getValue("lastModification") as string)?.split("T")[0]}</div>
            },
        }
    ];
    if (hasWeight) {
        columns.push({
            accessorKey: "weight",
            header: () => <div className="text-right">Peso (gramos)</div>,
            cell: ({ row }) => {
                return <div className="text-right font-medium">{row.getValue("weight")}</div>
            },
        });
    }
    columns.push({
        id: "save",
        enableHiding: false,
        cell: ({ row }) => {
            const { isOpen, open, setIsOpen, toggle, close } = useOpenClose();
            const data = row.original as any;
            const onConfirm = useCallback(async (formData: Material | Thickness) => {
                await onEdit(data[idName], formData);
            }, [data, idName]);
            return (
                <div className="flex justify-end">
                    <SaveAlertDialog
                        buttonName="Editar"
                        isOpen={isOpen}
                        open={open}
                        setIsOpen={setIsOpen}
                        toggle={toggle}
                        close={close}
                        rowData={data}
                        onConfirm={onConfirm}
                        status={{ isLoading: false }} // Placeholder for status
                        hasWeight={hasWeight}
                    />
                </div>
            )
        },
    })
    columns.push({
        id: "delete",
        enableHiding: false,
        cell: ({ row }) => {
            const { isOpen, open, toggle, setIsOpen, close } = useOpenClose();
            const id = (row.original as any)[idName] as number | null;
            return (
                <div className="flex justify-end">
                    <DeleteAlertDialog
                        buttonName="Eliminar"
                        isOpen={isOpen}
                        open={open}
                        setIsOpen={setIsOpen}
                        toggle={toggle}
                        close={close}
                        onConfirm={async () => {
                            await onDelete(id);
                        }}
                        status={{ isLoading: false }} // Placeholder for status
                    />
                </div>
            )
        },
    });
    columns.push({
        id: "saveNew",
        enableHiding: false,
        header: () => {
            const { isOpen, open, toggle, setIsOpen, close } = useOpenClose();
            const onConfirm = useCallback(async (data: Material | Thickness) => {
                await onSave(data);
            }, []);
            return (
                <div className="flex justify-end">
                    <SaveAlertDialog
                        buttonName=""
                        isOpen={isOpen}
                        open={open}
                        setIsOpen={setIsOpen}
                        toggle={toggle}
                        close={close}
                        onConfirm={onConfirm}
                        icon={<Plus />}
                        variant="ghost"
                        status={{ isLoading: false }} // Placeholder for status
                        hasWeight={hasWeight}
                    />
                </div>
            )
        },
        cell: () => null,
    });
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const table = useReactTable({
        data,
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columnas <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
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
    )
}