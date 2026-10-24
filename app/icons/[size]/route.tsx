import { appIconResponse } from "@/lib/app-icon";

const SIZES = [192, 512];

export function generateStaticParams() {
  return SIZES.map((size) => ({ size: String(size) }));
}

/** Icônes PWA du manifest et des notifications : /icons/192 et /icons/512. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;
  const value = Number(size);
  return appIconResponse(SIZES.includes(value) ? value : 192);
}
