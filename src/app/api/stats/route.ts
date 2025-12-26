import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userId = session.user.id;

    // 並列で統計データを取得
    const [
      totalAnswers,
      correctAnswers,
      weakQuestionsCount,
      recentAnswers,
      answersPerCategory,
      correctPerCategory,
      allAnswerDates,
    ] = await Promise.all([
      // 総回答数
      prisma.quizAnswer.count({ where: { userId } }),
      // 正解数
      prisma.quizAnswer.count({ where: { userId, isCorrect: true } }),
      // 苦手問題数
      prisma.weakQuestion.count({ where: { userId } }),
      // 直近30日間の回答
      prisma.quizAnswer.findMany({
        where: {
          userId,
          answeredAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { answeredAt: "desc" },
      }),
      // カテゴリ別の総回答数
      prisma.quizAnswer.groupBy({
        by: ["category"],
        where: { userId },
        _count: { id: true },
      }),
      // カテゴリ別の正解数
      prisma.quizAnswer.groupBy({
        by: ["category"],
        where: { userId, isCorrect: true },
        _count: { id: true },
      }),
      // 全回答日（ストリーク計算用）
      prisma.quizAnswer.findMany({
        where: { userId },
        select: { answeredAt: true },
        distinct: ["answeredAt"],
      }),
    ]);

    // 正答率計算
    const correctRate =
      totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

    // カテゴリ別正解数のマップを作成
    const correctByCategory = new Map(
      correctPerCategory.map((cat) => [cat.category, cat._count.id])
    );

    // カテゴリ別統計の整形
    const categoryStats = answersPerCategory.map((cat) => {
      const correct = correctByCategory.get(cat.category) || 0;
      return {
        category: cat.category || "unknown",
        total: cat._count.id,
        correct,
        rate: cat._count.id > 0 ? Math.round((correct / cat._count.id) * 100) : 0,
      };
    });

    // ストリーク計算（連続日数）
    const today = new Date().toISOString().split("T")[0];
    const activeDays = new Set(
      allAnswerDates.map((item) => {
        return new Date(item.answeredAt).toISOString().split("T")[0];
      })
    );

    let streak = 0;
    let checkDate = new Date();
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (activeDays.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dateStr === today) {
        // 今日まだ学習していない場合は昨日から数える
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 今日の学習状況
    const todayAnswers = recentAnswers.filter((a) => {
      const answerDate = new Date(a.answeredAt).toISOString().split("T")[0];
      return answerDate === today;
    });

    const stats = {
      totalAnswers,
      correctAnswers,
      correctRate,
      weakQuestionsCount,
      streak,
      todayAnswers: todayAnswers.length,
      todayCorrect: todayAnswers.filter((a) => a.isCorrect).length,
      categoryStats,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "統計の取得に失敗しました" },
      { status: 500 }
    );
  }
}
