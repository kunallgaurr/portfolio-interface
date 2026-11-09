import profileData from "@/content/profile.json";
import type { Profile } from "@/types/profile";

export const profile = profileData as Profile;

export const { basics, experience, education, skills } = profile;
