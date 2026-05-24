"use client"

import { motion } from "framer-motion"
import { FileText, Brain, Boxes, Grid3X3, Sparkles, Atom, Layers } from "lucide-react"
import SectionBadge from "@/components/ui/section-badge"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Synthetic Data Generation",
    info: "1,000 Brahmi sentence images created with precise character coordinate JSONs and advanced texture-based augmentations simulating stone carvings, erosion, and uneven lighting.",
    icon: FileText,
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    title: "Stone-Carving Augmentations",
    info: "Custom pipeline generating stone textures, eroded masks, carved-depth shadows, micro-highlights, sunlight simulation, and camera-age blur for robust domain realism.",
    icon: Layers,
    gradient: "from-stone-400 to-neutral-600",
  },
  {
    title: "YOLO Character Detection",
    info: "YOLOv8n model detecting Brahmi characters with 89% mAP5095, outputting JSON coordinate maps for downstream classification.",
    icon: Grid3X3,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "MobileNet Character Classifier",
    info: "Transfer-learned MobileNetV2 achieving 99.5% validation accuracy using 224×224 crops from detected bounding boxes.",
    icon: Brain,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "Transformer Language Model",
    info: "Masked-character prediction model (97.3% train accuracy) using sliding windows, learned positional embeddings, and a 2-layer encoder.",
    icon: Atom,
    gradient: "from-purple-500 to-fuchsia-600",
  },
  {
    title: "Brahmi Tokenizer",
    info: "Unicode-aware tokenizer using \X grapheme-regex and vocab.json to convert ancient Brahmi characters to stable token IDs.",
    icon: Boxes,
    gradient: "from-indigo-500 to-violet-600",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function Features() {
  return (
    <section className="">
      <div className="text-center">
        <SectionBadge title="Features" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          Brahmi OCR + LM Research System
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          End-to-end pipeline combining synthetic ancient-script data generation, object detection, classification, and Transformer-based sequence modeling.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3"
      >
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              variants={item}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-8",
                "ring-1 ring-foreground/10 backdrop-blur-xl transition-all duration-300 hover:ring-foreground/20",
                "dark:from-muted/30 dark:to-background/80"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                    feature.gradient,
                    "ring-1 ring-foreground/10"
                  )}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              </div>

              <p className="mt-4 text-muted-foreground">{feature.info}</p>

              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                  feature.gradient,
                  "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                )}
              />
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}