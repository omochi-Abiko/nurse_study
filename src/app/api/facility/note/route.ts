import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { facilityId, category, content } = await request.json();

    if (!facilityId || !category || !content) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // 施設の所有者チェック
    const facility = await prisma.facility.findFirst({
      where: { id: facilityId, userId: session.user.id },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "施設が見つかりません" },
        { status: 404 }
      );
    }

    const note = await prisma.facilityNote.create({
      data: {
        facilityId,
        category,
        content,
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Create facility note error:", error);
    return NextResponse.json(
      { error: "ノートの作成に失敗しました" },
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

    const { id, category, content } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ノートIDが必要です" },
        { status: 400 }
      );
    }

    // ノートの存在と施設の所有者チェック
    const existing = await prisma.facilityNote.findUnique({
      where: { id },
      include: { facility: true },
    });

    if (!existing || existing.facility.userId !== session.user.id) {
      return NextResponse.json(
        { error: "ノートが見つかりません" },
        { status: 404 }
      );
    }

    const note = await prisma.facilityNote.update({
      where: { id },
      data: {
        category: category ?? existing.category,
        content: content ?? existing.content,
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Update facility note error:", error);
    return NextResponse.json(
      { error: "ノートの更新に失敗しました" },
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
        { error: "ノートIDが必要です" },
        { status: 400 }
      );
    }

    // ノートの存在と施設の所有者チェック
    const existing = await prisma.facilityNote.findUnique({
      where: { id },
      include: { facility: true },
    });

    if (!existing || existing.facility.userId !== session.user.id) {
      return NextResponse.json(
        { error: "ノートが見つかりません" },
        { status: 404 }
      );
    }

    await prisma.facilityNote.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete facility note error:", error);
    return NextResponse.json(
      { error: "ノートの削除に失敗しました" },
      { status: 500 }
    );
  }
}
