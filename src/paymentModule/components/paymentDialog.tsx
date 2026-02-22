import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useWatch } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useManageData, useGetDepartaments, useGetCitiesByDepartamentId } from "../hoocks"
import PaymentChoice from "./paymentChoise"
import { Label } from "@/components/ui/label"
import type { ReferenceType } from "../validators/paymentValidators"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"

type PaymentDialogProps = {
    isOpen: boolean
    onClose: () => void
    items: ReferenceType[]
}

export default function PaymentDialog({ isOpen, onClose, items }: PaymentDialogProps) {
    const { data: departaments } = useGetDepartaments();
    const [departamentId, setDepartamentId] = useState<number | undefined>();
    const { data: cities } = useGetCitiesByDepartamentId(departamentId);
    const [cityId, setCityId] = useState<number | undefined>();
    const {
        form,
        control,
        setValue,
        acceptancesTokens,
        isLoadingAcceptanceTokens,
        setAcceptUserPolicy,
        setAcceptancePersonalDataAuth,
        paymentMethods,
        isLoadingPaymentMethods,
        submitHandler,
    } = useManageData({ items, onClose });
    const [isDirectionDisabled, setIsDirectionDisabled] = useState<boolean>(false);
    useEffect(() => {
        if (isDirectionDisabled)
            setValue("address", "");
    }, [isDirectionDisabled])
    const acceptance_token = useWatch({ control, name: "acceptance_token" }) as string
    const accept_personal_auth = useWatch({ control, name: "accept_personal_auth" }) as string
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="max-h-[520px] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>Información de pago</DialogTitle>
                    <DialogDescription>
                        Por favor, ingresa tus datos de pago a continuación.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <PaymentChoice
                        reset={form.reset}
                        control={control}
                        setValue={setValue}
                        paymentMethods={paymentMethods}
                        isLoadingPaymentMethods={isLoadingPaymentMethods}
                    />
                    <div
                        className="flex flex-col w-full gap-2">
                        <FormLabel
                            className="text-md font-semibold"
                        >
                            Datos de facturación
                        </FormLabel>
                        <FormField
                            control={control}
                            name="billing.name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="billing.email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="billing.identification"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Identificacion</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div
                            className="mt-4">
                            <div
                                className="flex justify-start items-center gap-2 mb-2">
                                <Switch
                                    id="address-toggle"
                                    checked={!!isDirectionDisabled}
                                    onCheckedChange={(checked) => setIsDirectionDisabled(!!checked)}
                                />
                                <Label htmlFor="address-toggle" className="text-sm">
                                    Recoger en la oficina
                                </Label>
                            </div>
                            {!isDirectionDisabled && (
                                <div
                                    className="flex flex-col gap-2">
                                    <Combobox
                                        id="departament-combobox"
                                        items={departaments?.map((d) => d.name) ?? []}
                                        value={departaments?.find((d) => d.id === departamentId)?.name ?? ""}
                                        onValueChange={
                                            (value) => {
                                                const selected = departaments?.find((d) => d.name === value);
                                                setDepartamentId(selected?.id);
                                            }
                                        }
                                    >
                                        <ComboboxInput placeholder="Seleccionar departamento..." />
                                        <ComboboxContent>
                                            <ComboboxEmpty>No se encontraron departamentos</ComboboxEmpty>
                                            <ComboboxList>
                                                {(item) => (
                                                    <ComboboxItem key={item} value={item}>
                                                        {item}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    <Combobox
                                        id="cities-combobox"
                                        items={cities?.map((d) => d.name) ?? []}
                                        value={cities?.find((d) => d.id === cityId)?.name ?? ""}
                                        onValueChange={
                                            (value) => {
                                                const selected = cities?.find((d) => d.name === value);
                                                setCityId(selected?.id);
                                            }
                                        }
                                    >
                                        <ComboboxInput placeholder="Seleccionar ciudad..." />
                                        <ComboboxContent>
                                            <ComboboxEmpty>No se encontraron ciudades</ComboboxEmpty>
                                            <ComboboxList>
                                                {(item) => (
                                                    <ComboboxItem key={item} value={item}>
                                                        {item}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    <FormField
                                        control={control}
                                        name="address"
                                        disabled={!departamentId || !cityId}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dirección</FormLabel>
                                                <FormControl>
                                                    <Input {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className="flex justify-between items-center mb-4"
                    >
                        <div
                            className="basis-1/2 flex justify-start items-center gap-2">
                            <Checkbox
                                id="accept-user-policy"
                                checked={!!acceptance_token}
                                onCheckedChange={(checked) => setAcceptUserPolicy(!!checked)}
                                disabled={isLoadingAcceptanceTokens}
                            />
                            <Label htmlFor="accept-user-policy" className="text-sm">
                                <a href={acceptancesTokens?.presigned_acceptance.permalink} target="_blank" rel="noopener noreferrer">
                                    Acepto la política de usuario
                                </a>
                            </Label>
                        </div>
                        <div
                            className="basis-1/2 flex justify-end items-center gap-2">
                            <Checkbox
                                id="accept-personal-auth"
                                checked={!!accept_personal_auth}
                                onCheckedChange={(checked) => setAcceptancePersonalDataAuth(!!checked)}
                                disabled={isLoadingAcceptanceTokens}
                            />
                            <Label htmlFor="accept-personal-auth" className="text-sm">
                                <a href={acceptancesTokens?.presigned_personal_data_auth.permalink} target="_blank" rel="noopener noreferrer">
                                    Acepto la autorización de datos personales
                                </a>
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={form.handleSubmit(submitHandler)}
                            disabled={
                                !form.formState.isValid ||
                                (form.getValues("address") === "" && !isDirectionDisabled) ||
                                form.formState.isSubmitting}
                        >
                            Enviar pago
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}