import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <h1 className="text-xl font-semibold text-[#111111]">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C89A5A] w-64"
          />
        </div>
        <button className="relative p-2 text-gray-500 hover:text-[#111111]">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#C89A5A] rounded-full" />
        </button>
        <div className="w-8 h-8 bg-[#C89A5A] rounded-full flex items-center justify-center text-white text-sm font-medium">
          A
        </div>
      </div>
    </header>
  );
}
