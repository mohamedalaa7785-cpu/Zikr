'use client';

import { useFormStatus } from 'react-dom';
import { googleOAuthAction } from './actions';
import { Button } from '@/components/ui/button';

type GoogleOAuthButtonProps = {
  next?: string;
  label: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="secondary"
      className="w-full"
      disabled={pending}
    >
      {pending ? 'جارٍ التوجيه إلى Google...' : label}
    </Button>
  );
}

export function GoogleOAuthButton({
  next,
  label,
}: GoogleOAuthButtonProps) {
  const safeNext =
    typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')
      ? next
      : '/profile';

  return (
    <form action={googleOAuthAction} className="space-y-2">
      <input type="hidden" name="next" value={safeNext} />
      <SubmitButton label={label} />
    </form>
  );
}
