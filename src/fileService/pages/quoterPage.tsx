import { useParams } from "react-router";
import { useGetImage, useGetPrice, useQuoter } from "../hooks";
import Quoter from "../components/quoter";
import Resume from "../components/resume";
import ImageVisualizer from "../components/imageVisualizer";
import {
  useGetMaterials,
  useGetThicknessByMaterialId
} from "@/materialModule/hooks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PaymentDialog from "@/paymentModule/components/paymentDialog";

export default function QuoterPage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { fileId } = useParams<{ fileId: string }>();
  const { data: imageData } = useGetImage(fileId!);
  const { materialId, thicknessId, setMaterialId, setThicknessId, amount, setAmount } = useQuoter();
  const { data: priceData, refetch } = useGetPrice(
    fileId!,
    materialId,
    thicknessId,
    amount
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
  }, [materialId, thicknessId, amount, refetch, thicknesses]);
  return (
    <div
      className="h-full">
      {
        imageData &&
        <div
          className="">
          <ImageVisualizer image={imageData} />
        </div>
      }
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
        />
      )}
      <div
        className="w-full flex justify-center">
        <Button
          className="m-4"
          onClick={() => setIsPaymentOpen(true)}
          disabled={!priceData}>
          Pagar
        </Button>
      </div>
      {priceData && (
        <PaymentDialog
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          fileId={fileId!}
          materialId={materialId!}
          thicknessId={thicknessId!}
        />)}
    </div>
  );
}