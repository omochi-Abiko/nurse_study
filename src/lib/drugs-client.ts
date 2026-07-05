// クライアントサイド薬剤検索
// 静的サイト化に伴い、薬剤データ（約4MB）はdynamic importで
// 薬剤検索ページを開いたときにのみ遅延ロードする

export interface Drug {
  id: string;
  category: string;
  code: string;
  ingredient: string;
  specification: string;
  name: string;
  manufacturer: string;
  isGeneric: boolean;
  isOriginal: boolean;
  price: number;
  deadline: string;
  note: string;
}

export interface DrugSearchResult {
  drugs: Drug[];
  total: number;
  hasMore: boolean;
}

export interface DrugSearchParams {
  query?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

// 薬剤データをキャッシュ（初回ロード後はメモリに保持）
let drugsCache: Drug[] | null = null;
let categoriesCache: string[] | null = null;

// データをロード
async function loadDrugs(): Promise<Drug[]> {
  if (drugsCache) return drugsCache;

  const { drugs } = await import("@/data/drugs");
  drugsCache = drugs;
  return drugsCache;
}

// カテゴリ一覧を取得
export async function getDrugCategories(): Promise<string[]> {
  if (categoriesCache) return categoriesCache;

  const drugs = await loadDrugs();
  const categories = [...new Set(drugs.map((d) => d.category))];
  categoriesCache = categories;
  return categoriesCache;
}

// 総薬剤数を取得
export async function getTotalDrugsCount(): Promise<number> {
  const drugs = await loadDrugs();
  return drugs.length;
}

// 薬剤を検索
export async function searchDrugs(
  params: DrugSearchParams
): Promise<DrugSearchResult> {
  const { query = "", category, limit = 20, offset = 0 } = params;
  const drugs = await loadDrugs();

  const normalizedQuery = query.toLowerCase().trim();

  // フィルタリング
  let filtered = drugs;

  if (category) {
    filtered = filtered.filter((drug) => drug.category === category);
  }

  if (normalizedQuery) {
    // 検索スコアリング（完全一致 > 前方一致 > 部分一致）
    const scored = filtered
      .map((drug) => {
        let score = 0;
        const nameL = drug.name.toLowerCase();
        const ingredientL = drug.ingredient.toLowerCase();
        const manufacturerL = drug.manufacturer.toLowerCase();

        // 完全一致
        if (nameL === normalizedQuery || ingredientL === normalizedQuery) {
          score = 100;
        }
        // 前方一致
        else if (
          nameL.startsWith(normalizedQuery) ||
          ingredientL.startsWith(normalizedQuery)
        ) {
          score = 50;
        }
        // 部分一致
        else if (
          nameL.includes(normalizedQuery) ||
          ingredientL.includes(normalizedQuery) ||
          manufacturerL.includes(normalizedQuery)
        ) {
          score = 10;
        }

        return { drug, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    filtered = scored.map((item) => item.drug);
  }

  const total = filtered.length;
  const paginatedDrugs = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return {
    drugs: paginatedDrugs,
    total,
    hasMore,
  };
}
