const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

var VCID = null;
const fs = require('fs');

const ytdl = require('ytdl-core');

const queue = new Map();

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === '歡迎到步');
	
	if (!channel) return;
	
	channel.send(`歡迎 ${member} 到步 :sunglasses: ！\n新丁請先去 `+member.guild.channels.get('630447413513158666').toString()+` 睇規則\n有咩嘢都可以係度同大家隨便講\n`+member.guild.roles.get('630442569008021505').toString()+` 會親自黎歡迎歡迎你 :heart: `);
});

client.on('message', async message => {
	
	if (message.author.bot) return;
    //if (!message.content.startsWith('..')) return;
	
	const args = message.content.slice(2).split(' ');
	const command = args.shift().toLowerCase();
	const serverQueue = queue.get(message.guild.id);
	
	if (message.content === '..ping') {
		message.channel.send('pong');
	}
	if (message.content === '..test') {
		message.channel.send('Hello World!');
	}

	if (message.content.startsWith('..meow')) {
			message.channel.send(`..meow`)
	.then((message2) => {
                    setTimeout(() => {
                        message.delete();
                        message2.delete();
                    }, 3000);
                });
	}
	
	/*if (message.content.startsWith('im')) {
	message.channel.send(`hi ${args[0]} im dad!`)
	.then((message2) => {
                    setTimeout(() => {
                        message.delete();
                        message2.delete();
                    }, 3000);
                });
	}*/
	
	if (message.content.startsWith('..avatar')) {
		if (args[0]) {
			const user = message.mentions.users.first();
			message.channel.send(`${user}'s avatar: ` + user.avatarURL);
		} else {
			message.channel.send(`your avatar: ` + message.author.avatarURL);
		}
	}
 
	if (message.content === '..invite') {
		message.channel.createInvite({maxAge:600})
		.then(invite => message.channel.send(`${invite.url}`));
	}

	if (message.content === ('..VCLink') || message.content === ('..v') ) {
		VCID = message.member.voiceChannelID;
		if(VCID) {
			message.channel.send('<https://discordapp.com/channels/'+message.guild.id+'/'+message.member.voiceChannelID+'>')
			.then((message2) => {
                    setTimeout(() => {
                        message.delete();
                        message2.delete();
                    }, 30000);
                });
        }
    
		else
			message.reply('You are not in a Voice Chatroom!');
		VCID = null;
	}

	if (message.content.startsWith('..role')) {
		if (message.mentions.members.first()) {
			const member = message.mentions.members.first();
			if(!message.member.permissions.has(268435456, 1)) 
				message.channel.send(`You do not have permission to add roles!`);
			else
			if (args[1]) {
				const role = message.guild.roles.find(r => r.name === `${args[1]}`);
				member.addRole(role);
				message.channel.send(`Role added!`);
			} else {
			message.channel.send(`No role mentioned!`);
			}
		} else {
			message.channel.send(`No member mentioned!`);
		}
	}
	
	if (message.content.startsWith('..purgemsg')) {
		if(!message.member.permissions.has(268435456, 1))
			message.channel.send(`You do not have permission to purge messages!`);
		else {
			if (!args[0])
				message.channel.send(`Please enter a number of messages that will be purged!`);
			else {
			message.channel.bulkDelete(parseInt(`${args[0]}`)+1)
			.catch(console.error);
			message.channel.send(`Bulk deleted ${args[0]} messages`)
			.then((message2) => {
                    setTimeout(() => {
                        message.delete();
                        message2.delete();
                    }, 5000);
                });
			}
		}
    }
	
	
    if (/*(message.author.id==='289743137583136768')&&*/(message.content.includes('。。。'))) {
		
		
		fs.readFile('Count.txt', (err, data) => {
		if (err) throw err;
			data++;
			message.reply(`在我看得見的地方 。。。 已經被傳`+data+`次了`);
			
			fs.writeFile('Count.txt', data , function(err) {
				if(err) {
					return console.log(err);
				}
			})
			
		})
		
	}
	
	

	if (message.content.startsWith(`..play`)) {
		execute(message, serverQueue);
		return;
	}
	
	if (message.content.startsWith(`..skip`)) {
		skip(message, serverQueue);
		return;
	}
	
	if (message.content.startsWith(`..stop`)) {
		stop(message, serverQueue);
		return;
	}
	
	if (message.content === ('..help')) {
		message.channel.send(`>>> ..ping\n..test\n..meow\n..VCLink (presence in Voice Channel needed)\n..avatar [mention]\n..invite\n..role [* mention] [* role] (Admin power needed)\n..purgemsg [* number] (Admin power needed)\n。。。`);
	}

});

async function execute(message, serverQueue) {
	const args = message.content.split(' ');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
	}

	const songInfo = await ytdl.getInfo(args[1]);
	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		return message.channel.send(`${song.title} has been added to the queue!`);
	}

}

function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('I am not in a voice channel!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}


client.login('NTk1OTE3MjU2MzExOTYzNjQ4.XRx-WA.4EbhxbPaWXRCROMQ3yqqagzSah8');

/*
	if (message.content === '..channelID') {
		message.reply(message.guild.id);
	}

	if (message.content.startsWith('..setVCID')) {
		VCID = `${args[0]}`;
		message.channel.send(`string detected: ${args[0]}`);
	}
	
	if (message.content === ('..myVCID')) {
		if(VCID)
		message.reply(VCID);
	else 
		message.reply('VCID not found');
	}
	
	if (message.content === ('..clearVCID')) {
		VCID = null;
	}


	if (message.content === ('..v')) {
		VCID = `${args[0]}`;
		if(args[0])
			message.channel.send('https://discordapp.com/channels/'+message.guild.id+'/'+VCID);
		else
			message.reply('VCID not found');
		VCID = null;
	}

*/