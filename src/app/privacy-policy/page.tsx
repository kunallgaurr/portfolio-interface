import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen px-[10%] py-[5%]">
            <div className="flex flex-col gap-4 w-[60%]">
                <span className="text-[var(--font-color-faded)] font-semibold text-xl">
                    Your privacy matters to me.
                </span>

                <span>
                    This website is built to showcase my work, not to collect your data. I do not intentionally collect, store, or track any personal information unless it is explicitly stated (for
                    example, if you choose to contact me directly).
                </span>

                <span>I don’t run hidden trackers, I don’t sell data, and I’m not interested in building a secret database of visitors.</span>

                <span>
                    If you choose to share information with me — such as through a contact form or email — it will only be used to respond to you. I will never share your information with third
                    parties without your clear permission.
                </span>

                <span>In short: You’re here to explore my work, not to be analyzed.</span>

                <span>If anything ever changes regarding data collection, this page will be updated transparently.</span>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
