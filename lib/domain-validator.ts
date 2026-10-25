/**
 * Validates that an email ends with one of the allowed university domains.
 */
export function getAllowedDomains(): string[] {
  const envDomains =
    process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS ||
    process.env.ALLOWED_EMAIL_DOMAINS ||
    "lpu.in,thapar.edu,iitd.ac.in,campus.edu";

  return envDomains
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

export function validateUniversityEmail(email: string): {
  isValid: boolean;
  domain: string;
  error?: string;
} {
  if (!email || !email.includes("@")) {
    return {
      isValid: false,
      domain: "",
      error: "Please enter a valid email address.",
    };
  }

  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) {
    return {
      isValid: false,
      domain: "",
      error: "Invalid email format.",
    };
  }

  const domain = parts[1];
  const allowed = getAllowedDomains();

  const isMatch = allowed.some((d) => domain === d || domain.endsWith("." + d));

  if (!isMatch) {
    return {
      isValid: false,
      domain,
      error: `Only university student emails are permitted. Allowed domains: ${allowed
        .map((d) => "@" + d)
        .join(", ")}`,
    };
  }

  return {
    isValid: true,
    domain,
  };
}
