import React from "react";

export default function PasswordGeneratorContent() {
  return (
    <div className="flex flex-col gap-4 text-xs md:text-sm">
      <p>
        <strong>Password Generator</strong> is a secure, client-side utility designed to create strong, random passwords instantly. 
      </p>

      <h4 className="font-semibold text-foreground mt-2">100% Client-Side Security</h4>
      <p>
        Your privacy is paramount. This tool operates entirely within your browser using JavaScript. No passwords are ever transmitted over the network or saved to a server. You can even use this tool while offline.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Customizable Complexity</h4>
      <p>
        Tailor your passwords to meet specific requirements. You can adjust the password length and choose which character sets to include (uppercase, lowercase, numbers, and symbols) to ensure compatibility with any platform's password policy.
      </p>

      <h4 className="font-semibold text-foreground mt-2">Real-Time Strength Evaluation</h4>
      <p>
        As you tweak the settings, the built-in strength meter provides immediate feedback on the robustness of your generated password, helping you create credentials that are highly resistant to cracking.
      </p>
    </div>
  );
}
