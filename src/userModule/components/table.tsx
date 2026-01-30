
import { Button } from "@/components/ui/button"
import { ChevronDown, Plus } from "lucide-react"
import {
    type CellContext,
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type RowSelectionState,
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
import { useState, useCallback, useEffect, useMemo } from "react"
import { useOpenClose } from "@/utilities/hooks"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { FieldValues, UseFormReturn, Path } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

interface AlertDialogProps<T extends FieldValues> {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setIsOpen: (isOpen: boolean) => void;
    form?: UseFormReturn<T, any, T>;
    excemptColumns?: (keyof T)[];
    spanishNames?: Record<string, string>;
    rowData?: Partial<T>;
    buttonName: string;
    onConfirm: (() => Promise<void>) | ((data: Partial<T>) => Promise<void>);
    icon?: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "ghost";
    status: any;
}

function DeleteAlertDialog<T extends FieldValues>({ isOpen, rowData, buttonName, icon, variant, close, toggle, onConfirm, status }: AlertDialogProps<T>) {
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
                                await onConfirm(rowData!);
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

function SaveAlertDialog<T extends FieldValues>({ isOpen, excemptColumns, spanishNames, buttonName, form, toggle, icon, variant, onConfirm, status, rowData }: AlertDialogProps<T>) {
    const keys = useMemo(() => Object.keys(rowData || {}).map((key) => {
        if (!excemptColumns) return key;
        return excemptColumns.includes(key as keyof T) ? null : key;
    }).filter((key) => key !== null) as (keyof T)[], [rowData, excemptColumns]);
    useEffect(() => {
        if (isOpen && form && rowData) {
            keys.forEach((k) => {
                const key = String(k);
                form.setValue(key as Path<T>, rowData[key as keyof T] as any);
            })
        }
    }, [isOpen, form, rowData, keys]);
    if (!form) {
        throw new Error("Form is required for SaveAlertDialog");
    }
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
                        {
                            keys.map((k) => {
                                const key = String(k);
                                return (
                                    <FormField
                                        control={form.control}
                                        name={key as Path<T>}
                                        key={key}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{spanishNames ? spanishNames[key] || key : key}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type={typeof rowData![key] === "number" ? "number" : "text"}
                                                        placeholder={key}
                                                        {...field}
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            const isNumber = typeof rowData![key] === "number";
                                                            if (isNumber) {
                                                                const num = Number(v);
                                                                field.onChange(v === "" || isNaN(num) ? 0 : num);
                                                            } else {
                                                                field.onChange(v);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                );
                            })
                        }
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

interface TableProps<T extends FieldValues> {
    data: T[];
    idName: string;
    form?: UseFormReturn<T, any, T>;
    spanishNames?: Record<string, string>;
    excemptColumns?: (keyof T)[];
    useAdminData: (refect?: (() => void) | undefined) => {
        onSave: (data: T) => Promise<void>;
        onEdit: (id: number | null, data: T) => Promise<void>;
        onDelete: (id: number | null) => Promise<void>;
        status: any;
    };
    refetch?: (() => void) | undefined;
}

export function ItemTable<T extends FieldValues>({ data, idName, form, spanishNames, excemptColumns, useAdminData, refetch }: TableProps<T>) {
    const { onSave, onEdit, onDelete } = useAdminData(refetch);
    const keys = Object.keys(data[0] || {}) as (keyof T)[];
    const columns: ColumnDef<T>[] = [
        {
            accessorKey: idName,
            header: "id",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue(idName)}</div>
            ),
        },
        ...keys.map((k) => {
            let key = String(k);
            if (key === idName) return null;
            return {
                accessorKey: key,
                header: spanishNames ? (spanishNames[key] || key) : key,
                cell: ({ row }: CellContext<T, unknown>) => {
                    const value = row.getValue(key);
                    return (
                        <div className="capitalize">{String(value)}</div>
                    )
                },
                enableSorting: true,
                enableColumnFilter: true,
            }
        }).filter(i => i !== null),
    ];
    columns.push({
        id: "save",
        enableHiding: false,
        cell: ({ row }: CellContext<T, unknown>) => {
            const { isOpen, open, setIsOpen, toggle, close } = useOpenClose();
            const data = row.original as any;
            const onConfirm = useCallback(async (formData: Partial<T>) => {
                await onEdit(data[idName], formData as T);
            }, [data, idName]);
            return (
                <div className="flex justify-end">
                    <SaveAlertDialog<T>
                        buttonName="Editar"
                        isOpen={isOpen}
                        form={form}
                        open={open}
                        setIsOpen={setIsOpen}
                        toggle={toggle}
                        close={close}
                        rowData={data}
                        excemptColumns={excemptColumns}
                        onConfirm={onConfirm}
                        spanishNames={spanishNames}
                        status={{ isLoading: false }}
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
                        status={{ isLoading: false }}
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
            const onConfirm = useCallback(async (data: Partial<T>) => {
                await onSave(data as T);
            }, []);
            const keys = Object.keys(data[0] || {}) as (keyof T)[];
            const d = {} as T;
            keys.forEach((k) => {
                const key = String(k);
                if (typeof data[0][key] === "string") {
                    (d as any)[key] = "";
                    return;
                }
                (d as any)[key] = 0;
            });
            return (
                <div className="flex justify-end">
                    <SaveAlertDialog<T>
                        buttonName=""
                        isOpen={isOpen}
                        open={open}
                        form={form}
                        setIsOpen={setIsOpen}
                        toggle={toggle}
                        close={close}
                        onConfirm={onConfirm}
                        excemptColumns={excemptColumns}
                        rowData={d}
                        icon={<Plus />}
                        variant="ghost"
                        spanishNames={spanishNames}
                        status={{ isLoading: false }}
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
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
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