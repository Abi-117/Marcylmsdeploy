
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";


function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gold">Contact</div>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">Let's talk.</h1>
          <p className="mt-4 text-muted-foreground">Speak with an academic advisor — we usually respond within an hour.</p>
          <div className="mt-10 space-y-5 text-sm">
            <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-gold" /><div>42 Symphony Lane, Bandra West<br />Mumbai 400050</div></div>
            <div className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-gold" />+91 98200 12345</div>
            <div className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-gold" />hello@musicandspeech.academy</div>
          </div>
        </div>
        <Card>
          <CardContent className="p-7">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks! We'll be in touch."); }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>First name</Label><Input placeholder="Aarav" /></div>
                <div className="space-y-1.5"><Label>Last name</Label><Input placeholder="Patel" /></div>
              </div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="you@email.com" /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input placeholder="+91" /></div>
              <div className="space-y-1.5"><Label>How can we help?</Label><Textarea rows={4} placeholder="Tell us about your interest…" /></div>
              <Button type="submit" className="w-full bg-gold text-gold-foreground hover:bg-gold/90">Send message</Button>
            </form>
          </CardContent>
        </Card>
      </section>
      <SiteFooter />
    </div>
  );
}

export default Contact;
