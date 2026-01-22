import type { Control, UseFormSetValue, UseFormReset } from "react-hook-form"
import { useWatch } from "react-hook-form"
import type { PaymentType, PaymentMethodType } from "../validators/paymentValidators"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@radix-ui/react-label"
interface Props {
  reset: UseFormReset<PaymentType>
  control: Control<PaymentType>
  setValue: UseFormSetValue<PaymentType>
  paymentMethods: Array<PaymentMethodType> | undefined
  isLoadingPaymentMethods: boolean
}

export default function PaymentChoice(
  {
    reset,
    control,
    setValue,
    paymentMethods,
    isLoadingPaymentMethods
  }: Props
) {
  const [isCreditCard, setIsCreditCard] = useState<boolean>(false) // null = unknown
  const selectedType = useWatch({ control, name: "payment_method.type" }) as string | undefined
  if (isLoadingPaymentMethods) {
    return <div>Cargando métodos de pago...</div>
  }
  const paymentMethodsList = paymentMethods || []

  return (
    <>
      <FormField
        control={control}
        name="payment_method.type"
        render={({ field }) => (
            <FormItem className="space-y-3">
            <FormLabel>Seleccionar método de pago</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                {paymentMethodsList.map((method: PaymentMethodType) => (
                  <Button
                    key={method.id}
                    variant={field.value === method.name ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => {
                      reset();
                      setTimeout(() => {
                        field.onChange(method.name);
                        setValue("paymentMethodId", method.id!);
                      }, 100);
                    }}
                  >
                    {method.name}
                  </Button>
                ))}
              </div>
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedType === "NEQUI" && (
        <FormField
          control={control}
          name="payment_method.phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de teléfono (Nequi)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {selectedType === "CARD" && (
        <>
          <FormField
            control={control}
            name="card.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de tarjeta</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-2">
            <FormField
              control={control}
              name="card.exp_month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mes de vencimiento</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="card.exp_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año de vencimiento</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="card.cvc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVC</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="card.card_holder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titular de la tarjeta</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            className="flex justify-between items-center">
            <div>
              <Checkbox
                id="checkbox-credit-card"
                checked={isCreditCard}
                onCheckedChange={(checked) => {
                  setIsCreditCard(!!checked);
                  if (!checked) {
                    setValue("payment_method.installments", undefined);
                  }
                }}
              />
              <Label
                htmlFor="checkbox-credit-card"
                className="ml-2 select-none"
              >
                Habilitar cuotas
              </Label>
            </div>
            <FormField
              control={control}
              name="payment_method.installments"
              disabled={!isCreditCard}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuotas</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      step={1}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value === "" ? undefined : Number(e.target.value)
                        field.onChange(v as any)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </>
  )
}