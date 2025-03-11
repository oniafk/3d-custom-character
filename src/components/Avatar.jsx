import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

export const Avatar = ({ ...props }) => {
  const group = useRef();
  const { nodes } = useGLTF("models/Armature.glb");

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="Armature"
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[0.01, 0.01, 0.01]}
        >
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
};
