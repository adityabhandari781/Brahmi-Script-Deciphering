'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const Page = () => {
  const { id } = useParams();
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [data, setData] = useState<any>(null);
  const [imgSize, setImgSize] = useState({ w: 1, h: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      const res = await axios.post('/api/fetch-result', { id });
      console.log(res.data);
      setData(res.data[0]);
      setLoading(false);
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-[80vh] w-full" />
      </div>
    );
  }

  const {
    image,
    before_char,
    predicted_char,
    after_char,
    reconstructed_text,
    predictions,
    num_missing,
    x1,
    y1,
    x2,
    y2,
    created_at
  } = data;

  // Support both old and new formats
  const text_to_display = reconstructed_text || '';
  const predictions_map = predictions ? (typeof predictions === 'string' ? JSON.parse(predictions) : predictions) : {};
  const has_multiple = num_missing && num_missing > 1;

  const box = x1 && y1 && x2 && y2 && {
    left: x1 * imgSize.w,
    top: y1 * imgSize.h,
    width: (x2 - x1) * imgSize.w,
    height: (y2 - y1) * imgSize.h
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col md:flex-row">

      {/* LEFT PANEL */}
      <div className="w-full md:w-2/5 border-b md:border-r p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Extracted Text</h2>
          <p className="text-sm text-muted-foreground">
            OCR result for selected region
          </p>
        </div>

        <div className="rounded-lg border p-4 bg-muted/40">
          <div className="text-lg leading-relaxed whitespace-pre-wrap">
            <div>
              {/* Support both old format (single char) and new format (multiple) */}
              {text_to_display && Object.keys(predictions_map).length > 0 && (
                <div
                  className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900"
                >
                  <p className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">
                    Found {num_missing || Object.keys(predictions_map).length} missing character{num_missing > 1 ? 's' : ''}
                  </p>
                  <p className="text-lg leading-relaxed break-all">
                    {text_to_display.split('').map((char, idx) => {
                      if (idx in predictions_map) {
                        return (
                          <span
                            key={idx}
                            className="font-bold px-1 rounded bg-yellow-200 dark:bg-yellow-600"
                            title={`Position ${idx}: Predicted "${predictions_map[idx]}"`}
                          >
                            {predictions_map[idx]}
                          </span>
                        );
                      }
                      return char;
                    })}
                  </p>
                  {has_multiple && (
                    <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-700">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Predictions:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(predictions_map).map(([pos, char]) => (
                          <div key={pos} className="text-xs bg-white dark:bg-slate-800 p-2 rounded">
                            <span className="font-mono font-bold">{char}</span>
                            <span className="text-slate-500"> (pos {pos})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Fallback for old format */}
              {(before_char || predicted_char || after_char) && !text_to_display && (
                <div
                  className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900"
                >
                  {before_char}
                  <span className="font-bold px-1 rounded bg-yellow-200 dark:bg-yellow-600">
                    {predicted_char}
                  </span>
                  {predicted_char}
                  {after_char}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Created: {created_at ? new Date(created_at).toLocaleString() : '—'}
            </p>
          </div>
        </div>


      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-3/5 p-4 flex justify-center items-start">
        <div className="relative">
          <img
            ref={imgRef}
            src={image}
            alt="OCR Source"
            className="max-h-[85vh] w-auto rounded-lg shadow"
            onLoad={(e) => {
              setImgSize({
                w: e.currentTarget.clientWidth,
                h: e.currentTarget.clientHeight
              });
            }}
          />

          {/* Bounding Box Overlay */}
          {box && (
            <>
              <div className="absolute inset-0 bg-black/30 pointer-events-none rounded-lg" />
              <div
                className="absolute border-2 border-blue-400 bg-blue-300/20 rounded-md"
                style={box}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
