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
        const { data, error: fetchError } = await supabase.from("ocr_result").select(`
            before_char,
            predicted_char,
            after_char,
            x1 ,
            y1 ,
            x2 ,
            y2 ,
            image : image (
                url : originalurl
            ),
            created_at
        `).eq("id" , id)
        if(fetchError){
            return NextResponse.json({ error: fetchError.message }, { status: 400 });
        }
        if(data.length === 0){
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }
        const result = data.map(item => ({
            before_char: item.before_char,
            predicted_char: item.predicted_char,
            after_char: item.after_char,
            x1: item.x1,
            y1: item.y1,
            x2: item.x2,
            y2: item.y2,
            image: supabase.storage.from('Images').getPublicUrl(item.image.url!).data.publicUrl,
            created_at: item.created_at
        })) ;
        return NextResponse.json(result , { status: 200 }) ;
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });   
    }
}