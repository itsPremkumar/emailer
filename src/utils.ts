import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';


export const prompt = async (q: string) => {
const rl = readline.createInterface({ input, output });
try {
const answer = await rl.question(q);
return answer.trim();
} finally {
rl.close();
}
};


export const logHr = (label = '') => {
const line = '-'.repeat(40);
console.log(`\n${line} ${label} ${line}`.trim());
};


export const dedupeBy = <T>(items: T[], key: (t: T) => string): T[] => {
const seen = new Set<string>();
return items.filter((it) => {
const k = key(it);
if (seen.has(k)) return false;
seen.add(k);
return true;
});
};


export const normalize = (s: string) => s.normalize('NFKC').trim();


