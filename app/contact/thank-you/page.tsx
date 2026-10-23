import type { Metadata } from "next";
import { CheckCircle2, Phone } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Request Received",
  description: "Your survey request has been received. Carew & Company Marine Survey will be in touch shortly.",
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <section className="bg-babyblue-light pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-8 text-center shadow-sm sm:p-12">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-babyblue text-navy">
            <CheckCircle2 size={32} aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">
            Request received.
          </h1>
          <p className="mt-4 text-lg text-muted">We&apos;ll be in touch shortly.</p>
          <a
            href={site.phoneHref}
            className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-navy hover:underline"
          >
            <Phone size={20} aria-hidden="true" />
            {site.phone}
          </a>
          <div className="mt-8">
            <Button href="/">Back to home</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
