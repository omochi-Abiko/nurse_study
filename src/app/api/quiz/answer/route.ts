import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { questionId, selectedIndex, isCorrect, category } = await request.json();

    if (!questionId || selectedIndex === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    const answer = await prisma.quizAnswer.create({
      data: {
        userId: session.user.id,
        questionId,
        selectedIndex,
        isCorrect,
        category,
      },
    });

    // 間違えた問題は自動で苦手リストに追加
    if (!isCorrect) {
      const existing = await prisma.weakQuestion.findUnique({
        where: {
          userId_questionId: {
            userId: session.user.id,
            questionId,
          },
        },
      });

      if (!existing) {
        await prisma.weakQuestion.create({
          data: {
            userId: session.user.id,
            questionId,
          },
        });
      }
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Answer error:", error);
    return NextResponse.json(
      { error: "回答の記録に失敗しました" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where: { userId: string; questionId?: string } = {
      userId: session.user.id,
    };

    if (questionId) {
      where.questionId = questionId;
    }

    const answers = await prisma.quizAnswer.findMany({
      where,
      orderBy: { answeredAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ answers });
  } catch (error) {
    console.error("Get answers error:", error);
    return NextResponse.json(
      { error: "回答履歴の取得に失敗しました" },
      { status: 500 }
    );
  }
}
