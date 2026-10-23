// Photos for the equipment marquee. Files live in /public/equipment/ and are
// all cropped to the same 4:3 size (1600x1200). Leave src "" to show a
// placeholder until a photo is ready.

export type EquipmentPhoto = {
  type: string;
  src: string;
  alt: string;
};

export const equipmentPhotos: EquipmentPhoto[] = [
  {
    type: "Dry Containers",
    src: "/equipment/dry-containers.webp",
    alt: "Blue dry freight container with doors open",
  },
  {
    type: "Reefer Containers",
    src: "/equipment/reefer-containers.webp",
    alt: "Refrigerated reefer container with its cooling unit and controller",
  },
  {
    type: "Marine Chassis",
    src: "/equipment/marine-chassis.webp",
    alt: "Blue tandem-axle marine container chassis",
  },
  {
    type: "IMO Tanks",
    src: "/equipment/imo-tanks.webp",
    alt: "Stainless steel IMO tank container in a blue frame",
  },
  { type: "Power Packs", src: "", alt: "Power pack generator set" },
  { type: "Offshore Containers", src: "", alt: "Offshore container" },
];
