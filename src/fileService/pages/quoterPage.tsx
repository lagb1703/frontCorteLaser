import { useParams } from "react-router";
import { useGetImage, useGetPrice, useQuoter } from "../hooks";
import Quoter from "../components/quoter";
import Resume from "../components/resume";
import ImageVisualizer from "../components/imageVisualizer";
import {
    useGetMaterials,
    useGetThicknessByMaterialId
} from "@/materialModule/hooks";

export default function QuoterPage() {
  const { fileId } = useParams<{ fileId: string }>();
  const { data: imageData } = useGetImage(fileId!);
  const { materialId, thicknessId, setMaterialId, setThicknessId } = useQuoter();
  const { data: priceData } = useGetPrice(
    fileId!,
    materialId,
    thicknessId
  );
  const { data: materials } = useGetMaterials();
  const { data: thicknesses } = useGetThicknessByMaterialId(materialId);
  return (
    <div>
      {imageData && <ImageVisualizer image={imageData} />}
      <Quoter
        materials={materials || []}
        setMaterialId={setMaterialId}
        thicknesses={thicknesses || []}
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
    </div>
  );
}