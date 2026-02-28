const ShortcutBadge = ({ char }: { char?: string }) => {
    return char ? (
        <span className="bg-[#85858555] rounded-md min-w-[18px] h-[18px] text-[10px] flex items-center justify-center text-[var(--font-color-faded)]">{char}</span>
    ) : null
}

export default ShortcutBadge;