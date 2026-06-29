export const faq = [
  {
    question: "How random are the numbers generated?",
    answer:
      "The tool uses the browser's built-in cryptographic API (crypto.getRandomValues()) whenever possible to generate highly secure, pseudo-random numbers. This makes it suitable for giveaways, lotteries, and games where fairness is critical.",
  },
  {
    question: "Can I generate negative numbers?",
    answer:
      "Yes! Simply set the minimum value to a negative number, and the generator will happily produce random numbers within that negative range.",
  },
  {
    question: "What is the maximum range I can set?",
    answer:
      "You can generate numbers anywhere between -999,999,999 and 999,999,999 safely.",
  },
  {
    question: "Is this tool safe to use for sensitive data?",
    answer:
      "Absolutely. Everything is generated locally in your browser. No data is sent to or stored on any external servers.",
  },
];
