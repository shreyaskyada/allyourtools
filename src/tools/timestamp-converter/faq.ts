export const faq = [
  {
    question: "What is a Unix timestamp?",
    answer: "A Unix timestamp (also known as Epoch time or Posix time) is the number of seconds that have elapsed since January 1, 1970 (Midnight UTC/GMT), not counting leap seconds."
  },
  {
    question: "How does the tool distinguish between seconds and milliseconds?",
    answer: "Seconds-based timestamps typically have 10 digits (e.g., 1719310800), while milliseconds-based timestamps have 13 digits (e.g., 1719310800000). The tool automatically detects the length of your input to determine the correct unit, but you can also manually override it."
  },
  {
    question: "What timezone formats are supported?",
    answer: "The tool displays date conversions in your local system timezone, standard UTC (Coordinated Universal Time), ISO 8601 format, and RFC 2822 format. You can also convert custom dates to timestamps using either your local timezone or UTC."
  },
  {
    question: "Is relative time supported?",
    answer: "Yes, the tool computes relative human-friendly time terms (e.g., '5 minutes ago', 'in 3 hours', 'yesterday') to help you quickly understand the chronological distance to the timestamp."
  }
];
