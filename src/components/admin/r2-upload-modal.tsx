
"use client";

import { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Files,
  Trash2,
  Image as ImageIcon
} from "lucide-react";
import { uploadToR2, type R2ConfigData } from "@/app/actions/r2-actions";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FileItem {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface R2UploadModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  folder: "banners" | "icons" | "backgrounds" | "badges" | "others";
  onSuccess?: (url: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function R2UploadModal({ isOpen, onOpenChange, folder, onSuccess }: R2UploadModalProps) {
  const [fileQueue, setFileQueue] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const db = useFirestore();

  const addFiles = (files: FileList | null) => {
    if (!files) return;

    const newItems: FileItem[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: "destructive",
          title: "File Terlalu Besar",
          description: `${file.name} melebihi batas 5MB.`,
        });
        return;
      }
      
      newItems.push({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
      });
    });

    setFileQueue((prev) => [...prev, ...newItems]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setFileQueue((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      const removedItem = prev.find((item) => item.id === id);
      if (removedItem) URL.revokeObjectURL(removedItem.preview);
      return filtered;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUploadAll = async () => {
    if (fileQueue.length === 0 || !db) return;

    setIsUploading(true);
    
    try {
      const configDoc = await getDoc(doc(db, "settings", "r2"));
      if (!configDoc.exists() || !configDoc.data().isEnabled) {
        throw new Error("Layanan R2 belum diaktifkan atau dikonfigurasi.");
      }

      const rawData = configDoc.data();
      const config: R2ConfigData = {
        accountId: String(rawData?.accountId || ""),
        accessKeyId: String(rawData?.accessKeyId || ""),
        secretAccessKey: String(rawData?.secretAccessKey || ""),
        bucketName: String(rawData?.bucketName || ""),
        publicUrl: String(rawData?.publicUrl || ""),
      };

      let successCount = 0;

      for (const item of fileQueue) {
        if (item.status === "success") continue;

        setFileQueue((prev) => 
          prev.map((i) => i.id === item.id ? { ...i, status: "uploading" } : i)
        );

        const formData = new FormData();
        formData.append('file', item.file);

        const result = await uploadToR2(formData, folder, config);

        if (result.success && result.url) {
          setFileQueue((prev) => 
            prev.map((i) => i.id === item.id ? { ...i, status: "success" } : i)
          );
          onSuccess?.(result.url);
          successCount++;
        } else {
          setFileQueue((prev) => 
            prev.map((i) => i.id === item.id ? { ...i, status: "error", error: result.error } : i)
          );
        }
        
        // Berikan jeda singkat antar pengunggahan untuk stabilitas koneksi
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (successCount > 0) {
        toast({
          title: "Unggah Selesai",
          description: `${successCount} file berhasil diunggah.`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Mengunggah",
        description: error.message || "Pastikan kredensial R2 sudah benar.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetAll = () => {
    fileQueue.forEach((item) => URL.revokeObjectURL(item.preview));
    setFileQueue([]);
    setIsUploading(false);
  };

  const hasSuccessfulUploads = fileQueue.some(i => i.status === 'success');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isUploading) {
        onOpenChange(open);
        if (!open) resetAll();
      }
    }}>
      <DialogContent className="sm:max-w-2xl rounded-3xl border-border bg-card p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-0 text-left">
          <DialogTitle className="text-xl font-black flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" /> Pengunggahan Massal R2
          </DialogTitle>
          <DialogDescription className="text-xs font-bold">
            Unggah file ke direktori <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">/{folder}</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 modal-scrollbar">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group",
              isDragging ? "border-primary bg-primary/10 scale-[0.98]" : "border-border hover:border-primary/50 hover:bg-primary/5",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
              <Files className={cn("h-7 w-7 transition-colors", isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
            </div>
            <div className="text-center">
              <p className="text-sm font-black">Seret file ke sini atau klik untuk memilih</p>
              <p className="text-[10px] text-muted-foreground font-bold">Maks. 5MB per file</p>
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange} 
          />

          {fileQueue.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Antrean File ({fileQueue.length})</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={isUploading}
                  onClick={resetAll}
                  className="h-7 text-[9px] font-black uppercase tracking-tight text-destructive hover:bg-destructive/10"
                >
                  Bersihkan Semua
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {fileQueue.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border bg-background/50 transition-colors",
                      item.status === 'success' ? "border-emerald-500/30 bg-emerald-500/5" : "border-border"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                        <Image src={item.preview} alt="preview" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate max-w-[200px]">{item.file.name}</p>
                        <p className="text-[9px] text-muted-foreground font-mono">{(item.file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.status === 'pending' && !isUploading && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFile(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {item.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                      {item.status === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      {item.status === 'error' && (
                        <div className="flex items-center gap-1.5 text-destructive">
                           <AlertCircle className="h-4 w-4" />
                           <span className="text-[9px] font-black uppercase">Gagal</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border bg-muted/20">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isUploading}
              className="flex-1 h-11 rounded-xl font-bold border-border"
            >
              {hasSuccessfulUploads ? "Tutup" : "Batal"}
            </Button>
            <Button 
              onClick={handleUploadAll} 
              disabled={fileQueue.length === 0 || isUploading || fileQueue.every(i => i.status === 'success')}
              className="flex-[2] h-11 rounded-xl font-black gap-2 shadow-lg shadow-primary/20"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? "Mengunggah..." : `Unggah ${fileQueue.filter(i => i.status !== 'success').length} File`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
