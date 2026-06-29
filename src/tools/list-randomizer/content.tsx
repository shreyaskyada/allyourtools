import React from "react";

export default function ListRandomizerContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>List Randomizer</strong> is a simple but powerful tool to instantly shuffle any list of items, names, or numbers into a completely random order.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Common Uses</h4>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Giveaways & Raffles:</strong> Paste a list of participants and take the top name as the winner.</li>
        <li><strong>Team Sorting:</strong> Shuffle a list of people before dividing them into groups.</li>
        <li><strong>Unbiased Ordering:</strong> Determine the order of presentations or turns fairly without human bias.</li>
      </ul>

      <h4 className="font-semibold text-foreground mt-2">How it works</h4>
      <p>
        Simply paste your list into the input box (ensure each item is on its own line) and hit Randomize. You can randomize it as many times as you like. The tool also provides options to automatically remove blank lines or duplicate items before shuffling.
      </p>
    </div>
  );
}
