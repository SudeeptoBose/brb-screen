export default function Credits() {
    return (
      <div className="fixed top-4 left-4 flex flex-col space-y-2 text-sm text-gray-400 z-50">
        <a 
          href="https://sudeepto-bose-portfolio.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          Developed by @sudeeptobose
        </a>
        <a 
          href="https://twitter.com/bruno_simon" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          Inspired by @brunosimon
        </a>
        <a 
          href="https://twitter.com/th_ebenezer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          Fireflies by @thebenezer
        </a>
      </div>
    );
  }