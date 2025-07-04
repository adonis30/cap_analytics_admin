// app/[locale]/page.tsx
import { redirect } from "next/navigation";

export default function LocaleRedirect({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/dashboard`);
}
