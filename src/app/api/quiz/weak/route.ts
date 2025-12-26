import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const weakQuestions = await prisma.weakQuestion.findMany({
      where: { userId: session.user.id },
      orderBy: { addedAt: "desc" },
    });

    return NextResponse.json({ weakQuestions });
  } catch (error) {
    console.error("Get weak questions error:", error);
    return NextResponse.json(
      { error: "苦手問題の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { questionId } = await request.json();

    if (!questionId) {
      return NextResponse.json(
        { error: "問題IDが必要です" },
        { status: 400 }
      );
    }

    // 既に存在する場合はそのまま返す
    const existing = await prisma.weakQuestion.findUnique({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ weakQuestion: existing });
    }

    const weakQuestion = await prisma.weakQuestion.create({
      data: {
        userId: session.user.id,
        questionId,
      },
    });

    return NextResponse.json({ weakQuestion });
  } catch (error) {
    console.error("Add weak question error:", error);
    return NextResponse.json(
      { error: "苦手問題の追加に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json(
        { error: "問題IDが必要です" },
        { status: 400 }
      );
    }

    await prisma.weakQuestion.delete({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete weak question error:", error);
    return NextResponse.json(
      { error: "苦手問題の削除に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { questionId } = await request.json();

    if (!questionId) {
      return NextResponse.json(
        { error: "問題IDが必要です" },
        { status: 400 }
      );
    }

    // 復習回数を増やし、最終復習日を更新
    const weakQuestion = await prisma.weakQuestion.update({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId,
        },
      },
      data: {
        reviewCount: { increment: 1 },
        lastReviewedAt: new Date(),
      },
    });

    return NextResponse.json({ weakQuestion });
  } catch (error) {
    console.error("Update weak question error:", error);
    return NextResponse.json(
      { error: "苦手問題の更新に失敗しました" },
      { status: 500 }
    );
  }
}
