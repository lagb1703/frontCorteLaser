import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

interface props {
  file: Blob;
}

function OBJModel({ blob }: { blob: Blob }) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<THREE.Group>(null!);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    const loader = new OBJLoader();

    setLoading(true);
    setError(null);

    loader.load(
      url,
      (obj) => {
        try {
          const box = new THREE.Box3().setFromObject(obj);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          obj.position.sub(center);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = maxDim > 0 ? 5 / maxDim : 1;
          obj.scale.setScalar(scale);
          setModel(obj);
          setLoading(false);
        } catch {
          setError("Error processing 3D model");
          setLoading(false);
        }
        URL.revokeObjectURL(url);
      },
      undefined,
      () => {
        setError("Error loading 3D model");
        setLoading(false);
        URL.revokeObjectURL(url);
      },
    );

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  useFrame(() => {});

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" wireframe />
      </mesh>
    );
  }

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>
    );
  }

  if (!model) return null;
  return <primitive ref={ref} object={model} />;
}

export default function Render3D({ file }: props) {
  return (
    <Canvas
      className="
      w-full 
      h-full
      bg-muted 
      flex items-center justify-center 
      overflow-hidden rounded-md
      "
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <OBJModel blob={file} />
      <OrbitControls
        makeDefault
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.PAN,
          RIGHT: THREE.MOUSE.DOLLY,
        }}
        enableDamping
        dampingFactor={0.1}
      />
    </Canvas>
  );
}
