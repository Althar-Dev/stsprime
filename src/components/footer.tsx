"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 md:mt-20 border-t border-border bg-card/20 py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-headline text-base font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-headline text-lg font-black tracking-tighter text-foreground">STS Pedia</span>
            </Link>
            <p className="mt-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
              Empowering gamers worldwide with instant digital top-ups and premium connectivity services. Fast, secure, and reliable since day one.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs md:text-sm text-foreground tracking-widest mb-4">Services</h4>
            <ul className="space-y-3 text-xs md:text-sm text-muted-foreground font-bold">
              <li><Link href="/" className="hover:text-primary transition-colors">Game Top-up</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">E-Voucher</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Credit & Data</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Subscription</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs md:text-sm text-foreground tracking-widest mb-4">Support</h4>
            <ul className="space-y-3 text-xs md:text-sm text-muted-foreground font-bold">
              <li><Link href="/status" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs md:text-sm text-foreground tracking-widest mb-4">Newsletter</h4>
            <p className="text-[10px] md:text-xs text-muted-foreground font-bold mb-4">Get updates on new discounts and hot releases.</p>
            <div className="flex flex-col gap-2">
              <input type="email" placeholder="Email address" className="h-10 w-full rounded-lg border border-border bg-background px-4 text-xs outline-none focus:border-primary transition-colors" />
              <button className="h-10 w-full rounded-lg bg-primary px-4 text-xs font-black text-primary-foreground hover:bg-primary/90 transition-colors">Join Hub</button>
            </div>
          </div>
        </div>
        <div className="mt-12 md:mt-16 border-t border-border pt-8 text-center">
          <p className="text-[9px] md:text-[10px] text-muted-foreground font-black tracking-[0.2em]">
            © {new Date().getFullYear()} STS Pedia. All rights reserved. Built for the community.
          </p>
        </div>
      </div>
    </footer>
  );
}
