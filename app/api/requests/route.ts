import { NextResponse } from "next/server";
import { sayHiSchema } from "@/lib/validations";

// In-memory rate limiting tracker for IP/users
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_DAY = 20;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = sayHiSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { receiverId, message } = parseResult.data;

    // Client identifier (e.g. from header or mock IP)
    const clientKey = request.headers.get("x-forwarded-for") || "student_session";
    const now = Date.now();

    const currentUsage = rateLimitMap.get(clientKey);

    if (currentUsage && now < currentUsage.resetAt) {
      if (currentUsage.count >= MAX_REQUESTS_PER_DAY) {
        return NextResponse.json(
          {
            error: `Rate limit reached: Maximum ${MAX_REQUESTS_PER_DAY} connection requests allowed per day for student safety.`,
          },
          { status: 429 }
        );
      }
      currentUsage.count += 1;
    } else {
      rateLimitMap.set(clientKey, { count: 1, resetAt: now + ONE_DAY_MS });
    }

    const remaining = MAX_REQUESTS_PER_DAY - (rateLimitMap.get(clientKey)?.count || 1);

    return NextResponse.json({
      success: true,
      message: "Connection request transmitted successfully.",
      remainingDailyRequests: remaining,
      receiverId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to transmit connection request." },
      { status: 500 }
    );
  }
}
