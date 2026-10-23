import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon generated from the CCMS logo mark.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1F3A",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 40 40" fill="none">
          <path d="M14 6h16a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H14a8 8 0 0 0-8 8v-10a8 8 0 0 1 8-8Z" fill="#FFFFFF" />
          <path d="M14 34h16a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4H14a8 8 0 0 1-8-8v10a8 8 0 0 0 8 8Z" fill="#FFFFFF" />
          <rect x="6" y="14" width="8" height="12" rx="1" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    size,
  );
}
