import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const crop = formData.get('crop');
    console.log('Received crop data:', crop);
    return NextResponse.json({ message: "OCR Processing Not Implemented" }, { status: 200 });

}