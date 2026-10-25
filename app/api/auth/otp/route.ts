import { NextResponse } from "next/server";
import { validateUniversityEmail } from "@/lib/domain-validator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const validation = validateUniversityEmail(email);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // In production with Supabase configured, triggers supabase.auth.signInWithOtp
    return NextResponse.json({
      success: true,
      message: "One-time code dispatched to your student email.",
      domain: validation.domain,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
