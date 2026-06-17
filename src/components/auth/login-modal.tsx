"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, Chrome, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth process
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
    }, 1500);
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "w-[95vw] sm:max-w-[400px] max-h-[90vh] p-0 overflow-y-auto border-border bg-background rounded-2xl sm:rounded-3xl outline-none",
        "modal-scrollbar"
      )}>
        <div className="bg-primary p-6 md:p-8 flex flex-col items-center text-primary-foreground sticky top-0 z-10">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center mb-4">
            {mode === "login" ? (
              <ShieldCheck className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />
            ) : (
              <UserPlus className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />
            )}
          </div>
          <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-center">
            {mode === "login" ? "Welcome Back" : "Join the Hub"}
          </DialogTitle>
          <DialogDescription className="text-primary-foreground/80 font-bold text-[10px] md:text-xs mt-1 text-center">
            {mode === "login" 
              ? "Access your order history and faster checkout" 
              : "Create an account to start tracking your purchases"}
          </DialogDescription>
        </div>

        <div className="p-5 md:p-8 space-y-5 md:space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 h-11 bg-muted/30 border-border focus:ring-primary text-sm"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Password
                </Label>
                {mode === "login" && (
                  <button type="button" className="text-[10px] font-black text-primary hover:underline">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-11 bg-muted/30 border-border focus:ring-primary text-sm"
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="confirmPassword" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11 bg-muted/30 border-border focus:ring-primary text-sm"
                    required
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (mode === "login" ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[9px] md:text-[10px] uppercase font-black">
              <span className="bg-background px-3 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-11 rounded-xl border-border bg-card/50 font-bold text-sm hover:bg-muted/50 transition-colors"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google Account
          </Button>

          <p className="text-center text-[10px] md:text-[11px] text-muted-foreground font-bold">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button onClick={toggleMode} className="text-primary hover:underline font-black">Create one</button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={toggleMode} className="text-primary hover:underline font-black">Sign in</button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}