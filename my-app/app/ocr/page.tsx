'use client'
import UploadImage from '@/components/custom/UploadImage';
import { FileContextProvider } from '@/components/providers/FileContextProvider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";

type CropBox = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const MAX_CROPS = 4;

const Page = () => {

  const [imgURL, setImgURL] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const [res, setRes] = useState<any>(null);

  const [crops, setCrops] = useState<CropBox[]>([]);
  const [draftCrop, setDraftCrop] = useState<CropBox | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (files && files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImgURL(url);

      // RESET extracted text & crop boxes when new image is uploaded
      setRes(null);
      setCrops([]);
      setDraftCrop(null);
    }
  }, [files]);


  const getImageRect = () => imgRef.current?.getBoundingClientRect() ?? null;

  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

  // ---------- Start new selection ----------
  const startSelection = (e: React.MouseEvent) => {
    const rect = getImageRect();
    if (!rect) return;

    if (crops.length >= MAX_CROPS) {
      toast.error(`You can select up to ${MAX_CROPS} bounding boxes.`);
      return;
    }

    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const y = clamp(e.clientY - rect.top, 0, rect.height);

    setDraftCrop({
      id: `draft-${Date.now()}`,
      x1: x,
      y1: y,
      x2: x,
      y2: y
    });
    setIsDrawing(true);
  };

  // ---------- Resize selection ----------
  const resizeSelection = (e: React.MouseEvent) => {
    if (!draftCrop || !isDrawing) return;

    const rect = getImageRect();
    if (!rect) return;

    const mx = clamp(e.clientX - rect.left, 0, rect.width);
    const my = clamp(e.clientY - rect.top, 0, rect.height);

    // Ensure left→right and top→bottom
    setDraftCrop({
      ...draftCrop,
      x1: Math.min(draftCrop.x1, mx),
      y1: Math.min(draftCrop.y1, my),
      x2: Math.max(draftCrop.x1, mx),
      y2: Math.max(draftCrop.y1, my)
    });
  };

  const stopDragging = () => {
    if (!draftCrop) {
      setIsDrawing(false);
      return;
    }

    const width = draftCrop.x2 - draftCrop.x1;
    const height = draftCrop.y2 - draftCrop.y1;
    if (width < 4 || height < 4) {
      setDraftCrop(null);
      setIsDrawing(false);
      return;
    }

    setCrops((current) => [...current, draftCrop]);
    setDraftCrop(null);
    setIsDrawing(false);
  };

  const removeCrop = (id: string) => {
    setCrops((current) => current.filter((crop) => crop.id !== id));
  };

  // ---------- SAVE ----------
  const handleSave = async () => {
    if (!files || !files[0]) return;

    const normalizedCrops = imgRef.current
      ? crops.map((crop) => ({
          x1: crop.x1 / imgRef.current!.width,
          y1: crop.y1 / imgRef.current!.height,
          x2: crop.x2 / imgRef.current!.width,
          y2: crop.y2 / imgRef.current!.height
        }))
      : [];

    const formData = new FormData();
    formData.append('image', files[0]);
    formData.append('ocr_results', res ? JSON.stringify(res.results ?? [res]) : '[]');
    formData.append('coords_xy', JSON.stringify(normalizedCrops));
    await axios.post('/api/save', formData);
  };

  // ---------- EXTRACT ----------
  const handleExtract = async () => {
    if (!files || !files[0]) return;

    setIsLoading(true);

    const normalizedCrops = imgRef.current
      ? crops.map((crop) => ({
          x1: crop.x1 / imgRef.current!.width,
          y1: crop.y1 / imgRef.current!.height,
          x2: crop.x2 / imgRef.current!.width,
          y2: crop.y2 / imgRef.current!.height
        }))
      : [];

    if (normalizedCrops.length === 0) {
      toast.error('Please select at least one bounding box.');
      setIsLoading(false);
      return;
    }
    console.log('Crop data to send:', normalizedCrops);

    const formData = new FormData();
    formData.append('image', files[0]);
    formData.append('crops', JSON.stringify(normalizedCrops));


    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ocr`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('OCR Response:', res.data);
      // find predicted character for highlighting
      setRes(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FileContextProvider value={{ files, setFiles }}>
      <div className="relative w-full min-h-screen flex flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-2/5 md:min-h-screen overflow-y-auto border-b md:border-r">
          <div className="flex flex-col gap-6 p-6">
            {/* Instructions Section */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Instructions</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Select up to {MAX_CROPS} damaged regions on the image and click "Extract Text"
              </p>
            </div>

            {/* Upload Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Upload Image</h3>
              <div className="flex gap-3">
                <UploadImage />
              </div>
            </div>

            {/* Action Section */}
            {/* Action Section */}
            <div className="space-y-4">
              <Button
                onClick={handleExtract}
                disabled={!files || isLoading}
                className="w-full"
              >
                {isLoading ? 'Extracting...' : 'Extract Text'}
              </Button>

              {/* Extracted Text Section */}
              {(isLoading || res) && (
                <div className="space-y-3 rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Extracted Text
                  </h4>

                  {/* Skeleton while loading */}
                  {isLoading && (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[90%]" />
                      <Skeleton className="h-4 w-[75%]" />
                    </div>
                  )}

                  {/* OCR Text */}
                  {!isLoading && res && (
                    <AnimatePresence>
                      {Array.isArray(res.results) ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.8 }}
                          className="space-y-3"
                        >
                          {res.results.map((item: any, index: number) => (
                            <div key={index} className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900">
                              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                Region {index + 1}
                              </p>
                              <p className="text-lg leading-relaxed break-all">
                                {item.reconstructed_text?.split('')?.map((char: string, charIndex: number) => {
                                  if (item.predictions && charIndex in item.predictions) {
                                    return (
                                      <span
                                        key={charIndex}
                                        className="font-bold px-1 rounded bg-yellow-200 dark:bg-yellow-600"
                                      >
                                        {item.predictions[charIndex]}
                                      </span>
                                    );
                                  }
                                  return char;
                                })}
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      ) : (res.reconstructed_text && res.predictions) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.8 }}
                          className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900"
                        >
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                              Found {res.num_missing} missing character{res.num_missing > 1 ? 's' : ''}
                            </p>
                            <p className="text-lg leading-relaxed break-all">
                              {res.reconstructed_text.split('').map((char, idx) => {
                                if (idx in res.predictions) {
                                  return (
                                    <motion.span
                                      key={idx}
                                      initial={{ backgroundColor: "#facc15" }}
                                      animate={{ backgroundColor: "#fde047" }}
                                      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                                      className="font-bold px-1 rounded"
                                      title={`Position ${idx}: Predicted "${res.predictions[idx]}"`}
                                    >
                                      {res.predictions[idx]}
                                    </motion.span>
                                  );
                                }
                                return char;
                              })}
                            </p>
                            
                            {/* Show predictions table */}
                            <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-700">
                              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Predictions:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(res.predictions).map(([pos, char]) => (
                                  <div key={pos} className="text-xs bg-white dark:bg-slate-800 p-2 rounded">
                                    <span className="font-mono font-bold">{char}</span>
                                    <span className="text-slate-500"> (pos {pos})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Save Button */}
                  {!isLoading && res && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={handleSave}
                    >
                      Save Results
                    </Button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-3/5 p-4 overflow-y-auto md:min-h-screen">
          <div className="relative">
            
            {imgURL && (
              <>
               <h3 className="font-semibold text-sm mb-2">Input Image</h3>
              <div
                className="relative cursor-crosshair"
                onMouseDown={startSelection}
                onMouseMove={resizeSelection}
                onMouseUp={stopDragging}
              >
               

                <img
                  ref={imgRef}
                  src={imgURL}
                  alt="Uploaded"
                  className="w-full h-auto max-h-[85vh]  "

                />

                {crops.map((crop, index) => (
                  <div
                    key={crop.id}
                    className="absolute border-2 border-blue-400 bg-blue-300/20"
                    style={{
                      left: crop.x1,
                      top: crop.y1,
                      width: crop.x2 - crop.x1,
                      height: crop.y2 - crop.y1
                    }}
                  >
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-600 text-white text-xs shadow"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeCrop(crop.id);
                      }}
                    >
                      {index + 1}
                    </button>
                  </div>
                ))}

                {draftCrop && (
                  <div
                    className="absolute border-2 border-blue-600 bg-blue-300/30"
                    style={{
                      left: draftCrop.x1,
                      top: draftCrop.y1,
                      width: draftCrop.x2 - draftCrop.x1,
                      height: draftCrop.y2 - draftCrop.y1
                    }}
                  />
                )}
                {res && (
                  <div className="mt-4 space-y-6">

                    {/* STEP 1 — CROPPED REGION PREVIEW */}


                    {/* STEP 2 — MASKED IMAGE */}
                    <AnimatePresence>
                      {res.masked_image && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          exit={{ opacity: 0 }}
                        >
                          <h3 className="font-semibold text-sm mb-2">Masked Image</h3>
                          <img
                            src={`data:image/jpeg;base64,${res.masked_image}`}
                            className="rounded-lg shadow"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* STEP 3 — DETECTION IMAGE */}
                    <AnimatePresence>
                      {res.detection_image && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                        >
                          <h3 className="font-semibold text-sm mb-2">Detected Character</h3>
                          <img
                            src={`data:image/jpeg;base64,${res.detection_image}`}
                            className="rounded-lg shadow"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* STEP 4 — CLASSIFICATION RESULTS */}
                    <AnimatePresence>
                      {res.classification_results && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                          className="p-3 bg-slate-900 text-slate-100 rounded-lg text-sm"
                        >
                          <h3 className="font-semibold text-sm mb-2">Classification Raw Output</h3>
                          <pre className="whitespace-pre-wrap text-xs text-left max-h-48 overflow-y-auto">
                            {JSON.stringify(res.classification_results, null, 2)}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* STEP 5 — OCR FINAL RESULT */}

                  </div>
                )}


              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </FileContextProvider>
  );
};

export default Page;
