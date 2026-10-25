import test from "node:test";
import assert from "node:assert/strict";

function validateTestEmail(email, allowedDomains = ["lpu.in", "thapar.edu", "iitd.ac.in", "campus.edu"]) {
  if (!email || !email.includes("@")) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) {
    return { isValid: false, error: "Invalid email format." };
  }
  const domain = parts[1];
  const isMatch = allowedDomains.some((d) => domain === d || domain.endsWith("." + d));
  if (!isMatch) {
    return {
      isValid: false,
      domain,
      error: `Only university student emails are permitted. Allowed domains: ${allowedDomains
        .map((d) => "@" + d)
        .join(", ")}`,
    };
  }
  return { isValid: true, domain };
}

test("Domain Validator: Accepts accredited university email domains", () => {
  const emails = [
    "student@lpu.in",
    "aarav.sharma@lpu.in",
    "researcher@cse.iitd.ac.in",
    "john@thapar.edu",
    "lead@campus.edu",
  ];

  emails.forEach((email) => {
    const res = validateTestEmail(email);
    assert.equal(res.isValid, true, `Should accept valid university email: ${email}`);
  });
});

test("Domain Validator: Rejects non-university domains with clear guidance", () => {
  const rejectedEmails = [
    "user@gmail.com",
    "hacker@yahoo.com",
    "ceo@outlook.com",
    "bot@randomdomain.xyz",
  ];

  rejectedEmails.forEach((email) => {
    const res = validateTestEmail(email);
    assert.equal(res.isValid, false, `Should reject consumer email: ${email}`);
    assert.match(res.error, /Only university student emails are permitted/);
    assert.match(res.error, /@lpu.in/);
  });
});
