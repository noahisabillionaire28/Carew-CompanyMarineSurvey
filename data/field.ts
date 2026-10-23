// "In the Field" media grid on the home page.
// Drop files into /public/field/ and list them here.
// type: "image" (jpg/png/webp) or "video" (mp4, muted + looping).
// Set src to "" to show a "Photo coming soon" placeholder.

export type FieldMedia = {
  src: string;
  alt: string;
  type: "image" | "video";
};

export const fieldMedia: FieldMedia[] = [
  { src: "", alt: "Container inspection at the Port of Los Angeles", type: "image" },
  { src: "", alt: "Reefer container survey", type: "image" },
  { src: "", alt: "Marine chassis inspection", type: "image" },
  { src: "", alt: "IMO tank container testing", type: "image" },
  { src: "", alt: "Depot audit walkthrough", type: "image" },
  { src: "", alt: "Container stacks at the Port of Long Beach", type: "image" },
];
