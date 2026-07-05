import { getAllSkills } from "@/data/freshman-skills";
import LearningDetailPage from "./learning-detail";

// 静的エクスポート用に全スキルのパスを生成
export function generateStaticParams() {
  return getAllSkills().map((skill) => ({ id: skill.id }));
}

export default function Page() {
  return <LearningDetailPage />;
}
