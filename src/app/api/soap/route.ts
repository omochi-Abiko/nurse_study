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
    const id = searchParams.get("id");
    const date = searchParams.get("date");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (id) {
      // 特定のレコードを取得
      const record = await prisma.sOAPRecord.findFirst({
        where: {
          id,
          userId: session.user.id,
        },
      });
      return NextResponse.json({ record });
    }

    const where: { userId: string; date?: string } = {
      userId: session.user.id,
    };

    if (date) {
      where.date = date;
    }

    const records = await prisma.sOAPRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Get SOAP records error:", error);
    return NextResponse.json(
      { error: "SOAP記録の取得に失敗しました" },
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

    const { date, patientId, subjective, objective, assessment, plan } =
      await request.json();

    if (!date || !subjective || !objective || !assessment || !plan) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    const record = await prisma.sOAPRecord.create({
      data: {
        userId: session.user.id,
        date,
        patientId,
        subjective,
        objective,
        assessment,
        plan,
      },
    });

    return NextResponse.json({ record });
  } catch (error) {
    console.error("Create SOAP record error:", error);
    return NextResponse.json(
      { error: "SOAP記録の作成に失敗しました" },
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

    const { id, date, patientId, subjective, objective, assessment, plan } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "レコードIDが必要です" },
        { status: 400 }
      );
    }

    // 所有者チェック
    const existing = await prisma.sOAPRecord.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "レコードが見つかりません" },
        { status: 404 }
      );
    }

    const record = await prisma.sOAPRecord.update({
      where: { id },
      data: {
        date: date ?? existing.date,
        patientId: patientId ?? existing.patientId,
        subjective: subjective ?? existing.subjective,
        objective: objective ?? existing.objective,
        assessment: assessment ?? existing.assessment,
        plan: plan ?? existing.plan,
      },
    });

    return NextResponse.json({ record });
  } catch (error) {
    console.error("Update SOAP record error:", error);
    return NextResponse.json(
      { error: "SOAP記録の更新に失敗しました" },
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "レコードIDが必要です" },
        { status: 400 }
      );
    }

    // 所有者チェック
    const existing = await prisma.sOAPRecord.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "レコードが見つかりません" },
        { status: 404 }
      );
    }

    await prisma.sOAPRecord.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete SOAP record error:", error);
    return NextResponse.json(
      { error: "SOAP記録の削除に失敗しました" },
      { status: 500 }
    );
  }
}
