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
  const { materialId, thicknessId, setMaterialId, setThicknessId } = useQuoter();
  const { data: priceData, refetch } = useGetPrice(
    fileId!,
    materialId,
    thicknessId
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
  }, [materialId, thicknessId, refetch, thicknesses]);
  return (
    <div>
      {imageData && <ImageVisualizer image={imageData} />}
      <Quoter
        materials={materials || []}
        materialId={materialId!}
        setMaterialId={setMaterialId}
        thicknesses={thicknesses || []}
        thicknessId={thicknessId!}
        setThicknessId={setThicknessId}
      />
      {priceData && (
        <Resume
          materialId={materialId!}
          thicknessId={thicknessId!}
          materials={materials || []}
          thicknesses={thicknesses || []}
          price={priceData.price}
        />
      )}
      <Button 
        onClick={() => setIsPaymentOpen(true)}
        disabled={!priceData}>
          Pay
      </Button>
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