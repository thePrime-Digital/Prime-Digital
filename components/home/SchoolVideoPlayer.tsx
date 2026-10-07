"use client";

import {
  Share2,
} from "lucide-react";

import {
  useState,
} from "react";

export default function SchoolVideoPlayer() {
  const [
    copied,
    setCopied,
  ] = useState(false);

  async function handleShare() {
    const shareData = {
      title:
        "Prime Digital School",

      text:
        "See how we Learn, Build & Grow at Prime Digital School.",

      url:
        window.location.href,
    };

    try {
      if (
        navigator.share
      ) {
        await navigator.share(
          shareData,
        );

        return;
      }

      await navigator.clipboard.writeText(
        window.location.href,
      );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        2000,
      );
    } catch (
      error
    ) {
      console.error(
        "Unable to share video:",
        error,
      );
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[22px] bg-black shadow-[0_22px_55px_rgba(15,23,42,0.2)]">
      <video
        controls
        playsInline
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(
          event,
        ) =>
          event.preventDefault()
        }
        className="aspect-video w-full bg-black object-cover"
      >
        <source
          src="/videos/prime-digital-school-intro.mp4"
          type="video/mp4"
        />

        Your browser does not support the video tag.
      </video>

      {/* SHARE */}

      <button
        type="button"
        onClick={
          handleShare
        }
        className="absolute right-4 top-4 z-20 inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-black/65 px-4 text-xs font-bold text-white shadow-lg backdrop-blur-md transition duration-300 hover:bg-[#8f0024]"
        aria-label="Share Prime Digital School"
      >
        <Share2
          size={15}
          strokeWidth={
            2.2
          }
        />

        {copied
          ? "Link Copied"
          : "Share"}
      </button>
    </div>
  );
}