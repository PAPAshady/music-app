const messages = [
  {
    title: 'No Lyrics Available',
    description: "The artist said 'figure it out yourself.'",
  },
  {
    title: 'Lyrics Not Provided',
    description: 'Either the lyrics are secret… or nobody bothered. Who knows.',
  },
  {
    title: 'Lyrics Missing',
    description: 'The artist forgot too.',
  },
  {
    title: 'No Words Here',
    description: 'Just you, the beat, and pure confusion.',
  },
  {
    title: 'Lyrics Ghosted Us',
    description: "They said 'brb' six months ago.",
  },
  {
    title: 'Lyrics Unavailable',
    description: 'Even the internet couldn’t help with this one.',
  },
  {
    title: 'Lyrics Haven’t Arrived Yet',
    description: 'Congrats! You’re now the songwriter.',
  },
  {
    title: 'Song Has No Lyrics',
    description: 'Or maybe the lyrics have no song. Philosophical.',
  },
  {
    title: 'Lyrics Out of Service',
    description: 'Please enjoy our hold music.',
  },
  {
    title: 'No Official Lyrics',
    description: "You're early. The lyrics are fashionably late.",
  },
  {
    title: 'Oops... No Lyrics Here.',
    description: 'You’ll have to guess the lyrics on this one.',
  },
  {
    title: 'Lyrics Offline',
    description: 'They didn’t pay their WiFi bill.',
  },
  {
    title: 'No Lyrics At All',
    description: 'Perfect, more room for bad singing.',
  },
  { title: 'Lyrics Classified', description: 'Government said no. We didn’t ask why.' },
  {
    title: 'No Lyrics for This Track',
    description: 'Sometimes the vibe speaks louder than words.',
  },
  {
    title: 'No Words, Only Energy',
    description: 'Let the music explain itself.',
  },
  {
    title: 'Lyrics Not Uploaded',
    description: 'Maybe one day. Maybe not.',
  },
  {
    title: 'No Lyrics Detected',
    description: 'Even the bars took a day off.',
  },
  {
    title: 'Instrumental Track',
    description: 'Music speaks when words cannot.',
  },
  {
    title: 'Lyrics Not Found (404)',
    description: 'We’re all lost here. Just hum something.',
  },
  {
    title: 'No Lyrics At All',
    description: 'Perfect, more room for bad singing.',
  },
  {
    title: 'Lyrics Malfunction',
    description: 'Please reboot your vocal cords.',
  },
  {
    title: 'No Lyrics??',
    description: 'Freestyle time. Don’t be shy.',
  },
  {
    title: 'Lyrics? None.',
    description: 'But you can still scream if you want.',
  },
  {
    title: 'Lyrics Not Found',
    description: 'Try shaking your device. Might help. Probably won’t.',
  },
  {
    title: 'No Lyrics Here',
    description: 'Just close your eyes and feel the sound.',
  },
  {
    title: 'Lyrics on Vacation',
    description: 'Don’t wait for them. They’re not coming back.',
  },
];

function getRandomNoLyricsMessage() {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

export default getRandomNoLyricsMessage;
