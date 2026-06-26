import React from "react";

export default function TimestampConverterContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Timestamp Converter</strong> is a developer utility designed to translate numeric Unix epoch timestamps into formatted, human-readable date-time representations, and vice versa.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Epoch to Human Date</h4>
      <p>
        Input any numeric timestamp. The converter automatically determines whether it is in seconds or milliseconds and displays the corresponding calendar date in your local timezone, UTC timezone, and standardized string notations (ISO 8601, RFC 2822). It also provides a relative time description.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Human Date to Epoch</h4>
      <p>
        Specify a calendar date and time. You can choose whether to interpret the input date in your local system timezone or UTC. The tool generates both 10-digit seconds and 13-digit milliseconds epoch values.
      </p>
    </div>
  );
}
