import React, { useState, useCallback, useRef, useEffect } from 'react';

// --- Helper Icon Components ---

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
    </svg>
);

const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </svg>
);

const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LoaderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);


const Header = () => (
    <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-2">
                    <LogoIcon className="h-6 w-6 text-blue-400" />
                    <span className="font-bold text-lg text-slate-200">Insta Short</span>
                </div>
            </div>
        </div>
    </header>
);

const Footer = () => (
    <footer className="w-full border-t border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} Insta Short. All Rights Reserved.</p>
                <p className="mt-2 sm:mt-0">Powered by D S Vinjora</p>
            </div>
        </div>
    </footer>
);

const App: React.FC = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shortUrl && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [shortUrl]);

  const handleClear = () => {
    setLongUrl('');
    setShortUrl('');
    setError(null);
    setCopied(false);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setShortUrl('');
    setCopied(false);

    if (!longUrl) {
      setError("Please enter a URL to shorten.");
      return;
    }

    try {
        new URL(longUrl);
    } catch (_) {
        setError("Please enter a valid URL.");
        return;
    }

    setIsLoading(true);
    const apiKey = "b39f11158532e3f9d8447c5f8ead1de3ef719aa1";

    try {
      const response = await fetch(`https://clicksfly.com/api?api=${apiKey}&url=${encodeURIComponent(longUrl)}`);
      
      if (!response.ok) {
        throw new Error(`The service failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        const errorMessage = data.message.charAt(0).toUpperCase() + data.message.slice(1);
        throw new Error(errorMessage);
      }
      
      if (data.status === 'success' && data.shortenedUrl) {
        setShortUrl(data.shortenedUrl);
        setLongUrl('');
      } else {
        throw new Error("Received an invalid response from the service.");
      }

    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
             setError("Could not connect to the shortening service. Please check your network connection or try again later.");
        } else {
            setError(err.message);
        }
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [longUrl]);


  const handleCopy = useCallback(() => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [shortUrl]);


  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col selection:bg-blue-500/30">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 pb-2">
                  Instant URL Shortener
                </h1>
                <p className="text-slate-400 text-lg">
                  Paste a long URL to get a shortened version instantly.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500" />
                    <input
                      type="url"
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      placeholder="https://your-long-url.com/goes-here"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg py-4 pl-12 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>

                  {error && <p className="text-red-400 mt-3 text-sm text-center">{error}</p>}
                  
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                  >
                    {isLoading ? (
                      <>
                        <LoaderIcon className="w-6 h-6"/>
                        <span>Shortening...</span>
                      </>
                    ) : (
                      "Shorten URL"
                    )}
                  </button>
                </form>
              </div>

              {shortUrl && (
                <div ref={resultRef} className="mt-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-6 animate-[fadeIn_0.5s_ease-in-out]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="font-mono text-lg text-teal-400 truncate w-full text-center md:text-left" title={shortUrl}>
                            {shortUrl}
                        </p>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button 
                                onClick={handleCopy}
                                className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 ${copied ? 'bg-teal-600' : 'bg-slate-600 hover:bg-slate-500'}`}
                            >
                                {copied ? <CheckIcon className="w-5 h-5"/> : <ClipboardIcon className="w-5 h-5"/>}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                             <button 
                                onClick={handleClear}
                                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold bg-slate-600 hover:bg-slate-500 transition-all duration-300"
                                title="Clear"
                            >
                                <XIcon className="w-5 h-5"/>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
              )}
            </div>
        </main>
        <Footer />
    </div>
  );
};

export default App;
