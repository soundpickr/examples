import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Player() {
    const [songs, setSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(0);
    const audioRef = useRef();

    useEffect(() => {
        getPlaylist('[add your playlist key]');
    }, []);

    useEffect(() => { // when the song changes, re initialize the player
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
            audioRef.current.play();
        }
    }, [selectedSong]);

    const getPlaylists = () => { // how to get the list of playlists of the API Key owner. In this example this code is not used as we already load data from a specific playlist key
        fetch('https://api.soundpickr.com/api/v1/playlists', {
            method: 'GET',
            headers: {
                'X-API-KEY': process.env.NEXT_PUBLIC_SP_API_KEY, // it's always better to add our API Key inside your env file
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                data.playlists.map(element => {
                    // console.log(element.key);
                    getPlaylist(element.key);
                });
            })
            .catch(error => {
                console.error(error.toString());
            });
    }

    const getPlaylist = (playlist_key) => {
        fetch('http://api.soundpickr.local/api/v1/metaplayer/playlist/' + playlist_key, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.NEXT_PUBLIC_SP_API_KEY,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                data.songs.map(song => {
                    // console.log(song);
                    setSongs(prevState => [{ name: song.name, artist: song.song_artist, image_url: song.image_url, song_url: song.song_url + '?api_key=' + process.env.NEXT_PUBLIC_SP_API_KEY }, ...prevState]); // each song requires the API Key to be passed as a api_key parameter
                });
            })
            .catch(error => {
                console.error(error.toString());
            });
    }

    return (
        <>
            {songs.length !== 0 &&
                <div className="player">
                    <div className="player__top">
                        <Image src={songs[selectedSong].image_url} alt={songs[selectedSong].name} height={100} width={100} />
                        <br />
                        <br />

                        <div className="player__top__controls">
                            <div className="player__top__controls__prev" onClick={() => setSelectedSong(selectedSong === 0 ? selectedSong : (selectedSong - 1))}>&lt;</div>

                            <audio controls controlsList="nodownload noplaybackrate nodownload" preload="metadata" ref={audioRef}>
                                <source src={songs[selectedSong].song_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>

                            <div className="player__top__controls__next" onClick={() => setSelectedSong(selectedSong === (songs.length - 1) ? 0 : (selectedSong + 1))}>&gt;</div>
                        </div>

                    </div>
                    <div className="player__list">
                        {songs.length !== 0 &&
                            songs.map((song, id) =>
                                <div key={id} className={'player__list__song' + (selectedSong === id ? ' --selected' : '')} onClick={() => setSelectedSong(id)}>
                                    <div className="player__list__song__name">{song.name}</div>
                                    <div className="player__list__song__artist">{song.artist?.name}</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            }
        </>
    );
}
