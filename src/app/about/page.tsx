'use client';

export default function AboutPage() {
    return (
        <div className="flex items-center">
            <img src="/tmdb.svg" alt="TMDB Logo" className="h-40" />
            <p className="ml-2">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
        </div>
    );
}
