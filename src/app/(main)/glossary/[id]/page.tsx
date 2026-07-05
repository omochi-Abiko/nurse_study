import { glossaryTerms } from "@/data/glossary";
import GlossaryDetailPage from "./glossary-detail";

// 静的エクスポート用に全用語のパスを生成
export function generateStaticParams() {
  return glossaryTerms.map((term) => ({ id: term.id }));
}

export default function Page() {
  return <GlossaryDetailPage />;
}
