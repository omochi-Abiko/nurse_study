import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const limit = parseInt(searchParams.get("limit") || "30");

    if (date) {
      // 特定の日付のふりかえりを取得
      const reflection = await prisma.reflection.findUnique({
        where: {
          userId_date: {
            userId: session.user.id,
            date,
          },
        },
      });
      return NextResponse.json({ reflection });
    }

    // 一覧を取得
    const reflections = await prisma.reflection.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: limit,
    });

    return NextResponse.json({ reflections });
  } catch (error) {
    console.error("Get reflections error:", error);
    return NextResponse.json(
      { error: "ふりかえりの取得に失敗しました" },
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

    const { date, mood, note } = await request.json();

    if (!date || !mood) {
      return NextResponse.json(
        { error: "日付と気分は必須です" },
        { status: 400 }
      );
    }

    // upsert: 既存があれば更新、なければ作成
    const reflection = await prisma.reflection.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date,
        },
      },
      update: { mood, note },
      create: {
        userId: session.user.id,
        date,
        mood,
        note,
      },
    });

    return NextResponse.json({ reflection });
  } catch (error) {
    console.error("Save reflection error:", error);
    return NextResponse.json(
      { error: "ふりかえりの保存に失敗しました" },
      { status: 500 }
    );
  }
}
