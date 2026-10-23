import { Phone } from "lucide-react";
import { Button, Container } from "./ui";
import { FadeIn } from "./motion";
import { site } from "@/data/site";

export default function CtaBanner({
  title = "Need an inspection scheduled?",
}: {
  title?: string;
}) {
  return (
    <section className="bg-navy py-10 text-white sm:py-16 lg:py-20">
      <Container>
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
                {title}
              </h2>
              <p className="mt-2 text-base text-babyblue sm:mt-3 sm:text-lg">
                Tell us what you need surveyed and where. We&apos;ll follow up to confirm.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button href="/contact" variant="white">
                Request a Survey
              </Button>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 rounded-xl px-2 py-3 text-base font-semibold text-white hover:text-babyblue"
              >
                <Phone size={18} aria-hidden="true" />
                {site.phone}
              </a>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
