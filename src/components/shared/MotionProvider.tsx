"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

type MotionProviderProps = {
	children: ReactNode;
};

/** Makes every Motion transition respect the reduced-motion setting. */
export function MotionProvider({ children }: MotionProviderProps) {
	return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
