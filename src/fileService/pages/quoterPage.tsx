import { useParams } from "react-router";
import { useGetGlb, useGetPrice, useQuoter } from "../hooks";
import Quoter from "../components/quoter";
import Resume from "../components/resume";
import Render3D from "../components/render3d";
import {
  useGetMaterials,
  useGetThicknessByMaterialId,
} from "@/materialModule/hooks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PaymentDialog from "@/paymentModule/components/paymentDialog";

export default function QuoterPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { fileId } = useParams<{ fileId: string }>();
  const { data: GlbData } = useGetGlb(fileId!);
  const {
    materialId,
    thicknessId,
    setMaterialId,
    setThicknessId,
    amount,
    setAmount,
  } = useQuoter();
  const { data: priceData, refetch } = useGetPrice(
    fileId!,
    materialId,
    thicknessId,
    amount,
  );
  const { data: materials } = useGetMaterials();
  const { data: thicknesses } = useGetThicknessByMaterialId(materialId);
  useEffect(() => {
    if (materialId === null || thicknessId === null) {
      setThicknessId(null);
      return;
    }
    if (!thicknesses) {
      return;
    }
    if (thicknesses.findIndex((t) => t.thicknessId == thicknessId) === -1) {
      setThicknessId(null);
      return;
    }
    refetch();
  }, [materialId, thicknessId, amount, refetch, thicknesses, setThicknessId]);
  return (
    <div className="h-full flex flex-col">
      {GlbData && (
        <div className="flex-1 min-h-0">
          <Render3D file={GlbData} thickness={10.0} />
        </div>
      )}
      <Quoter
        materials={materials || []}
        materialId={materialId!}
        setMaterialId={setMaterialId}
        thicknesses={thicknesses || []}
        thicknessId={thicknessId!}
        setThicknessId={setThicknessId}
        amount={amount}
        setAmount={setAmount}
      />
      {priceData && (
        <Resume
          materialId={materialId!}
          thicknessId={thicknessId!}
          materials={materials || []}
          thicknesses={thicknesses || []}
          amount={amount!}
          price={priceData.price}
          area={priceData.area}
          perimeter={priceData.perimeter}
        />
      )}
      <div className="w-full flex justify-center p-4">
        <Button
          className="basis-full md:basis-auto lg:basis-[32%] lg:py-6 m-4"
          onClick={() => setIsPaymentOpen(true)}
          disabled={!priceData}
        >
          Pagar
        </Button>
      </div>
      {priceData && (
        <PaymentDialog
          items={[
            {
              materialId: materialId!,
              thicknessId: thicknessId!,
              fileId: fileId!,
              amount: amount!,
            },
          ]}
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
        />
      )}
    </div>
  );
}
