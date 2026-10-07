import React, { useState } from 'react';
import {
  Plus,
  Target,
  Copy,
  Check,
  Tag,
  MapPin,
  Sparkles,
  BookOpen,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { MarketingPlan } from '../types';
import { formatDateIndo } from '../utils/formatters';

interface MarketingViewProps {
  plans: MarketingPlan[];
  onOpenAddPlan: () => void;
  onDeletePlan: (id: string) => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({
  plans,
  onOpenAddPlan,
  onDeletePlan,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const handleCopy = (plan: MarketingPlan) => {
    navigator.clipboard.writeText(`${plan.title}\n\n${plan.content}`);
    setCopiedId(plan.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Collect all unique tags
  const allTags = Array.from(new Set(plans.flatMap((p) => p.tags || [])));

  const filteredPlans =
    selectedTag === 'all'
      ? plans
      : plans.filter((p) => p.tags && p.tags.includes(selectedTag));

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Marketing & Canvassing
          </h2>
          <p className="text-xs text-slate-500">
            Strategi pemasaran, script penawaran & catatan canvassing
          </p>
        </div>
        <button
          onClick={onOpenAddPlan}
          className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          + Catatan Baru
        </button>
      </div>

      {/* Guide Banner */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl shadow-sm flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen className="w-4 h-4 text-emerald-300" />
        </div>
        <div className="min-w-0 text-xs">
          <h4 className="font-bold text-emerald-200">
            Kiat Sukses Konsinyasi (Titip Jual)
          </h4>
          <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
            Kunci keberhasilan titip jual di warung: <strong>Tanpa modal awal bagi pemilik warung</strong>, garansi retur 100% barang rusak, dan jadwal kunjungan rutin yang konsisten (tiap 7 hari).
          </p>
        </div>
      </div>

      {/* Tag Filters */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedTag === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Semua ({plans.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Strategy Cards List */}
      <div className="space-y-3">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className="p-5 bg-white rounded-2xl border-2 border-slate-300 shadow-sm space-y-3"
          >
            {/* Header: Title & Area */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                    {plan.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {formatDateIndo(plan.date)}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-950 mt-1">
                  {plan.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-600 stroke-[2.2]" />
                  <span>Target Area: {plan.targetArea}</span>
                </div>
              </div>

              <button
                onClick={() => handleCopy(plan)}
                className="px-3 py-1.5 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-900 text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all shrink-0 shadow-2xs"
                title="Salin isi script"
              >
                {copiedId === plan.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-800 stroke-[2.8]" />
                    <span className="text-emerald-900 font-black">Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-700 stroke-[2.2]" />
                    <span>Salin Script</span>
                  </>
                )}
              </button>
            </div>

            {/* Content Body */}
            <div className="bg-slate-100 p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed whitespace-pre-line font-sans">
              {plan.content}
            </div>

            {/* Tags and Status Footer */}
            <div className="flex items-center justify-between pt-1 text-xs text-slate-600 font-bold">
              <div className="flex flex-wrap gap-1">
                {plan.tags?.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-200 text-slate-900 font-bold px-2 py-0.5 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <span className="text-[11px] font-black text-emerald-950 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                {plan.status === 'completed'
                  ? 'Selesai'
                  : plan.status === 'in_progress'
                  ? 'Aktif Digunakan'
                  : 'Rencana'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
