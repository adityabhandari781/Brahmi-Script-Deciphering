import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Hero1Props {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
}

const Hero = ({
  badge = "🧱 AI-Powered Archaeological Restoration",
  heading = "Reviving Lost Artifacts",
  description = "A cutting-edge platform to reconstruct damaged archaeological images, restore inscriptions, and preserve history with digital precision.",
  buttons = {
    primary: {
      text: "Get started",
      url: "/ocr",
    },
    secondary: {
      text: "View on GitHub",
      url: "https://github.com/adityabhandari781/Inscription-character-deciphering-for-Brahmi-script.git",
    },
  },
  image = {
    src: "/icon.png",
    alt: "Hero section demo image showing interface components",
  },
}: Hero1Props) => {
  return (
    <section>
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Badge variant="outline">
                {badge}
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>
            )}
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {heading}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <Image
            src={image.src}
            alt={image.alt}
            className="max-h-96 w-full rounded-md object-cover"
            width={540}
            height={360}

          />
        </div>
      </div>
    </section>
  );
};

export { Hero };
