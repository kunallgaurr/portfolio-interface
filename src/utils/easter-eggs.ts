const STORAGE_KEY = "kunalgaur-easter-eggs";
export const TOTAL_EASTER_EGGS = 8;

function getStored(): string[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as string[]) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function setStored(ids: string[]) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
        // ignore
    }
}

export function getFoundEasterEggIds(): string[] {
    return getStored();
}

/** Returns true if this egg was not already found (newly added). */
export function markEasterEggFound(id: string): boolean {
    const ids = getStored();
    if (ids.includes(id)) return false;
    setStored([...ids, id]);
    return true;
}

export function getRemainingEasterEggCount(): number {
    return Math.max(0, TOTAL_EASTER_EGGS - getStored().length);
}
