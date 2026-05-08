import type { Channel } from "@/lib/mockData";

export function ChannelIcon({ channel, className = "" }: { channel: Channel; className?: string }) {
  const map: Record<Channel, { bg: string; iconUrl: string }> = {
    whatsapp: { bg: "bg-[#25D366]", iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/whatsapp.svg" },
    instagram: { bg: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]", iconUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/instagram.svg" },
    linkedin: { bg: "bg-white", iconUrl: "https://s.magecdn.com/social/tc-linkedin.svg" },
  };
  const c = map[channel];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ring-2 ring-background overflow-hidden ${c.bg} ${className}`}
    >
      <img src={c.iconUrl} alt={channel} className={`w-2/3 h-2/3 object-contain ${channel !== 'linkedin' ? 'invert brightness-0 filter' : ''}`} />
    </span>
  );
}
