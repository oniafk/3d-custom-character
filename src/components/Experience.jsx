import { animated, useSpring } from "@react-spring/three";
import {
  Environment,
  Float,
  Gltf,
  SoftShadows,
  useProgress,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useConfiguratorStore } from "../store";
import { Avatar } from "./Avatar";
import { CameraManager } from "./CameraManager";
import { LoadingAvatar } from "./LoadingAvatar";

export const Experience = () => {
  const { active } = useProgress();
  const [loading, setLoading] = useState(active);
  const setLoadingAt = useRef(0);

  useEffect(() => {
    let timeout;
    if (active) {
      timeout = setTimeout(() => {
        setLoading(true);
        setLoadingAt.current = Date.now();
      }, 50); // show spinner only after 50ms
    } else {
      timeout = setTimeout(() => {
        setLoading(false);
      }, Math.max(0, 2000 - (Date.now() - setLoadingAt.current))); // show spinner for at least 2s
    }
    return () => clearTimeout(timeout);
  }, [active]);

  const { scale, spin, floatHeight } = useSpring({
    scale: loading ? 0.5 : 1,
    spin: loading ? Math.PI * 8 : 0,
    floatHeight: loading ? 0.5 : 0,
  });

  return (
    <>
      <CameraManager loading={loading} />
      <Environment preset="sunset" environmentIntensity={0.3} />

      <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-0.31}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4b3d7d" roughness={0.75} />
      </mesh>

      <SoftShadows size={52} samples={16} focus={0.5} />

      {/* Key Light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      {/* Fill Light */}
      <directionalLight position={[-5, 5, 5]} intensity={0.7} />
      {/* Back Lights */}
      <directionalLight
        position={[3, 3, -5]}
        intensity={10}
        color={"#64a6bd"}
      />
      <directionalLight
        position={[-3, 3, -5]}
        intensity={20}
        color={"#5346BB"}
      />

      <AvatarWrapper loading={loading}>
        <animated.group
          scale={scale}
          position-y={floatHeight}
          rotation-y={spin}
        >
          <Avatar />
        </animated.group>
      </AvatarWrapper>
      <Gltf
        position-y={-0.31}
        src="/models/Teleporter Base.glb"
        castShadow
        receiveShadow
      />
      <LoadingAvatar loading={loading} />
    </>
  );
};

const AvatarWrapper = ({ loading, children }) => {
  return loading ? (
    <Float floatIntensity={2} speed={20}>
      {children}
    </Float>
  ) : (
    children
  );
};
