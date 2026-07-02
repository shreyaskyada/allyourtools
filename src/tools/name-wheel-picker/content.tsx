import React from "react";

export default function NameWheelPickerContent() {
  return (
    <div className="flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
      <section>
        <h2 className="text-xl font-bold text-foreground mb-2">What is the Random Name Picker?</h2>
        <p>
          The <strong>Random Name Picker</strong> (also known as a <em>Wheel of Names</em> or <em>Spin the Wheel picker</em>) is a free, interactive tool designed to randomly select a name or item from a custom list. It acts as a digital unbiased hat, ensuring fairness when drawing names for prizes, picking a student to answer a question, or making random decisions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">Popular Uses for the Wheel Picker</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-foreground">Student Random Picker:</strong> Teachers use the wheel as a fun, engaging way to pick students for classroom activities or presentations.
          </li>
          <li>
            <strong className="text-foreground">Giveaways & Raffles:</strong> Spin the wheel to select a random winner fairly and add a touch of excitement to your social media or live streams.
          </li>
          <li>
            <strong className="text-foreground">Team Building & Meetings:</strong> Quickly decide who leads the daily stand-up, takes meeting notes, or picks the next team-building exercise.
          </li>
          <li>
            <strong className="text-foreground">Daily Decision Making:</strong> Can&apos;t decide where to eat lunch? Let the wheel of names decide for you!
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-2">How to Use the Spin Wheel</h2>
        <p>
          Simply paste or type your list of names into the roster box (one name per line). The spinning wheel will automatically render a slice for each name you enter. Once your list is ready, click the massive center &quot;Spin&quot; button to watch the wheel turn and announce a random winner!
        </p>
      </section>
    </div>
  );
}
