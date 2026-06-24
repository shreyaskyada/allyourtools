export const faq = [
  {
    question: "What is a UUID?",
    answer: "A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information in computer systems without significant central coordination.",
  },
  {
    question: "What is the difference between UUID v1 and v4?",
    answer: "UUID v1 is generated using the host computer's MAC address and a timestamp, making it time-based. UUID v4 is generated using random numbers, making it highly random and more private as it doesn't expose physical machine details.",
  },
  {
    question: "Are these UUIDs safe to use in database keys?",
    answer: "Yes. The chance of a collision (generating duplicate UUIDs) is virtually zero, making them excellent choices for database keys, transaction IDs, and identifiers.",
  },
];
