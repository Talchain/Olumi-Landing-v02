export interface ISanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}
