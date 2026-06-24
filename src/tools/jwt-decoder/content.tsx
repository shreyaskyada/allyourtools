import React from "react";

export default function Content() {
  return (
    <>
      <p>
        JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.
      </p>
      <p className="font-semibold text-foreground mt-4">Understanding JWT Structure:</p>
      <ul className="list-disc pl-4 mt-2 space-y-2">
        <li>
          <strong className="text-rose-500">Header:</strong> Typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as HMAC SHA256 (HS256) or RSA SHA256 (RS256).
        </li>
        <li>
          <strong className="text-violet-500">Payload:</strong> Contains the claims. Claims are statements about an entity (typically, the user) and additional data. There are three types of claims: registered, public, and private claims.
        </li>
        <li>
          <strong className="text-cyan-500">Signature:</strong> To create the signature part you must take the encoded header, the encoded payload, a secret (or public/private key), the algorithm specified in the header, and sign that.
        </li>
      </ul>

      <p className="font-semibold text-foreground mt-4">Standard Registered Claims:</p>
      <div className="mt-2 border border-border rounded-lg overflow-x-auto text-xs">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Claim</th>
              <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Full Name</th>
              <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-2 font-mono text-primary font-semibold">iss</td>
              <td className="px-4 py-2 font-semibold">Issuer</td>
              <td className="px-4 py-2 text-muted-foreground">Identifies the principal that issued the JWT.</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-primary font-semibold">sub</td>
              <td className="px-4 py-2 font-semibold">Subject</td>
              <td className="px-4 py-2 text-muted-foreground">Identifies the principal that is the subject of the JWT (e.g. user ID).</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-primary font-semibold">aud</td>
              <td className="px-4 py-2 font-semibold">Audience</td>
              <td className="px-4 py-2 text-muted-foreground">Identifies the recipients that the JWT is intended for.</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-primary font-semibold">exp</td>
              <td className="px-4 py-2 font-semibold">Expiration Time</td>
              <td className="px-4 py-2 text-muted-foreground">The time on or after which the JWT must not be accepted.</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-primary font-semibold">nbf</td>
              <td className="px-4 py-2 font-semibold">Not Before</td>
              <td className="px-4 py-2 text-muted-foreground">The time before which the JWT must not be accepted.</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-primary font-semibold">iat</td>
              <td className="px-4 py-2 font-semibold">Issued At</td>
              <td className="px-4 py-2 text-muted-foreground">The time at which the JWT was issued.</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-primary font-semibold">jti</td>
              <td className="px-4 py-2 font-semibold">JWT ID</td>
              <td className="px-4 py-2 text-muted-foreground">A unique identifier for the token (can be used to prevent replay attacks).</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
