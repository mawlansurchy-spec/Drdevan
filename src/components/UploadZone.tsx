import { useState, useRef } from "react";
import { UploadCloud, FileImage, Loader2 } from "lucide-react";

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export function UploadZone({ onUpload, isUploading }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div
        className={`relative border-2 border-dashed rounded-[32px] p-12 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[300px] overflow-hidden group
          ${
            isDragActive
              ? "border-emerald-500/50 bg-emerald-500/10"
              : "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10"
          }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 bg-emerald-500/[0.02] rounded-[32px] group-hover:bg-emerald-500/[0.05] transition-all"></div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center text-emerald-400 z-10 relative">
            <Loader2 className="w-12 h-12 mb-4 animate-spin" />
            <p className="text-lg font-medium text-white">داتا شیدەکرێتەوە...</p>
            <p className="text-sm text-emerald-500/70 mt-2">تکایە چاوەڕێ بکە...</p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center z-10 relative">
            <img src={preview} alt="Preview" className="max-h-48 rounded-xl shadow-2xl mb-4 border border-white/10" />
            <p className="text-sm font-medium text-gray-400 flex items-center gap-2 group-hover:text-white transition-colors">
              <FileImage className="w-4 h-4" /> وێنەی نوێ هەڵبژێرە
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 z-10 relative">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">وێنەی چارتەکە لێرە دابنێ</h3>
            <p className="text-sm">یان کلیک بکە بۆ هەڵبژاردنی وێنە لە گەلەرییەوە</p>
          </div>
        )}
      </div>
    </div>
  );
}
