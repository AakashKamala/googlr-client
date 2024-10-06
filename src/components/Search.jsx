import React, { useState, useEffect } from 'react';
import "./search.css"

const Search = () => {
    const [sources, setSources] = useState([]);
    const [overview, setOverview] = useState("");
    const [query, setQuery] = useState("");
    const [showImages, setShowImages] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [time, setTime] = useState("");

    useEffect(() => {
        const callApiEvery3Seconds = () => {
            setInterval(async () => {
                try {
                    const response = await fetch('https://googlr-server.onrender.com/alive');
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    const data = await response.json();
                    setTime(data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }, 60000); 
            return () => clearInterval(intervalId);
        };
        callApiEvery3Seconds();
    }, []);

    useEffect(() => {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }, [sources]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`https://googlr-server.onrender.com/search?q=${query}`);
            const data = await response.json();
            setSources(data.results.results);
            setOverview(data.answer);
            setShowImages(false);
        } catch (error) {
            console.error("Error while fetching results: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const imageSearch = () => {
        setShowImages(true);
    };

    return (
        <div className="search-container">
            <h1 className="search-title">Where knowledge begins</h1>
            {/* <h2>{time}</h2> */}
            <form onSubmit={handleSearch} className="search-form">
                <input
                    name="q"
                    placeholder="Ask anything..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    className="search-input"
                />
                <button type="submit" className="search-button" disabled={isLoading}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </form>

            {overview && (
                <div id="overview" className="overview-container">
                    <p dangerouslySetInnerHTML={{ __html: overview }} />
                </div>
            )}

            {sources.length > 0 && (
                <div className="results-container">
                    <h2 className="results-title">Sources</h2>
                    {sources.map((source, index) => (
                        <div key={index} className="result-item">
                            <a href={source.url} className="result-link">
                                <h3 className="result-title">{source.title}</h3>
                                <p className="result-meta">
                                    {source.publishedDate} • {source.author}
                                </p>
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {sources.length > 0 && !showImages && (
                <button id="search-images" type="button" onClick={imageSearch} className="image-search-button">
                    Search Images
                </button>
            )}

            {showImages && (
                <div className="image-container">
                    {sources.map((source, index) => (
                        <div key={index} className="image-item">
                            {source.image ? (
                                <img src={source.image} alt={source.title} className="result-image" />
                            ) : (
                                <div className="no-image">No Image Available</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Search;
