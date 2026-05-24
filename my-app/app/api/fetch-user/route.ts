import { createClient } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    // Return all images uploaded by user along with their OCR text
    try {
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const { data, error } = await supabase
            .from("ocr_result")
            .select(`
      id,
      before_char,
      predicted_char,
      after_char,
      created_at,
      image :image (
        url : originalurl
            )
    `)
            .eq("userid", user?.id)
            .order("created_at", { ascending: false });

        console.log(data)
        const flatData = data?.map(item => ({
            id: item.id,
            text: item.before_char + item.predicted_char + item.after_char,
            image: item.image?.url ?? null,
            created_at: item.created_at
        }));


        // convert type of data to desired format
        console.log(flatData)


        // for each image, get its transformed image 
        // const res =  JSON.parse(JSON.stringify(data)) ;
        const result = flatData?.map((item) => {

            return {
                ...item,
                image: supabase.storage.from('Images').getPublicUrl(item.image).data.publicUrl
            }
        })
        // console.log("Fetched user images:", result);
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("Error fetching user images:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}