"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { bus, runtime } from "@/lib/runtime";

// The scene touches WebGL and window, so it never runs on the server.
const Scene = dynamic(() => import("@/three/Scene"), { ssr: false });

let support: boolean | null = null;
function detectWebGL() {
  if (support === null) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      support = Boolean(gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      support = false;
    }
  }
  return support;
}
const subscribe = () => () => {};

/** Shown when WebGL is missing or the scene fails to start. */
function StaticBackdrop() {
  useEffect(() => {
    document.documentElement.dataset.gl = "off";
    if (runtime.gl !== "unavailable") {
      runtime.gl = "unavailable";
      bus.emit("gl");
    }
  }, []);
  return <div className="static-backdrop" aria-hidden="true" />;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticBackdrop /> : this.props.children;
  }
}

/** The fixed background layer: the live scene, or a static stand-in. */
export function Stage() {
  const supported = useSyncExternalStore(subscribe, detectWebGL, () => null);
  if (supported === null) return null;
  if (!supported) return <StaticBackdrop />;
  return (
    <SceneBoundary>
      <Scene />
    </SceneBoundary>
  );
}
