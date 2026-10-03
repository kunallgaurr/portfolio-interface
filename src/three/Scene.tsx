"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { content } from "@/content";
import { runtime } from "@/lib/runtime";
import { Engine, PALETTE, type EngineOptions } from "./engine";
import { layoutSkills } from "./layout";

/** Quality steps, best first. The monitor walks down when frames drop. */
const TIERS = [
  { dpr: 2, fraction: 1, aberration: 1 },
  { dpr: 1.5, fraction: 1, aberration: 1 },
  { dpr: 1.25, fraction: 0.62, aberration: 0 },
  { dpr: 1, fraction: 0.4, aberration: 0 },
];
const LAST_TIER = TIERS.length - 1;

const skillNodes = layoutSkills(content.skills.groups.map((g) => g.skills.length));
const ABERRATION = new THREE.Vector2(0.0011, 0.0008);
const NO_ABERRATION = new THREE.Vector2(0, 0);

function World({ tier, options }: { tier: number; options: EngineOptions }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const advance = useThree((s) => s.advance);
  const engine = useRef<Engine | null>(null);

  useEffect(() => {
    const instance = new Engine(gl, scene, camera as THREE.PerspectiveCamera, options);
    engine.current = instance;
    return () => {
      instance.dispose();
      engine.current = null;
    };
  }, [gl, scene, camera, options]);

  // The page's ticker drives rendering so scroll and scene never disagree.
  useEffect(() => {
    runtime.advance = (time) => advance(time);
    return () => {
      runtime.advance = null;
    };
  }, [advance]);

  useFrame((state, delta) => {
    const current = engine.current;
    if (!current) return;
    current.setFraction(TIERS[tier].fraction);
    current.update(state.size.width, state.size.height, delta);
  });

  return null;
}

export default function Scene() {
  const [device] = useState(() => {
    const small = window.matchMedia("(pointer: coarse), (max-width: 760px)").matches;
    return {
      // 512² is 262,144 particles; phones get 256² (65,536).
      options: {
        textureSize: small ? 256 : 512,
        skillNodes,
        jobCount: content.experience.jobs.length,
        projectCount: content.projects.items.length,
      } satisfies EngineOptions,
      startTier: small ? 1 : 0,
      pixelRatio: window.devicePixelRatio || 1,
    };
  });
  const [tier, setTier] = useState(device.startTier);
  const quality = TIERS[tier];

  return (
    <div className="stage-canvas" aria-hidden="true">
    <Canvas
      frameloop="never"
      flat
      dpr={Math.min(device.pixelRatio, quality.dpr)}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "high-performance" }}
      camera={{ fov: 45, near: 0.1, far: 220, position: [0, 0, 9] }}
      onCreated={({ gl }) => gl.setClearColor(PALETTE.base, 1)}
    >
      <PerformanceMonitor
        flipflops={2}
        bounds={(rate) => (rate > 90 ? [50, 90] : [42, 58])}
        onDecline={() => setTier((t) => Math.min(t + 1, LAST_TIER))}
        onIncline={() => setTier((t) => Math.max(t - 1, device.startTier))}
        onFallback={() => setTier((t) => Math.min(t + 1, LAST_TIER))}
      />
      <World tier={tier} options={device.options} />
      <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType}>
        <Bloom
          mipmapBlur
          intensity={0.7}
          radius={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.4}
        />
        <ChromaticAberration
          offset={quality.aberration ? ABERRATION : NO_ABERRATION}
          radialModulation
          modulationOffset={0.2}
        />
        <Noise blendFunction={BlendFunction.SCREEN} opacity={0.006} />
        <Vignette offset={0.3} darkness={0.7} />
      </EffectComposer>
    </Canvas>
    </div>
  );
}
