import type { Book, Category } from '../types';
import { colorOf, glowClass, stats } from '../utils';

interface Props {
  books: Book[];
  categories: Category[];
  selectedCategory?: string | null;
  visibleCount?: number;
}

export default function TelemetryStrip({ books, categories, selectedCategory = null, visibleCount }: Props) {
  const s = stats(books, categories);
  const activeCat = selectedCategory ? categories.find((c) => c.name === selectedCategory) : null;

  // Bloco 2: Nota Média Dinâmica (Geral vs. Categoria Selecionada)
  const catBooks = selectedCategory ? books.filter((b) => b.category === selectedCategory) : books;
  const ratedCatBooks = catBooks.filter((b) => b.rating > 0);
  const metricAvg = ratedCatBooks.length
    ? ratedCatBooks.reduce((sum, b) => sum + b.rating, 0) / ratedCatBooks.length
    : 0;
  const metricColor = activeCat?.color ?? '#39ff14';
  const metricHeader = selectedCategory ? `MÉTRICA // ${selectedCategory.toUpperCase()}` : 'MÉTRICA // GERAL';
  const metricTag = selectedCategory
    ? catBooks.length > 0
      ? `SETOR:${activeCat?.suffix ?? 'CAT'}`
      : 'VAZIO'
    : `AVALIADOS: ${s.pct}%`;
  const metricLeftFoot = selectedCategory
    ? catBooks.length > 0
      ? `${catBooks.length} Vols na Categoria`
      : 'Sem registros'
    : 'Média Global do Site';
  const metricRightFoot = selectedCategory
    ? catBooks.length > 0
      ? `${ratedCatBooks.length} Avaliados`
      : '0.0 ★'
    : `${s.criticados} Analisados`;

  // Bloco 3: Último Livro Adicionado
  const latest = s.latestBook;
  const latestColor = latest ? colorOf(categories, latest.category) : '#00f0ff';

  // Bloco 4: Categoria Dominante
  const domColor = s.dominant?.cat.color ?? '#00f0ff';
  const domCount = s.dominant?.n ?? 0;

  return (
    <>
      {/* DESKTOP: 4 cards */}
      <section
        id="telemetry"
        className="hidden lg:grid border-b border-outline-variant bg-surface-container-lowest p-gutter-desktop grid-cols-4 gap-space-md"
      >
        {/* Bloco 1: Total de Itens Cadastrados */}
        <Card label="REGISTROS // TOTAL" tag="SIS:ATIVO" tagColor="#00f0ff" color="#00f0ff">
          <div className="text-headline-md font-headline-md text-on-surface font-bold">
            {s.total} <span className="text-label-md font-label-md text-outline">Vol</span>
          </div>
          <Foot
            l="Codex Principal"
            r={
              typeof visibleCount === 'number' && selectedCategory
                ? `${visibleCount} Exibidos`
                : `${categories.length} Categorias`
            }
            rc="#00f0ff"
          />
        </Card>

        {/* Bloco 2: Nota Média Dinâmica (Geral vs. Categoria Selecionada) */}
        <Card label={metricHeader} tag={metricTag} tagColor={metricColor} color={metricColor}>
          <div
            className={`text-headline-md font-headline-md font-bold ${glowClass(metricColor)}`}
            style={{ color: metricColor }}
          >
            {metricAvg.toFixed(1)} <span className="text-label-md font-label-md text-on-surface">★ MÉDIA</span>
          </div>
          <Foot l={metricLeftFoot} r={metricRightFoot} rc={metricColor} />
        </Card>

        {/* Bloco 3: Último Livro Adicionado */}
        <Card
          label="ÚLTIMO REGISTRO // ADIÇÃO"
          tag={latest ? 'RECÉM ADICIONADO' : 'AGUARDANDO'}
          tagColor={latestColor}
          color={latestColor}
        >
          {latest ? (
            <>
              <div className="text-headline-md font-headline-md text-on-surface font-bold truncate" title={latest.title}>
                {latest.title}
              </div>
              <Foot
                l={latest.author}
                r={`${latest.category.toUpperCase()} · ${latest.rating.toFixed(1)} ★`}
                rc={latestColor}
              />
            </>
          ) : (
            <>
              <div className="text-headline-md font-headline-md text-outline font-bold truncate">
                NENHUM REGISTRO
              </div>
              <Foot l="Aguardando indexação..." r="0.0 ★" rc="#849495" />
            </>
          )}
        </Card>

        {/* Bloco 4: Categoria com Mais Livros Cadastrados (Dominância) */}
        <Card label="DADOS // DOMINÂNCIA" tag="MAIOR CATEGORIA" tagColor={domColor} color={domColor}>
          <div className="text-headline-md font-headline-md text-on-surface font-bold truncate">
            {s.dominant && domCount > 0 ? s.dominant.cat.name : '—'}{' '}
            <span className="text-label-md font-label-md" style={{ color: domColor }}>
              {s.dominantPct}%
            </span>
          </div>
          <Foot
            l={`${domCount} Vols registrados`}
            r={s.second && s.second.n > 0 ? `2º: ${s.second.cat.name}` : `${categories.length} Categorias`}
            rc={domColor}
          />
        </Card>
      </section>

      {/* MOBILE: 4 bento cards */}
      <section className="lg:hidden grid grid-cols-2 gap-2 px-4 pt-3 pb-1">
        {/* Bloco 1 Mobile */}
        <div className="bg-surface-container p-2.5 border border-outline-variant/60 relative overflow-hidden">
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase tracking-wider">
            <span>REGISTROS // TOTAL</span>
            <span className="text-primary-container">SIS:ATIVO</span>
          </div>
          <div className="font-headline-sm text-headline-sm font-bold text-primary mt-1">
            {s.total} <span className="font-label-sm text-label-sm font-normal text-on-surface-variant">Vol</span>
          </div>
          <div className="font-code-dense text-code-dense text-on-surface-variant mt-1 flex items-center justify-between">
            <span>Codex Principal</span>
            <span className="text-primary-container">{categories.length} Cat</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container/60" />
        </div>

        {/* Bloco 2 Mobile */}
        <div className="bg-surface-container p-2.5 border border-outline-variant/60 relative overflow-hidden">
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase tracking-wider gap-1">
            <span className="truncate">{selectedCategory ? `MÉTRICA // ${selectedCategory}` : 'MÉTRICA // GERAL'}</span>
            <span className="shrink-0" style={{ color: metricColor }}>{metricTag}</span>
          </div>
          <div className="font-headline-sm text-headline-sm font-bold mt-1" style={{ color: metricColor }}>
            {metricAvg.toFixed(1)}{' '}
            <span className="font-label-sm text-label-sm font-normal text-on-surface">★ MÉDIA</span>
          </div>
          <div className="font-code-dense text-code-dense text-on-surface-variant mt-1 truncate">
            {metricLeftFoot}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: metricColor }} />
        </div>

        {/* Bloco 3 Mobile */}
        <div className="bg-surface-container p-2.5 border border-outline-variant/60 relative overflow-hidden">
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase tracking-wider gap-1">
            <span className="truncate">ÚLTIMO REGISTRO // ADIÇÃO</span>
            <span className="shrink-0" style={{ color: latestColor }}>RECÉM ADICIONADO</span>
          </div>
          <div className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1 truncate">
            {latest ? latest.title : 'NENHUM REGISTRO'}
          </div>
          <div className="font-code-dense text-code-dense text-on-surface-variant mt-1 flex items-center justify-between gap-1">
            <span className="truncate">{latest ? latest.author : 'Aguardando indexação...'}</span>
            {latest && (
              <span className="shrink-0 font-bold" style={{ color: latestColor }}>
                {latest.rating.toFixed(1)} ★
              </span>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: latestColor }} />
        </div>

        {/* Bloco 4 Mobile */}
        <div className="bg-surface-container p-2.5 border border-outline-variant/60 relative overflow-hidden">
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase tracking-wider gap-1">
            <span className="truncate">DADOS // DOMINÂNCIA</span>
            <span className="shrink-0" style={{ color: domColor }}>MAIOR CATEGORIA</span>
          </div>
          <div className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1 truncate">
            {s.dominant && domCount > 0 ? s.dominant.cat.name : '—'}{' '}
            <span className="font-label-sm text-label-sm" style={{ color: domColor }}>
              {s.dominantPct}%
            </span>
          </div>
          <div className="font-code-dense text-code-dense text-on-surface-variant mt-1 truncate">
            {domCount} Vols registrados
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: domColor }} />
        </div>
      </section>
    </>
  );
}

function Card({
  label,
  tag,
  tagColor,
  color,
  children,
}: {
  label: string;
  tag: string;
  tagColor: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-surface-container-low border border-outline-variant p-space-md relative overflow-hidden group transition-colors"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      <div className="flex items-center justify-between text-code-dense font-code-dense text-outline mb-1 gap-2">
        <span className="truncate">{label}</span>
        <span style={{ color: tagColor }} className="shrink-0">
          {tag}
        </span>
      </div>
      {children}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: color }} />
    </div>
  );
}

function Foot({ l, r, rc }: { l: string; r: string; rc: string }) {
  return (
    <div className="text-code-dense font-code-dense text-on-surface-variant mt-1 flex items-center justify-between gap-2">
      <span className="truncate">{l}</span>
      <span style={{ color: rc }} className="shrink-0">
        {r}
      </span>
    </div>
  );
}
