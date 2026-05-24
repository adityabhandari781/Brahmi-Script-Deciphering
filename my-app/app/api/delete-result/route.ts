import { createClient } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request : NextRequest){
    const { id } = await request.json();
    try {
        const supabase = await createClient() ;
        const {data : {user} , error} = await supabase.auth.getUser() ;
        if(error || !user){
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { data: record, error: fetchError } = await supabase.from("ocr_result").select("imageid").eq("id", id).single();
        if(fetchError){
            return NextResponse.json({ error: fetchError.message }, { status: 400 });
        }
        if(record && record.imageid){
            // delete image from storage
            // from image table get the image path using the imageid and then delete the image from storage
            const { data: imageData, error: imageError } = await supabase.from("image").select("originalurl").eq("id", record.imageid).single();
            if(imageError){
                return NextResponse.json({ error: imageError.message }, { status: 400 });
            }
            if(imageData && imageData.originalurl){
                // bucket name is Images and the path is originalurl
                const { data: deleteData, error: deleteError } = await supabase.storage.from('Images').remove([imageData.originalurl]);
                if(deleteError){
                    return NextResponse.json({ error: deleteError.message }, { status: 400 });
                }
                // delete the record from image table
                const { data: deleteImageData, error: deleteImageError } = await supabase.from("image").delete().eq("id", record.imageid);
                if(deleteImageError){
                    return NextResponse.json({ error: deleteImageError.message }, { status: 400 });
                }
            }
        }
      
        return NextResponse.json({ message: 'Record deleted successfully' }, { status: 200 }) ;
    } catch (error) {   
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });   
    }
}