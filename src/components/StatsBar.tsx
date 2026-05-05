interface Props {
  total: number;
  active: number;
  completed: number;
}

export function StatsBar({ total, active, completed }: Props) {
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-indigo-100 text-sm">今日の進捗</p>
          <p className="text-2xl font-bold">{progress}%</p>
        </div>
        <div className="text-right">
          <p className="text-indigo-100 text-xs">{completed} / {total} 完了</p>
          <p className="text-indigo-100 text-xs mt-0.5">残り {active} 件</p>
        </div>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div
          className="bg-white rounded-full h-2 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
