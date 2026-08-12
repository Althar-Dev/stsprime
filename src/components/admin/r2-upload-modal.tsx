
"use client";

import { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileImage, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadToR2 } from "@/app/actions/r2-actions";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface R2UploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  folder: "banners" | "icons" | "backgrounds" | "badges" | "others";
  onSuccess?: (url: string) => void;
}

export function R2UploadModal({ isOpen, onOpenChange, folder, onSuccess }: R2UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadToR2(formData, folder);

    if (result.success && result.url) {
      toast({
        title: "Unggah Berhasil",
        description: `File telah disimpan di folder ${folder}/`,
      });
      onSuccess?.(result.url);
      onOpenChange(false);
      resetState();
    } else {
      toast({
        variant: "destructive",
        title: "Gagal Mengunggah",
        description: result.error,
      });
    }
    setIsUploading(false);
  };

  const resetState = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-black flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" /> Upload ke R2
          </DialogTitle>
          <DialogDescription className="text-xs font-bold">
            Aset akan otomatis disimpan ke direktori <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">/{folder}</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!preview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileImage className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black">Klik untuk pilih gambar</p>
                <p className="text-[10px] text-muted-foreground font-bold">PNG, JPG, WebP (Maks. 5MB)</p>
              </div>
            </div>
          ) : (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-inner bg-muted/20">
              <Image src={preview} alt="Preview" fill className="object-contain p-2" />
              <button 
                onClick={resetState}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-destructive text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />

          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
             <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
             <p className="text-[10px] font-bold text-blue-600 leading-tight">
               Pastikan file tidak mengandung karakter aneh. Sistem akan otomatis memberikan nama unik berbasis UUID.
             </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Batal</Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="rounded-xl font-black px-8 gap-2 shadow-lg shadow-primary/20"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Mulai Unggah
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
