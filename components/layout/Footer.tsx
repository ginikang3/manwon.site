import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-between gap-4 md:flex-row text-sm text-slate-500 dark:text-slate-400">
        <div>
          <p>&copy; {new Date().getFullYear()} man-won.site. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/terms" className="hover:underline">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:underline">
            개인정보 처리방침
          </Link>
          <Link href="/refund" className="hover:underline">
            환불정책
          </Link>
        </div>
      </div>
    </footer>
  );
}