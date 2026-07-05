const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Excelファイルを読み込む
const workbook = XLSX.readFile('D:\\tp20250319-01_01.xlsx');

// 2番目のシート（内注外）を取得
const sheetName = workbook.SheetNames[1]; // '内注外 (2)'
const sheet = workbook.Sheets[sheetName];
console.log('使用シート:', sheetName);

// JSONに変換
const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// ヘッダー行をスキップして薬剤データを抽出
const drugs = [];
for (let i = 1; i < rawData.length; i++) {
  const row = rawData[i];
  if (!row || !row[0]) continue;

  const drug = {
    id: `drug-${i}`,
    category: row[0] || '',           // 区分（内用薬、注射薬、外用薬など）
    code: row[1] || '',               // 薬価基準収載医薬品コード
    ingredient: row[2] || '',         // 成分名
    specification: row[3] || '',      // 規格
    name: row[7] || '',               // 品名
    manufacturer: row[8] || '',       // メーカー名
    isGeneric: !!row[9],              // 後発医薬品フラグ
    isOriginal: row[10] === '先発品', // 先発医薬品
    price: row[12] || 0,              // 薬価
    deadline: row[13] || '',          // 経過措置期限
    note: row[14] || '',              // 備考
  };

  // 品名または成分名がない場合はスキップ
  if (!drug.name && !drug.ingredient) continue;

  drugs.push(drug);
}

console.log(`抽出した薬剤数: ${drugs.length}`);

// カテゴリ別にカウント
const categories = {};
drugs.forEach(d => {
  categories[d.category] = (categories[d.category] || 0) + 1;
});
console.log('カテゴリ別:', categories);

// TypeScript用のデータファイルを生成（サーバーサイド専用）
const outputPath = path.join(__dirname, '..', 'src', 'data', 'drugs.ts');

// より軽量なJSON形式で出力（インデントなし）
const tsContent = `// 薬価基準収載医薬品データ（厚生労働省）
// 自動生成: ${new Date().toISOString()}
// 出典: https://www.mhlw.go.jp/topics/2024/04/tp20240401-01.html
// 注意: このファイルはサーバーサイドでのみ使用されます

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

export const drugCategories = ${JSON.stringify(Object.keys(categories))} as const;

export type DrugCategory = typeof drugCategories[number];

// 薬剤データ（サーバーサイドでのみ使用）
export const drugs: Drug[] = ${JSON.stringify(drugs)};
`;

fs.writeFileSync(outputPath, tsContent, 'utf8');
console.log(`\n出力完了: ${outputPath}`);
console.log(`ファイルサイズ: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
