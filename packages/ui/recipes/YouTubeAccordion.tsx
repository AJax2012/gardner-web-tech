import { useEffect, useRef, useState } from "react";
import { YouTubeListItem } from ".";
import {
  AccordionSection,
  AccordionSectionBody,
  AccordionSectionHeader,
  AccordionWrapper,
} from "..";
import * as Pino from "pino";

const logger = Pino.default({ name: "YouTubeAccordion" });

export interface YouTubeAccordionProps {
  youTubeUrls: string[];
}

export const YouTubeAccordion = ({ youTubeUrls }: YouTubeAccordionProps) => {
  const id = "YouTubeVideos";
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [videoContainerWidth, setVideoContainerWidth] = useState(0);
  const [bodyOpen, setBodyOpen] = useState(false);

  // get width of container to set width of video
  useEffect(() => {
    if (videoContainerRef.current) {
      setVideoContainerWidth(videoContainerRef.current.offsetWidth);
    }
  }, [videoContainerRef]);

  if ((youTubeUrls ?? []).length === 0) {
    return <></>;
  }

  return (
    <AccordionWrapper id={id}>
      <AccordionSection bodyOpen={bodyOpen}>
        <AccordionSectionHeader
          id={id}
          toggle={() => setBodyOpen(!bodyOpen)}
          bodyOpen={bodyOpen}
        >
          Videos
        </AccordionSectionHeader>
        <AccordionSectionBody id={id} isOpen={bodyOpen}>
          <div ref={videoContainerRef} className="w-full">
            <ul className="list-none flex flex-wrap -mx-4">
              {(youTubeUrls ?? []).map((url) => (
                <YouTubeListItem
                  youTubeUrl={url}
                  videoContainerWidth={videoContainerWidth}
                  isHidden={!bodyOpen}
                />
              ))}
            </ul>
          </div>
        </AccordionSectionBody>
      </AccordionSection>
    </AccordionWrapper>
  );
};
