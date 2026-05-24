
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How does the progression system work?", a: "Every student begins in the Foundation program. Upon mentor approval, the Intermediate level unlocks. Payment for the next level only opens after the previous level is verified complete." },
  { q: "Can I switch between online and offline classes?", a: "Yes — Hybrid batches let you toggle per session. Your attendance and progression carry across both modes." },
  { q: "Which platform is used for online classes?", a: "Teachers schedule classes on Google Meet or Zoom. The meeting link is shown in your student dashboard with a one-click 'Join Class' button." },
  { q: "Do you prepare for Trinity examinations?", a: "Yes. Our Trinity Grade track maps directly to Trinity College London syllabi from Grade 1 to Grade 8, with a 98% pass rate." },
  { q: "Is there a free trial?", a: "Yes — every new learner gets one free 30-minute trial class with a senior mentor before enrolling." },
];


function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-gold">FAQ</div>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">Questions, answered.</h1>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i${i}`}>
              <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <SiteFooter />
    </div>
  );
}

export default FAQ;
