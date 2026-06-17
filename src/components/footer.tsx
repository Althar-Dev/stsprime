
"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-headline text-base font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-headline text-lg font-bold text-foreground">STS PEDIA</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Empowering gamers worldwide with instant digital top-ups and premium connectivity services.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-bold text-foreground">Services</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Game Top-up</Link></li>
              <li><Link href="#" className="hover:text-primary">E-Voucher</Link></li>
              <li><Link href="#" className="hover:text-primary">Credit & Data</Link></li>
              <li><Link href="#" className="hover:text-primary">Subscription</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-foreground">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-foreground">Newsletter</h4>
            <p className="mt-4 text-sm text-muted-foreground">Get updates on new discounts and hot releases.</p>
            <div className="mt-4 flex gap-2">
              <input type="email" placeholder="Email address" className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <button className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground">Join</button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} STS Pedia. All rights reserved. Built for the community.
        </div>
      </div>
    </footer>
  );
}
