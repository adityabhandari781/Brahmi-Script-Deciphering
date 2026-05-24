import { createClient } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    console.log("Received OCR Save Request");
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const coords_xy_raw = formData.get('coords_xy') as string;
    const coords_xy = coords_xy_raw ? JSON.parse(coords_xy_raw) : null;

    const ocr_results_raw = formData.get('ocr_results') as string;
    const ocr_results = ocr_results_raw ? JSON.parse(ocr_results_raw) : null;
    const first_result = Array.isArray(ocr_results) ? ocr_results[0] : ocr_results;
    
    // Support both old format (single char) and new format (multiple chars)
    const reconstructed_text = (first_result?.reconstructed_text ?? formData.get('reconstructed_text') ?? '') as string;
    const predictions_json = first_result?.predictions
      ? JSON.stringify(first_result.predictions)
      : (formData.get('predictions') as string);
    const num_missing = first_result?.num_missing ?? (parseInt(formData.get('num_missing') as string) || 0);
    
    // For backward compatibility, also support old fields
    const before_char = formData.get('before_char') as string;
    const predicted_char = formData.get('predicted_char') as string;
    const after_char = formData.get('after_char') as string;

    // Save image in storage and OCR text in DB logic here
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        // Upload Image
        const { data, error } = await supabase.storage
            .from('Images')
            .upload(`original/image${Date.now()}.png`, image)
        if (error) {
            throw error;
        }
        // Save image and OCR text in DB
        const imageInsert = await supabase.from("image").insert({
            userid: user.id,
            id: data.id,
            originalurl: data.path,
        })
        if (imageInsert.error) {
            throw imageInsert.error;
        }
        const primaryCoords = Array.isArray(coords_xy) ? coords_xy[0] : coords_xy;
        const ocrInsert = await supabase.from("ocr_result").insert({
            userid: user.id,
            imageid: data.id,
            before_char: before_char || '',
            predicted_char: predicted_char || '',
            after_char: after_char || '',
            reconstructed_text: reconstructed_text || '',
            predictions: predictions_json ? JSON.parse(predictions_json) : {},
            num_missing: num_missing,
            x1 : primaryCoords ? primaryCoords.x1 : null,
            y1 : primaryCoords ? primaryCoords.y1 : null,
            x2 : primaryCoords ? primaryCoords.x2 : null,
            y2 : primaryCoords ? primaryCoords.y2 : null,
        })
        if (ocrInsert.error) {
            throw ocrInsert.error;
        }

        return NextResponse.json({ message: "OCR Data Saved Successfully", }, {
            status: 200
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error saving OCR Data", error: (error as Error).message }, { status: 500 });

    }
}