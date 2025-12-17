import { type NextRequest, NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const walletAddressParam = searchParams.get("walletAddress");

  if (!walletAddressParam) {
    return NextResponse.json(
      { error: "walletAddress query parameter required" },
      { status: 400 }
    );
  }

  const walletAddress = walletAddressParam.toLowerCase();

  try {
    await ensureSchema();
  } catch (schemaError) {
    console.error("Failed to ensure schema", schemaError);
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 500 }
    );
  }

  try {
    const profileRows = await sql`
      SELECT total_coins, total_quizzes
      FROM user_profiles
      WHERE wallet_address = ${walletAddress}
      LIMIT 1;
    `;

    const historyRows = await sql`
      SELECT
        qa.id,
        qa.article_slug,
        qa.score,
        qa.total_questions,
        qa.coins_awarded,
        qa.completed_at,
        a.title,
        a.image_url
      FROM quiz_attempts qa
      JOIN articles a ON a.slug = qa.article_slug
      WHERE qa.wallet_address = ${walletAddress}
      ORDER BY qa.completed_at DESC
      LIMIT 10;
    `;

    return NextResponse.json({
      profile: profileRows.length
        ? {
            totalCoins: Number(profileRows[0].total_coins ?? 0),
            totalQuizzes: Number(profileRows[0].total_quizzes ?? 0),
          }
        : {
            totalCoins: 0,
            totalQuizzes: 0,
          },
      attempts: historyRows.map((row) => ({
        id: Number(row.id),
        articleSlug: row.article_slug as string,
        score: Number(row.score),
        totalQuestions: Number(row.total_questions),
        coinsAwarded: Number(row.coins_awarded),
        completedAt: row.completed_at as string,
        title: row.title as string,
        imageUrl: row.image_url as string | null,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch quiz history", error);
    return NextResponse.json(
      { error: "Unable to load quiz history" },
      { status: 500 }
    );
  }
}
