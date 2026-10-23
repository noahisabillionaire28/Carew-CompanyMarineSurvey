// "In the Field" media grid on the home page.
// Drop files into /public/field/ and list them here.
// type: "image" (jpg/png/webp) or "video" (mp4, muted + looping).
// shape: "landscape" = one 4:3 tile, "portrait" = tall tile spanning two rows (2:3).
// Keep the grid even: landscapes + 2 x portraits should be a multiple of 6
// (fills 3 columns on desktop and 2 on mobile with no gaps).
// Set src to "" to show a "Photo coming soon" placeholder.

export type FieldMedia = {
  src: string;
  alt: string;
  type: "image" | "video";
  shape?: "landscape" | "portrait";
};

export const fieldMedia: FieldMedia[] = [
  {
    src: "/field/ship-bow-inspection.webp",
    alt: "Surveyor in a hard hat inspecting a ship's bow in dry dock",
    type: "image",
    shape: "portrait",
  },
  {
    src: "/field/deck-chain-work.webp",
    alt: "Crew member in a hard hat working with heavy chain on deck",
    type: "image",
    shape: "landscape",
  },
  {
    src: "/field/deck-crew-at-sea.webp",
    alt: "Crew in safety gear on a ship's bow deck at sea",
    type: "image",
    shape: "portrait",
  },
  { src: "", alt: "Container stacks at the Port of Long Beach", type: "image" },
];
