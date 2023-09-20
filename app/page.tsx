import { redirect } from 'next/navigation';

export default function Page() {
  redirect('editor');

  return null;
}
