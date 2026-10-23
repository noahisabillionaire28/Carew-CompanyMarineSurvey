
export type ServiceIconName =
  | "ShieldCheck"
  | "ClipboardCheck"
  | "ArrowDownToLine"
  | "Repeat"
  | "ArrowUpFromLine"
  | "Gauge"
  | "SearchCheck"
  | "Warehouse";

export type Service = {
  slug: string;
  title: string;
  icon: ServiceIconName;
  short: string;
  long: string[];
};

export const services: Service[] = [
  {
    slug: "csc-inspection",
    title: "CSC Inspection & Certification",
    icon: "ShieldCheck",
    short:
      "Safety inspections so containers can keep moving under the international CSC safety convention.",
    long: [
      "The CSC (Convention for Safe Containers) requires freight containers to be examined at set intervals to confirm they are structurally sound and safe to transport. A CSC inspection checks the frame, corner castings, floor, roof, walls and doors against the convention's standards.",
      "Shipping lines, container leasing companies and depots typically request CSC inspections to keep equipment compliant and in circulation, and to address containers with expired or missing safety plates.",
    ],
  },
  {
    slug: "iicl-surveys",
    title: "IICL Surveys",
    icon: "ClipboardCheck",
    short:
      "Condition surveys performed to the Institute of International Container Lessors' inspection criteria.",
    long: [
      "IICL surveys follow the inspection and repair criteria published by the Institute of International Container Lessors, the standard most leasing companies use to judge whether a container is in acceptable condition.",
      "Leasing companies and shipping lines commonly request IICL surveys when equipment changes hands, so both parties agree on the condition of each unit and any repairs that are required.",
    ],
  },
  {
    slug: "on-hire-surveys",
    title: "On-Hire Surveys",
    icon: "ArrowDownToLine",
    short:
      "Documenting a container's condition at the moment it goes out on lease.",
    long: [
      "An on-hire survey records the condition of a container or chassis at the start of a lease. It establishes a clear baseline so that any damage found later can be fairly attributed.",
      "Container leasing companies and the shipping lines taking equipment on hire both rely on an independent on-hire survey to avoid disputes at the end of the lease.",
    ],
  },
  {
    slug: "in-service-surveys",
    title: "In-Service Surveys",
    icon: "Repeat",
    short:
      "Checking the condition of equipment while it is actively in use.",
    long: [
      "In-service surveys inspect containers and intermodal equipment while they are in active circulation, identifying damage, wear and maintenance needs before they become safety or cargo problems.",
      "Shipping lines, leasing companies and terminals use in-service surveys to monitor fleet condition, plan repairs and keep equipment working.",
    ],
  },
  {
    slug: "off-hire-surveys",
    title: "Off-Hire Surveys",
    icon: "ArrowUpFromLine",
    short:
      "Recording damage and repair needs when a container comes off lease.",
    long: [
      "An off-hire survey is carried out when leased equipment is returned. It documents the unit's condition, compares it against the on-hire baseline and lists the repairs needed to bring it back to the agreed return standard.",
      "Leasing companies, shipping lines and depots use off-hire surveys to settle repair responsibility quickly and accurately.",
    ],
  },
  {
    slug: "periodic-tank-testing",
    title: "Periodic Tank Testing",
    icon: "Gauge",
    short:
      "Scheduled inspection and testing of IMO tank containers.",
    long: [
      "Tank containers used to carry liquids and gases must be inspected and tested at regular intervals. Periodic tank testing examines the shell, frame, valves and fittings and verifies the tank still meets its design and safety requirements.",
      "Tank operators, leasing companies and depots request periodic testing to keep tanks certified and in service.",
    ],
  },
  {
    slug: "accident-investigations",
    title: "Accident Investigations",
    icon: "SearchCheck",
    short:
      "Independent findings when equipment or cargo is damaged in an incident.",
    long: [
      "When a container, chassis or its cargo is damaged in an accident, an independent investigation establishes what happened, documents the damage and estimates the cost to repair or replace.",
      "Insurers, shipping lines, leasing companies and terminals use accident investigation reports to support claims and resolve liability.",
    ],
  },
  {
    slug: "depot-terminal-audits",
    title: "Depot / Terminal Audits",
    icon: "Warehouse",
    short:
      "Reviewing how depots and terminals inspect, repair and handle equipment.",
    long: [
      "A depot or terminal audit reviews the facility's inspection, repair and handling practices against the standards its customers expect, including record keeping, repair quality and estimate accuracy.",
      "Shipping lines and leasing companies typically commission audits of the depots and terminals that store and repair their equipment.",
    ],
  },
];
