import { CalendarWheel } from "@/components/calendar/CalendarWheel";
import { RevealHeading } from "@/components/site/RevealHeading";

export function HomeCalendar() {
  return (
    <section data-tone="sage" aria-labelledby="kalendarz" className="py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <RevealHeading id="kalendarz" className="text-h2 lg:col-span-7">Co zbierać w tym miesiącu?</RevealHeading>
          <p className="measure text-muted-foreground lg:col-span-5 lg:self-end">
            Rok w zielniku w jednym kole. Obróć je na dowolny miesiąc i zobacz, które rośliny można zebrać i którą ich część.
          </p>
        </div>
        <div className="mt-16">
          <CalendarWheel variant="compact" />
        </div>
      </div>
    </section>
  );
}
