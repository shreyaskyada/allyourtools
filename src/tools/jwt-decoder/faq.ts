export const faq = [
  {
    question: "Is my JWT token data safe on this site?",
    answer: "Yes, absolutely. The decoding, claims parsing, and signature verification are processed 100% locally in your browser using client-side JavaScript. Your token, payload data, and secret keys never leave your machine.",
  },
  {
    question: "What are the three parts of a JWT?",
    answer: "A JSON Web Token is composed of three parts separated by dots (.): Header (specifies the algorithm and token type), Payload (contains the claims/data), and Signature (used to verify that the sender is who it says it is and to ensure the message wasn't changed along the way).",
  },
  {
    question: "How does signature verification work in this tool?",
    answer: "For HMAC algorithms (like HS256), you can input a text or Base64 secret. For RSA and ECDSA (like RS256 or ES256), you can paste a public key in PEM format. The browser uses the Web Crypto API to cryptographically verify if the signature matches the message header and payload.",
  },
  {
    question: "Why does the tool show my token is expired?",
    answer: "A JWT often contains an expiration claim ('exp') which is a Unix timestamp. The tool compares this timestamp with your computer's current time to determine if the token has expired and displays how much time remains or has elapsed since expiration.",
  },
];
