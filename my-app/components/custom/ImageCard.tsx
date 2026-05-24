'use client'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function ImageCard({ id, imageUrl, text, created_at }) {
  const truncated = text.length > 160 ? text.substring(0, 160) + "..." : text;
  const router = useRouter();
      const queryClient = useQueryClient() ;

  const handleDelete = async () => {
    try {
      const res = await axios.post('/api/delete-result', { id }) ;
      await queryClient.invalidateQueries({
        queryKey: ['fetch']
      }) ;
      console.log("Delete response:", res.data);
    } catch (error) {
      console.log("Error deleting record:", error);
    }

  }
  return (
    <Card className="w-full max-w-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-card border">
      
      {/* Image */}
      <CardHeader className="p-0">
        <div className="w-full h-60 overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt="Uploaded"
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </CardHeader>

      {/* Text */}
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground leading-relaxed relative max-h-20 overflow-hidden pr-1">
          {truncated}

          {text.length > 160 && (
            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-background to-transparent" />
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-6 pt-0 flex flex-col space-y-3">
        <p className="text-xs text-gray-500">
          Created: {created_at ? new Date(created_at).toLocaleString() : "Unknown"}
        </p>

        <div className="flex flex-col space-y-2 w-full">
          <Button
            variant="default"
            className="w-full rounded-xl text-sm py-4 shadow hover:shadow-md transition"
            onClick={() => router.push(`/result/${id}`)}
          >
            View Full Text
          </Button>

          <Button
            onClick={handleDelete}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm py-3 shadow transition"
          >
            Delete
          </Button>
        </div>
      </CardFooter>

    </Card>
  );
}
