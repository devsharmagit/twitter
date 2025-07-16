"use client";
import { IKImage } from "imagekitio-next";
import React from "react";

interface ImageProps {
  path?: string;
  width?: number;
  height?: number;
  alt: string;
  className?: string;
  tr?: boolean;
}

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

const Image = ({ path, width, height, alt, className, tr }: ImageProps) => {
  return (
    <IKImage
      urlEndpoint={urlEndpoint}
      path={path}
      {...(tr
        ? { transformation: [{ width: `${width}`, height: `${height}` }] }
        : { width: width, height: height })}
      alt={alt}
      className={className}
      lqip={{ active: true, quality: 20 }}
    />
  );
};

export default Image;
