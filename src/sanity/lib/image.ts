import createImageUrlBuilder from "@sanity/image-url";

import type { Image } from "sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET as string;

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source: Image) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }

  return imageBuilder?.image(source).auto("format").fit("max");
};

/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 **/
export const urlFor = (source: Image) =>
  createImageUrlBuilder({
    projectId: projectId || "",
    dataset: dataset || "",
  }).image(source);

export const getSource = (asset: any, width: number, height: number) =>
  urlFor(asset).auto("format").quality(90).width(width).height(height).url();
