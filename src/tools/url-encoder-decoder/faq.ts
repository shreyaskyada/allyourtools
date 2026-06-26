export const faq = [
  {
    question: "What is URL Encoding?",
    answer: "URL Encoding (or percent-encoding) is a mechanism for encoding information in a Uniform Resource Identifier (URI). Characters that are not allowed in a URL, such as spaces or special symbols, are replaced with a '%' followed by their hexadecimal equivalent."
  },
  {
    question: "Why do I need to encode URLs?",
    answer: "URLs can only be sent over the Internet using the ASCII character-set. Since URLs often contain characters outside the ASCII set, they must be converted into a valid format. Encoding ensures data is transmitted safely without breaking the link structure."
  },
  {
    question: "Is this tool completely secure?",
    answer: "Yes! All encoding and decoding happens directly inside your web browser (client-side). Your data is never sent to our servers or stored anywhere."
  },
  {
    question: "What is the difference between encodeURI and encodeURIComponent?",
    answer: "encodeURI is meant to encode a full URL and preserves characters that have special meaning (like '?', '#', '/', ':'). encodeURIComponent encodes the entire string, making it useful for encoding a specific parameter within a URL query string."
  }
];
