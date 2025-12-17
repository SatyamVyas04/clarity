import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureSchema, sql } from "@/lib/db";
import { COINS_PER_CORRECT, MAX_COINS_PER_QUIZ } from "@/lib/quiz";

const submissionSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required"),
  answers: z
    .array(
      z.object({
        questionId: z.number().int(),
        selectedOption: z.enum(["A", "B", "C", "D"]),
      })
    )
    .min(1, "At least one answer is required"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { error: "Missing quiz identifier" },
      { status: 400 }
    );
  }

  let payload: z.infer<typeof submissionSchema>;
  try {
    payload = submissionSchema.parse(await request.json());
  } catch (parseError) {
    return NextResponse.json(
      { error: "Invalid submission payload" },
      { status: 400 }
    );
  }

  const walletAddress = payload.walletAddress.toLowerCase();

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
    const questionRows = await sql`
      SELECT
        id,
        prompt,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        explanation
      FROM quiz_questions
      WHERE article_slug = ${slug}
      ORDER BY id ASC;
    `;

    if (questionRows.length === 0) {
      return NextResponse.json(
        { error: "Quiz questions unavailable" },
        { status: 404 }
      );
    }

    const questionsMap = new Map<
      number,
      {
        correctOption: "A" | "B" | "C" | "D";
        prompt: string;
        explanation: string | null;
        options: {
          A: string;
          B: string;
          C: string;
          D: string;
        };
      }
    >();

    for (const row of questionRows) {
      questionsMap.set(Number(row.id), {
        correctOption: row.correct_option as "A" | "B" | "C" | "D",
        prompt: row.prompt as string,
        explanation: (row.explanation as string | null) ?? null,
        options: {
          A: row.option_a as string,
          B: row.option_b as string,
          C: row.option_c as string,
          D: row.option_d as string,
        },
      });
    }

    const dedupedAnswers = new Map<number, "A" | "B" | "C" | "D">();
    for (const answer of payload.answers) {
      if (questionsMap.has(answer.questionId)) {
        dedupedAnswers.set(answer.questionId, answer.selectedOption);
      }
    }

    const results = Array.from(questionsMap.entries()).map(([id, detail]) => {
      const selected = dedupedAnswers.get(id);
      const isCorrect = selected === detail.correctOption;
      return {
        questionId: id,
        prompt: detail.prompt,
        selectedOption: selected ?? null,
        correctOption: detail.correctOption,
        isCorrect,
        explanation: detail.explanation,
        options: detail.options,
      };
    });

    const score = results.filter((result) => result.isCorrect).length;
    const totalQuestions = questionsMap.size;
    const coinsAwarded = score * COINS_PER_CORRECT;

    await sql`
      INSERT INTO user_profiles (wallet_address, total_coins, total_quizzes, updated_at)
      VALUES (${walletAddress}, 0, 0, NOW())
      ON CONFLICT (wallet_address) DO NOTHING;
    `;

    const attemptRows = await sql`
      INSERT INTO quiz_attempts (
        wallet_address,
        article_slug,
        score,
        total_questions,
        coins_awarded
      )
      VALUES (${walletAddress}, ${slug}, ${score}, ${totalQuestions}, ${coinsAwarded})
      RETURNING id, completed_at;
    `;

    await sql`
      UPDATE user_profiles
      SET
        total_coins = total_coins + ${coinsAwarded},
        total_quizzes = total_quizzes + 1,
        updated_at = NOW()
      WHERE wallet_address = ${walletAddress};
    `;

    const profileRows = await sql`
      SELECT total_coins, total_quizzes
      FROM user_profiles
      WHERE wallet_address = ${walletAddress}
      LIMIT 1;
    `;

    const attempt = attemptRows[0];
    const profile = profileRows[0];

    return NextResponse.json({
      attempt: {
        id: Number(attempt.id),
        completedAt: attempt.completed_at as string,
        score,
        totalQuestions,
        coinsAwarded,
      },
      profile: {
        totalCoins: Number(profile.total_coins ?? 0),
        totalQuizzes: Number(profile.total_quizzes ?? 0),
      },
      results,
      reward: {
        perCorrect: COINS_PER_CORRECT,
        maxReward: MAX_COINS_PER_QUIZ,
      },
    });
  } catch (error) {
    console.error("Failed to submit quiz", error);
    return NextResponse.json(
      { error: "Unable to submit quiz" },
      { status: 500 }
    );
  }
}
