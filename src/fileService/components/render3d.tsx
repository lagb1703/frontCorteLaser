import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

interface props {
  file: Blob;
  thickness: number;
}

function GridFloor() {
  return (
    <gridHelper args={[20, 20, 0x888888, 0x444444]} position={[0, -2, 0]} />
  );
}

function LoadingIndicator() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 2;
      ref.current.rotation.y += delta * 2;
    }
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#22d3ee" wireframe />
    </mesh>
  );
}

function OBJModel({ blob, thickness }: { blob: Blob; thickness: number }) {
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
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const positionAttribute = child.geometry.attributes.position;
              const localVertex = new THREE.Vector3();
              const worldVertex = new THREE.Vector3();
              if (positionAttribute.count != 6) {
                return;
              }
              for (let i = 0; i < positionAttribute.count; i++) {
                positionAttribute.setZ(i, 0.1);
                localVertex.fromBufferAttribute(positionAttribute, i);
                worldVertex.copy(localVertex).applyMatrix4(child.matrixWorld);
                console.log(`Vertex ${i}:`, worldVertex);
              }
              positionAttribute.needsUpdate = true;
            }
          });
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

  useEffect(() => {
    if (model == null) return;
    model.scale.z = thickness;
  }, [model, thickness]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <Html center>
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      </Html>
    );
  }

  if (!model) return null;
  return <primitive ref={ref} object={model} />;
}

function GLBModel({ blob, thickness }: { blob: Blob; thickness: number }) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<THREE.Group>(null!);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    const loader = new GLTFLoader();

    setLoading(true);
    setError(null);

    loader.load(
      url,
      (gltf) => {
        try {
          const obj = gltf.scene;
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

  useEffect(() => {
    if (model == null) return;
    model.scale.z = thickness;
  }, [model, thickness]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <Html center>
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      </Html>
    );
  }

  if (!model) return null;
  return <primitive ref={ref} object={model} />;
}

export default function Render3D({ file, thickness }: props) {
  return (
    <div className="relative w-full h-full">
      <Canvas
        className="w-full h-full bg-muted overflow-hidden rounded-md"
        camera={{ position: [5, 3, 5], fov: 50 }}
        shadows
      >
        <color attach="background" args={["#1a1a2e"]} />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.3} />

        <GridFloor />
        <GLBModel blob={file} thickness={thickness} />

        <OrbitControls
          makeDefault
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.PAN,
            RIGHT: THREE.MOUSE.DOLLY,
          }}
          enableDamping
          dampingFactor={0.1}
          minDistance={2}
          maxDistance={20}
        />
      </Canvas>

      <div className="absolute bottom-3 left-3 bg-black/60 text-white/80 px-3 py-2 rounded-md text-xs space-y-1 pointer-events-none">
        <p className="font-semibold mb-1">Controles</p>
        <p>click izquierdo: rotar</p>
        <p>click del medio: mover</p>
        <p>click derecho: zoom</p>
        <p>Scroll: Zoom</p>
      </div>
    </div>
  );
}
