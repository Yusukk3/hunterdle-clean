'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Share2, RotateCcw, Trophy, User, Medal, Quote, Eye, Wand2, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { Character, fallbackCharacters } from '@/lib/characters';
import { hasSupabaseEnv, supabase } from '@/lib/supabase';

const MODES = [
  { id: 'classic', label: 'Clássico', icon: Search },
  { id: 'quote', label: 'Fala', icon: Quote },
  { id: 'silhouette', label: 'Silhueta', icon: Eye },
  { id: 'nen', label: 'Nen', icon: Wand2 },
] as const;

type Mode = typeof MODES[number]['id'];

type RankingRow = { player_name: string; score: number; streak: number };

const FIELDS: Array<{ key: keyof Character; label: string }> = [
  { key: 'gender', label: 'Gênero' },
  { key: 'affiliation', label: 'Grupo' },
  { key: 'nen_type', label: 'Nen' },
  { key: 'origin', label: 'Origem' },
  { key: 'first_arc', label: '1º arco' },
  { key: 'status', label: 'Status' },
  { key: 'role', label: 'Função' },
  { key: 'age_group', label: 'Idade' },
];

function normalize(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function daySeed() {
  const start = new Date('2026-01-01T00:00:00');
  return Math.floor((Date.now() - start.getTime()) / 86400000);
}

function pickTarget(chars: Character[], mode: Mode, daily: boolean, roundSeed: number) {
  const offset = MODES.findIndex((m) => m.id === mode) * 7;
  const seed = daily ? daySeed() : Date.now() + roundSeed;
  return chars[Math.abs(seed + offset) % chars.length];
}

function Hint({ mode, target, guesses }: { mode: Mode; target: Character; guesses: Character[] }) {
  if (mode === 'classic') return null;
  const won = guesses.some((g) => g.name === target.name);
  const content = {
    quote: ['Modo Fala', `“${target.quote}”`, guesses.length >= 3 ? `Dica extra: apareceu primeiro em ${target.first_arc}.` : 'Dica extra liberada após 3 tentativas.'],
   silhouette: [
  'Modo Silhueta',
  <motion.img
  src={
    target.silhouetteImage ||
    `/silhouettes/${target.name.split(" ")[0].toLowerCase()}.png`
  }
  alt="Silhueta"
  initial={{ opacity: 0, scale: 0.7 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.45 }}
  className="mx-auto h-72 w-72 object-contain transition-all duration-500"
 style={{
  filter: won
    ? "blur(0px) brightness(1)"
    : `
      blur(${Math.max(0, 40 - guesses.length * 7)}px)
      brightness(${Math.min(1, 0.25 + guesses.length * 0.18)})
    `,
  transform: won
    ? "scale(1)"
    : `scale(${Math.max(1, 1.35 - guesses.length * 0.05)})`,
}}
/>
],
    nen: ['Modo Nen', target.nen_hint, guesses.length >= 3 ? `Dica extra: tipo ${target.nen_type}.` : 'Dica extra liberada após 3 tentativas.'],
  }[mode];
  return (
    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
      <p className="text-sm font-bold uppercase tracking-wider text-emerald-300">{content[0]}</p>
      <p className="mt-2 text-xl font-black text-white">{content[1]}</p>
      <p className="mt-3 text-sm text-emerald-100/80">{content[2]}</p>
    </div>
  );
}

export default function HunterDleGame() {
  const [characters, setCharacters] = useState<Character[]>(fallbackCharacters);
  const [ranking, setRanking] = useState<RankingRow[]>([
    { player_name: 'GingFreecss_404', score: 1260, streak: 14 },
    { player_name: 'BungeeGum', score: 1120, streak: 11 },
    { player_name: 'ChainUser', score: 980, streak: 8 },
  ]);
  const [playerName, setPlayerName] = useState('Hunter');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [daily, setDaily] = useState(true);
  const [mode, setMode] = useState<Mode>('classic');
  const [roundSeed, setRoundSeed] = useState(0);
  const [query, setQuery] = useState('');
  const [guesses, setGuesses] = useState<Character[]>([]);
  const [message, setMessage] = useState('Adivinhe o personagem do anime Hunter x Hunter.');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      if (!hasSupabaseEnv) return;
      const { data: chars } = await supabase.from('characters').select('*').order('name');
      if (chars?.length) setCharacters(chars);
      const { data: rows } = await supabase.from('leaderboard').select('*').order('score', { ascending: false }).limit(8);
      if (rows?.length) setRanking(rows);
    }
    load();
  }, []);

   const target= useMemo(() => pickTarget(characters, mode, daily, roundSeed), [characters, mode, daily, roundSeed]);
  const won = guesses.some((g) => g.name === target.name);
  const suggestions = characters
  .filter((character) =>
    character.name.toLowerCase().includes(query.toLowerCase())
  )
  .filter((character) => !guesses.some((g) => g.name === character.name))
  .slice(0, 8);
  const options = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return characters.filter((c) => normalize(c.name).includes(q) && !guesses.some((g) => g.name === c.name)).slice(0, 7);
  }, [characters, guesses, query]);

  async function saveRanking(nextScore: number, nextStreak: number) {
    const row = { player_name: playerName.trim() || 'Hunter', score: nextScore, streak: nextStreak };
    setRanking((prev) => [row, ...prev.filter((r) => r.player_name !== row.player_name)].sort((a, b) => b.score - a.score).slice(0, 8));
    if (hasSupabaseEnv) await supabase.from('leaderboard').upsert(row, { onConflict: 'player_name' });
  }

  function submitGuess(character: Character) {
  if (won) return;

  const next = [character, ...guesses];
  setGuesses(next);
  setQuery("");

  if (character.name === target.name) {
    setSuccess(true);
  }
}

 function submitTyped() {
    const exact = characters.find((c) => normalize(c.name) === normalize(query.trim()));
    if (exact)submitGuess(exact);
    else setMessage('Escolha um personagem da lista de sugestões.');
  }

  function newRound(nextDaily = daily, nextMode = mode) {
    setDaily(nextDaily);
    setMode(nextMode);
    setRoundSeed((v) => v + 1);
    setGuesses([]);
    setQuery('');
    setMessage(nextDaily ? 'Modo diário reiniciado localmente.' : 'Novo personagem sorteado no modo livre.');
  }

  function shareResult() {
  const modeName =
    MODES.find((m) => m.id === mode)?.label || "Clássico";

  const resultBlocks = guesses
    .slice()
    .reverse()
    .map((guess) => (guess.name === target.name ? "🟩" : "⬛"))
    .join("");

  const resultText = `HunterDle ${daily ? "Diário" : "Livre"} - ${modeName}

${won ? `✅ Acertei em ${guesses.length} tentativa(s)!` : "❌ Ainda não acertei."}

${resultBlocks}

🎯 Modo: ${modeName}
🔥 Streak: ${streak}
`;

  navigator.clipboard.writeText(resultText);

  alert("Resultado copiado! Agora é só colar no WhatsApp, X, Discord ou Instagram.");
}

  return (
    <main className="min-h-screen bg-[linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.72)),url('/images/hunter-bg-v2.jpg')] bg-cover bg-center bg-fixed text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[2rem] border border-emerald-400/20 bg-emerald-950/60 p-6 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-200">Anime-only database</div>
              <h1 className="text-5xl font-black tracking-tight md:text-7xl text-emerald-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.7)]">HunterDle</h1>
              <p className="mt-2 max-w-2xl text-zinc-300">Adivinhe personagens do anime Hunter x Hunter. Projeto pronto para Supabase.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
              <div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />

  <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && suggestions[0]) {
        submitGuess(suggestions[0]);
      }
    }}
    placeholder="Digite um personagem..."
    className="w-full rounded-2xl border border-zinc-800 bg-black/60 py-4 pl-12 pr-4 text-white outline-none transition focus:border-emerald-400"
  />

  {query.length > 0 && suggestions.length > 0 && (
    <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-emerald-500/30 bg-zinc-950 shadow-2xl">
      {suggestions.map((character) => (
        <button
          key={character.name}
          onClick={() => submitGuess(character)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-white transition hover:bg-emerald-500/20"
        >
          <div>
            <p className="font-bold">{character.name}</p>
            <p className="text-xs text-zinc-400">
              {character.affiliation} • {character.nen_type}
            </p>
          </div>

          {character.silhouetteImage && (
            <img
              src={character.silhouetteImage}
              alt={character.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
        </button>
      ))}
    </div>
  )}
</div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4"><p className="text-xs text-zinc-500">Pontuação</p><p className="mt-2 text-3xl font-black text-emerald-300">{score}</p><p className="text-xs text-zinc-500">Streak: {streak}</p></div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4"><p className="text-xs text-zinc-500">Banco</p><p className="mt-3 flex items-center gap-2 font-bold"><Database size={17}/> {characters.length} personagens</p><p className="text-xs text-zinc-500">{hasSupabaseEnv ? 'Supabase conectado' : 'Fallback local'}</p></div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
              <div className="mb-5 flex flex-wrap gap-2">
                {MODES.map((m) => { const Icon = m.icon; return <button key={m.id} onClick={() => newRound(daily, m.id)} className={`rounded-2xl px-4 py-2 font-bold ${mode === m.id ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-200'}`}><Icon className="mr-2 inline" size={17}/>{m.label}</button>; })}
                <button onClick={shareResult} className="rounded-2xl bg-zinc-800 px-4 py-2 font-bold"><Share2 className="mr-2 inline" size={17}/>Compartilhar</button>
              </div>
              <Hint mode={mode} target={target} guesses={guesses} />
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="relative"><Search className="absolute left-4 top-3.5 text-zinc-500" size={20}/><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitTyped()} disabled={won} placeholder="Ex: Gon Freecss, Killua Zoldyck..." className="w-full rounded-2xl border border-zinc-800 bg-black/50 py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-400/30" />{!!options.length && !won && <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">{options.map((c) => <button key={c.name} onClick={() => submitGuess(c)} className="block w-full px-4 py-3 text-left hover:bg-emerald-500/15">{c.name}</button>)}</div>}</div>
                <div className="flex gap-2"><button onClick={() => newRound(true, mode)} className={`rounded-2xl px-4 py-2 font-bold ${daily ? 'bg-emerald-500' : 'bg-zinc-800'}`}>Diário</button><button onClick={() => newRound(false, mode)} className={`rounded-2xl px-4 py-2 font-bold ${!daily ? 'bg-emerald-500' : 'bg-zinc-800'}`}><RotateCcw className="mr-2 inline" size={17}/>Livre</button></div>
              </div>
              <p className="mt-3 text-sm text-zinc-400">{message}</p>
            </div>

            {won && <motion.div
  animate={
    shake
      ? { x: [-10, 10, -8, 8, -5, 5, 0] }
      : success
      ? {
          scale: [1, 1.03, 1],
          boxShadow: [
            "0 0 0 rgba(16,185,129,0)",
            "0 0 40px rgba(16,185,129,0.7)",
            "0 0 0 rgba(16,185,129,0)",
          ],
        }
      : {}
  }
  transition={{
    duration: shake ? 0.45 : 0.8,
  }}
  className="rounded-3xl"
></motion.div>}

            <div className="overflow-x-auto rounded-[1.5rem] border border-zinc-800 bg-black/40 shadow-2xl"><table className="w-full border-collapse text-sm"><thead className="bg-zinc-950 text-zinc-300"><tr><th className="sticky left-0 z-10 min-w-[170px] bg-zinc-950 px-4 py-4 text-left">Personagem</th>{FIELDS.map((f) => <th key={String(f.key)} className="min-w-[120px] px-3 py-4 text-center">{f.label}</th>)}</tr></thead><tbody>{guesses.length === 0 ? <tr><td colSpan={FIELDS.length + 1} className="px-4 py-12 text-center text-zinc-500">Nenhuma tentativa ainda.</td></tr> : guesses.map((g) => <tr key={g.name} className="border-t border-zinc-900"><td className="sticky left-0 z-10 bg-zinc-950 px-4 py-3 font-bold">{g.name}</td>{FIELDS.map((f) => <td key={String(f.key)} className="min-w-[120px] px-3 py-3 text-center"><div className={`rounded-xl px-3 py-2 text-sm font-semibold ${g[f.key] === target[f.key] ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-200 ring-1 ring-zinc-700'}`}>{String(g[f.key])}</div></td>)}</tr>)}</tbody></table></div>
          </section>

          <aside className="rounded-[2rem] border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl"><div className="mb-4 flex items-center gap-2"><Medal className="text-emerald-300"/><h2 className="text-xl font-black">Ranking</h2></div><div className="space-y-3">{ranking.map((r, i) => <div key={r.player_name} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/30 p-3"><div><p className="font-bold">#{i + 1} {r.player_name}</p><p className="text-xs text-zinc-500">Streak {r.streak}</p></div><p className="text-lg font-black text-emerald-300">{r.score}</p></div>)}</div></aside>
        </div>
      </div>
    </main>
  );
}
