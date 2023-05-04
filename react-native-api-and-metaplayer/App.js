import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Image, Linking, StyleSheet, Text, View, ScrollView, Button, FlatList, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import SoundPlayer from 'react-native-sound-player'

export default function App() {
	// SoundPlayer.setCategory('Playback');
	const [songs, setSongs] = useState([]);
	const [selectedSong, setSelectedSong] = useState(0);
	const [apiKey] = useState('[add your API Key from https://music.soundpickr.com]');

	useEffect(() => {
		getPlaylist('[add your playlist key]');
	}, []);

	useEffect(() => {
		async function fetchData() {
			if (songs.length > 0) {
				try {
					// console.log(songs[selectedSong].song_url + '?api_key=' + apiKey);
					// SoundPlayer.play();
					SoundPlayer.playUrl(songs[selectedSong].song_url + '?api_key=' + apiKey)
				} catch (e) {
					console.log('cannot play the sound file', e);
				}
			}
		}
		fetchData();
	}, [songs, selectedSong]);

	const getPlaylist = (playlist_key) => {
		fetch('https://api.soundpickr.com/api/v1/metaplayer/playlist/' + playlist_key, {
			method: 'GET',
			headers: {
				'x-api-key': apiKey
			},
		})
			.then(response => response.json())
			.then(data => {
				// console.log(data.songs);
				setSongs(data.songs);
			})
			.catch(error => {
				console.error(error.toString());
			});
	}

	return (
		<>
			<StatusBar style="auto" />

			<ScrollView>
				<View style={styles.container}>
					{songs.length !== 0 &&
						<View className="player">
							<View className="player__top">
								<Image source={{ uri: songs[selectedSong].image_url }} style={{ width: 100, height: 100 }} />

								<View className="player__top__controls">
									<View style={{ display: 'flex' }}>

										{/* <View style={styles.container}>
											<TouchableOpacity style={styles.playBtn} onPress={playPause}>
												<Ionicons name={'ios-play-outline'} size={36} color={'#fff'} />
											</TouchableOpacity>
										</View> */}

										<Button style={{ width: '50%', color: 'red' }} title="&lt;" className="player__top__controls__prev" onPress={() => setSelectedSong(selectedSong === 0 ? selectedSong : (selectedSong - 1))} />
										<Button style={{ width: '50%' }} title="&gt;" className="player__top__controls__next" onPress={() => setSelectedSong(selectedSong === (songs.length - 1) ? 0 : (selectedSong + 1))} />
									</View>
								</View>

							</View>
							<View className="player__list">
								{songs.length !== 0 &&
									songs.map((song, id) =>
										<Button key={id} title={song.name + ' ' + (song.artist ? song.artist.name : '')} className={'player__list__song' + (selectedSong === id ? ' --selected' : '')} onPress={() => setSelectedSong(id)} />
									)
								}
							</View>
						</View>
					}
				</View>
			</ScrollView>

			<View style={{ position: 'absolute', bottom: 0, left: 0, height: 300, width: '100%' }}>
				<WebView source={{ html: '<iframe width="100%" height="100%" src="https://metaplayer.soundpickr.com?api_key=' + apiKey + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>' }} />
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 50,
	},
});
