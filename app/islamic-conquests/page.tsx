import { redirect } from 'next/navigation';

// /islamic-conquests is a legacy alias — the canonical page is /conquests.
export default function IslamicConquestsRedirect() {
  redirect('/conquests');
}
