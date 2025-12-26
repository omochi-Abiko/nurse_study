import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        examDate: true,
        examYear: true,
        voiceEnabled: true,
        voiceRate: true,
        voiceAutoPlay: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({ settings: user });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "設定の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      examDate,
      examYear,
      voiceEnabled,
      voiceRate,
      voiceAutoPlay,
    } = body;

    const updateData: {
      name?: string;
      examDate?: Date | null;
      examYear?: number | null;
      voiceEnabled?: boolean;
      voiceRate?: number;
      voiceAutoPlay?: boolean;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (examDate !== undefined) {
      updateData.examDate = examDate ? new Date(examDate) : null;
    }
    if (examYear !== undefined) updateData.examYear = examYear;
    if (voiceEnabled !== undefined) updateData.voiceEnabled = voiceEnabled;
    if (voiceRate !== undefined) updateData.voiceRate = voiceRate;
    if (voiceAutoPlay !== undefined) updateData.voiceAutoPlay = voiceAutoPlay;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        examDate: true,
        examYear: true,
        voiceEnabled: true,
        voiceRate: true,
        voiceAutoPlay: true,
      },
    });

    return NextResponse.json({ settings: user });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "設定の更新に失敗しました" },
      { status: 500 }
    );
  }
}
