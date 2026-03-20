export default function WatchDrawing({ game }: { game: 'powerball' | 'mega-millions' }) {
  const channelName = game === 'powerball' ? 'Powerball' : 'Mega Millions';
  const searchQuery = game === 'powerball'
    ? 'powerball+drawing+live+latest'
    : 'mega+millions+drawing+live+latest';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Watch the Drawing</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Watch the latest {channelName} live draw</p>
      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
        <iframe
          src={`https://www.youtube.com/embed?listType=search&list=${searchQuery}&modestbranding=1&rel=0`}
          title={`${channelName} Live Drawing`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="w-full h-full"
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Drawings are held {game === 'powerball' ? 'Mon, Wed & Sat at 10:59 PM ET' : 'Tue & Fri at 11:00 PM ET'}
      </p>
    </div>
  );
}
