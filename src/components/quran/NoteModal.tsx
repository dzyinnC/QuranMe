import React, { useState } from 'react';
import { FileText, Trash2, X } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface NoteModalProps {
  surahNomor: number;
  surahNamaLatin: string;
  ayatNomor: number;
  initialText?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (savedText: string) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  surahNomor,
  surahNamaLatin,
  ayatNomor,
  initialText = '',
  isOpen,
  onClose,
  onSave,
}) => {
  const [text, setText] = useState(initialText);

  if (!isOpen) return null;

  const handleSave = () => {
    StorageService.saveNoteForAyat(surahNomor, ayatNomor, text);
    onSave(text);
    onClose();
  };

  const handleDelete = () => {
    StorageService.saveNoteForAyat(surahNomor, ayatNomor, '');
    onSave('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-main)] text-[var(--text-main)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E8F6FF] text-[#0EAAFC] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202124]">Catatan Ayat</h3>
              <p className="text-xs text-[#5F6368]">
                {surahNamaLatin} : Ayat {ayatNomor}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto">
          <label className="block text-xs font-medium text-[#5F6368] mb-2">
            Tuliskan tadabbur, catatan pribadi, atau poin penting untuk ayat ini:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Contoh: Mengingatkan untuk selalu bersyukur di setiap keadaan..."
            className="w-full p-3 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0EAAFC] focus:border-transparent resize-y text-[#202124]"
            autoFocus
          />
          <div className="mt-2 text-right">
            <span className="text-[11px] text-[#5F6368]">{text.length} karakter</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#F7FAFC] border-t border-[#E5E7EB] flex items-center justify-between">
          {initialText ? (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Catatan</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5F6368] hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0EAAFC] hover:bg-[#0877B9] rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Simpan Catatan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
