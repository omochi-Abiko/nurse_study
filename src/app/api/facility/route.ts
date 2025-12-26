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

    if (id) {
      // 特定の施設を取得（ノート含む）
      const facility = await prisma.facility.findFirst({
        where: {
          id,
          userId: session.user.id,
        },
        include: {
          notes: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      return NextResponse.json({ facility });
    }

    // 一覧を取得
    const facilities = await prisma.facility.findMany({
      where: { userId: session.user.id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ facilities });
  } catch (error) {
    console.error("Get facilities error:", error);
    return NextResponse.json(
      { error: "施設情報の取得に失敗しました" },
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

    const { name, address } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "施設名は必須です" },
        { status: 400 }
      );
    }

    const facility = await prisma.facility.create({
      data: {
        userId: session.user.id,
        name,
        address,
      },
      include: {
        notes: true,
      },
    });

    return NextResponse.json({ facility });
  } catch (error) {
    console.error("Create facility error:", error);
    return NextResponse.json(
      { error: "施設の作成に失敗しました" },
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

    const { id, name, address } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "施設IDが必要です" },
        { status: 400 }
      );
    }

    // 所有者チェック
    const existing = await prisma.facility.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "施設が見つかりません" },
        { status: 404 }
      );
    }

    const facility = await prisma.facility.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        address: address ?? existing.address,
      },
      include: {
        notes: true,
      },
    });

    return NextResponse.json({ facility });
  } catch (error) {
    console.error("Update facility error:", error);
    return NextResponse.json(
      { error: "施設の更新に失敗しました" },
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
        { error: "施設IDが必要です" },
        { status: 400 }
      );
    }

    // 所有者チェック
    const existing = await prisma.facility.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "施設が見つかりません" },
        { status: 404 }
      );
    }

    // 関連するノートも一緒に削除される（onDelete: Cascade）
    await prisma.facility.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete facility error:", error);
    return NextResponse.json(
      { error: "施設の削除に失敗しました" },
      { status: 500 }
    );
  }
}
