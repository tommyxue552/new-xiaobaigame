import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { getDownloadById } from "@/features/downloads/api";
import { SITE_NAME } from "@/lib/constants";
import { DownloadJumpView } from "@/components/download/DownloadJumpView";
import type { DownloadDetailResponse } from "@/types/download";

interface DownloadPageProps {
  params: { id: string };
}

const MOBILE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;

function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return MOBILE_REGEX.test(userAgent);
}

export async function generateMetadata({
  params,
}: DownloadPageProps): Promise<Metadata> {
  let data: DownloadDetailResponse;
  try {
    data = await getDownloadById(params.id);
  } catch {
    return { title: `Download | ${SITE_NAME}` };
  }

  return {
    title: `Download ${data.game_title} - ${data.provider.name} | ${SITE_NAME}`,
    description: `Download ${data.game_title} via ${data.provider.name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  let data: DownloadDetailResponse;
  try {
    data = await getDownloadById(params.id);
  } catch {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Download Not Found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This download resource is no longer available.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (isMobileDevice(userAgent)) {
    redirect(data.download_url);
  }

  const qrDataUrl = await QRCode.toDataURL(data.download_url, {
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  return <DownloadJumpView data={data} qrDataUrl={qrDataUrl} />;
}
