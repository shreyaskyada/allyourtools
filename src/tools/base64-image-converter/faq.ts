export const faq = [
  {
    question: "What is Base64 Image Converter?",
    answer: "It is a 2-in-1 media utility that allows you to: 1) Encode images and video clips to Base64 strings or Data URIs, and 2) Decode Base64 data blocks back to play/view them inside the browser and download them as files."
  },
  {
    question: "How does the format auto-detection work in the Decode tab?",
    answer: "If you paste a Data URL (e.g. data:image/png;base64,...), the tool parses the format from the header. If you paste Plain Base64, the decoder reads the first few signature bytes (magic numbers) of the binary file stream to guess whether it is a PNG, JPEG, GIF, WebP, BMP, PDF, MP4, WebM, or OGG file."
  },
  {
    question: "What if the auto-detection fails for Plain Base64 data?",
    answer: "You can use the 'Select Decoded Format Override' dropdown to manually select the correct format (e.g. PNG, JPEG, MP4, WebM, etc.). This updates the preview and sets the correct extension for downloading."
  },
  {
    question: "Are there file size guidelines for browser processing?",
    answer: "All processing happens 100% offline inside your browser. We recommend uploading files under 10MB for images and under 30MB for video clips to ensure fast response times and prevent browser tab freezes."
  }
];
