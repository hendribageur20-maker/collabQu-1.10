import React, { useState } from 'react';
import { X, Target, Check } from 'lucide-react';
import { MarketingPlan } from '../types';

interface MarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (plan: MarketingPlan) => void;
}

export const MarketingModal: React.FC<MarketingModalProps> = ({
  isOpen,
  onClose,
  onSavePlan,
}) => {
  const [title, setTitle] = useState('');
  const [targetArea, setTargetArea] = useState('');
  const [type, setType] = useState<MarketingPlan['type']>('canvassing');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Mohon isi Judul dan Catatan Strategi.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => Boolean(t));

    const newPlan: MarketingPlan = {
      id: `mkt-${Date.now()}`,
      title: title.trim(),
      targetArea: targetArea.trim() || 'Semua Wilayah',
      type,
      content: content.trim(),
      status: 'planned',
      date: new Date().toISOString().slice(0, 10),
      tags: tags.length > 0 ? tags : ['Strategi', type],
    };

    onSavePlan(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Tambah Catatan / Strategi Marketing
              </h2>
              <p className="text-[11px] text-slate-500">
                Pencatatan riset lapangan, script & strategi canvassing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Judul Strategi / Rencana <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Misal: Script Penawaran Titip Jual Warung Kampus"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Strategi
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MarketingPlan['type'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 outline-none"
              >
                <option value="canvassing">Canvassing Lapangan</option>
                <option value="pitch_script">Script Pitching Sales</option>
                <option value="margin_sharing">Skema Bagi Hasil / Bonus</option>
                <option value="competitor_analysis">Riset Kompetitor</option>
                <option value="follow_up">SOP Follow Up Toko</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Wilayah / Toko
              </label>
              <input
                type="text"
                placeholder="Misal: Kec. Sukajadi"
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Isi Catatan / Script Pemasaran <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Tuliskan poin-poin strategi, kalimat pembuka untuk pemilik warung, skema margin, atau catatan negosiasi..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 outline-none leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tag / Label (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              placeholder="Canvassing, Warung Kopi, Margin 20%"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
            >
              <Check className="w-4 h-4" />
              Simpan Strategi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
