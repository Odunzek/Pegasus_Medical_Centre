import type { Location } from "../types";

/** One clinic at launch (York, Toronto). Hours per the questionnaire of 4 Oct 2026; Sunday and holidays TBC. */
export const locations: Location[] = [
  {
    slug: "york",
    name: { en: "York clinic", fr: "Clinique de York", pt: "Clínica de York" },
    status: "open",
    address: {
      street: "605 Rogers Road",
      unit: "Unit D5",
      city: "York, Toronto",
      province: "Ontario",
      postal: "M6M 1B9",
    },
    mapPoint: undefined, // to be set from the map once the client confirms the pin
    regularHours: [
      { day: 1, closed: false, open: "09:00", close: "18:00" },
      { day: 2, closed: false, open: "09:00", close: "18:00" },
      { day: 3, closed: false, open: "09:00", close: "18:00" },
      { day: 4, closed: false, open: "09:00", close: "18:00" },
      { day: 5, closed: false, open: "09:00", close: "18:00" },
      { day: 6, closed: false, open: "09:00", close: "14:00" },
      { day: 0, closed: true, tbc: true },
    ],
    hoursExceptions: [],
    waitTime: { text: { en: "[Wait-time line, if the clinic approves publishing it]" }, on: false },
    parking: undefined, // awaiting 4.7
    accessibility: undefined, // awaiting 4.8
    transitNote: undefined,
    services: [
      "family-medicine",
      "walk-in",
      "childrens-health",
      "chronic-disease",
      "older-adults",
      "preventative-health",
      "contraception",
    ],
    photos: {
      exterior: {
        src: "/temp-photos/pmc-11-exterior.jpg",
        alt: { en: "[Temporary photo] Doctor outside a clinic entrance" },
        width: 1067,
        height: 1600,
        temporary: true,
      },
      reception: {
        src: "/temp-photos/pmc-03-reception.jpg",
        alt: { en: "[Temporary photo] Clinic reception desk" },
        width: 1200,
        height: 1600,
        temporary: true,
      },
      gallery: [
        {
          src: "/temp-photos/pmc-05-waiting-room.jpg",
          alt: { en: "[Temporary photo] Waiting room with chairs by a window" },
          width: 1600,
          height: 1067,
          temporary: true,
        },
      ],
    },
    intro: {
      en: "Our clinic is at 605 Rogers Road, Unit D5, in York. Walk in during opening hours or book an appointment.",
    },
  },
];
