import type { SyncState } from '../types';

const SYNC_PT: Record<SyncState, string> = {
  LOCAL: 'LOCAL',
  CLOUD: 'NUVEM',
  OFFLINE: 'OFFLINE',
};

export default function Footer({ total, sync }: { total: number; sync: SyncState }) {
  return (
    <>
      {/* Desktop: barra de status fixa */}
      <footer className="hidden lg:flex fixed bottom-0 left-0 right-0 h-7 bg-surface-container-lowest border-t border-outline-variant z-40 px-gutter-desktop items-center justify-between text-code-dense font-code-dense text-outline select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-on-surface">
            <span className="h-2 w-2 bg-primary-container inline-block" />
            LIBRARYTRIX // PROTOCOLO_v4.2.1
          </span>
          <span>|</span>
          <span>ARMAZENAMENTO: {total}/5000 REGISTROS</span>
          <span>|</span>
          <span className="text-[#39ff14]">SEGURANÇA: BANCO LOCAL CRIPTOGRAFADO</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-on-surface-variant">LOCAL: BRASIL [NÓ DO OPERADOR]</span>
          <span>|</span>
          <span className="text-primary-container">SINCRONIA: {SYNC_PT[sync]}</span>
          <span>|</span>
          <span>STATUS DO SISTEMA: IDEAL</span>
        </div>
      </footer>

      {/* Mobile: rodapé diagnóstico PWA */}
      <footer className="lg:hidden pt-4 pb-2 border-t border-outline-variant text-center font-code-dense text-code-dense text-outline">
        <div className="flex items-center justify-center gap-2 flex-wrap px-2">
          <span>ARMAZENAMENTO: {total}/5000 REGISTROS</span>•<span>SEGURANÇA: BANCO LOCAL CRIPTOGRAFADO</span>
        </div>
        <div className="mt-1 text-[10px] text-outline-variant">
          LIBRARYTRIX PROTOCOLO v4.1.0 • PWA PRONTO PARA USO OFFLINE
        </div>
      </footer>
    </>
  );
}
