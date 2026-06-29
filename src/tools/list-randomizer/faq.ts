export const faq = [
  {
    question: "How does the randomizer work?",
    answer: "This tool uses a cryptographic randomization algorithm (similar to the Fisher-Yates shuffle) running directly in your browser. It takes your input list, separates each line, and randomly rearranges the order of those lines."
  },
  {
    question: "Is this fair for giveaways and drawings?",
    answer: "Yes, it is statistically unbiased. Because it relies on standard JavaScript math randomization within your browser, every item in the list has an equal probability of landing in any position."
  },
  {
    question: "Are my lists sent to a server?",
    answer: "No. The randomization happens entirely client-side. Your lists, names, or data are never uploaded to any server or saved anywhere."
  }
];
