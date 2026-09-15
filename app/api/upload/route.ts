import { NextResponse } from "next/server";
import { SANITY_CONFIG } from "@/src/service/sanityConfig";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "업로드할 파일이 없습니다." },
        { status: 400 }
      );
    }

    if (!SANITY_CONFIG.token) {
      return NextResponse.json(
        { success: false, message: ".env.local에 SANITY_API_TOKEN 이 설정되어 있지 않습니다." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const url = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/assets/images/${SANITY_CONFIG.dataset}?filename=${encodeURIComponent(
      file.name
    )}`;

    const sanityRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "image/jpeg",
        Authorization: `Bearer ${SANITY_CONFIG.token}`,
      },
      body: buffer,
    });

    if (!sanityRes.ok) {
      const errText = await sanityRes.text();
      throw new Error(`Sanity Asset Upload Failed (${sanityRes.status}): ${errText}`);
    }

    const data = await sanityRes.json();
    const asset = data.document;

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "이미지 업로드 실패" },
      { status: 500 }
    );
  }
}
