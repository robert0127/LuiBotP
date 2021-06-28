const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

var VCID = null;
const fs = require('fs');

const ytdl = require('ytdl-core');

const queue = new Map();

//require('events').EventEmitter.prototype._maxListeners = 100;

client.on('guildMemberAdd', member => {
	var channel = null;
	if (member.guild.id === '630439871860965377') {
		channel = member.guild.channels.find(ch => ch.id === '630441330094637067');
		if (!channel) return;
		channel.send(`歡迎 ${member} 到步 :sunglasses: ！\n新丁請先去 `+member.guild.channels.get('630447413513158666').toString()+` 睇規則\n有咩嘢都可以係度同大家隨便講\n`+member.guild.roles.get('630442569008021505').toString()+` 會親自黎歡迎歡迎你 :heart: `);
	}
	
	if (member.guild.id === '412993050781024256') {
		channel = member.guild.channels.find(ch => ch.id === '557211121514446879');
		if (!channel) return;
		channel.send(`歡迎 ${member} 到步\n呢度唯一既規則就係無規則\n請先去 `+member.guild.channels.get('640503816437104641').toString()+` 睇注意事項\n有咩嘢都可以同大家隨便講 :wink: \n我地既`+ member.guild.roles.get('568108422525091845').toString()+` 會親自黎歡迎歡迎你 :heart: `);
		
		const role = member.guild.roles.find(r => r.name === `Ping Me!`);
		if (role)
			member.addRole(role);
	}
	
	
});

client.on('message', async message => {
	
	if (message.author.bot) return;
    //if (!message.content.startsWith('..')) return;
	
	console.log(message.guild.name+` used me`);
	if (message.content.startsWith('..')) {
		client.guilds.find(ch => ch.id === '595959036348858388').channels.find(ch => ch.id === '595959036348858390').send(message.guild.name+` used me`);
    }
	
	const args = message.content.slice(2).split(' ');
	const command = args.shift().toLowerCase();
	const serverQueue = queue.get(message.guild.id);
	
	//===Debug===
	
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
	
	//===Global commands===
	
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
		if(!message.member.permissions.has(268435456, 1)) {
			message.channel.send(`You do not have permission to purge messages!`);
		}
		else {
			if (!args[0]) {
				message.channel.send(`Please enter a number of messages that will be purged!`);
			}
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
	/*(message.author.id==='289743137583136768')&&*/
	
    /*if (message.content.includes('。。。')) {
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
	}*/
	
	//===Music===
/*
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
*/
	//===server exclusive===
	
	if (message.content === (`..pingme`||`..Pingme`||`..pingMe`||`..PingMe`)) {
		if (message.member.guild.id === '412993050781024256') {

			var memberRole = message.member.roles.find(x => x.name === "Ping Me!");
			if (memberRole) {
				message.channel.send(`You already have the "Ping Me!" role!`)
				.then((message2) => {
                    setTimeout(() => {
                        message.delete();
                        message2.delete();
                    }, 5000);
                });
			} else {
				const role = message.member.guild.roles.find(r => r.name === "Ping Me!");
				message.member.addRole(role);
				message.channel.send(`Role added! Now you will receive pings when someone "@Ping me!"!`)
				.then((message2) => {
                    setTimeout(() => {
                        message.delete();
                        message2.delete();
                    }, 5000);
                });
			}
		}
	}
	
	if (message.content === (`..muteme`||`..Muteme`||`..muteMe`||`..MuteMe`)) {
		if (message.member.guild.id === '412993050781024256') {
			var memberRole = message.member.roles.find(x => x.name === "Ping Me!");
			if (memberRole) {
				message.member.removeRole(memberRole);
				message.channel.send(`Role removed! Now you won't get pinged ;)`)
				.then((message2) => {
                    setTimeout(() => {
                        message.delete();
                        message2.delete();
                    }, 5000);
                });
			} else {
				message.channel.send(`You don't have the "Ping Me!" role!`)
				.then((message2) => {
                    setTimeout(() => {
                        message.delete();
                        message2.delete();
                    }, 5000);
                });
			}
		}
	}
	
	
	
	if (message.content === (`..givePingToAll`)) {
		
		message.channel.send(`This command is disabled`);
		return;
		
		if (message.member.guild.id === '412993050781024256') {
			const role = message.guild.roles.find(r => r.name == 'Ping Me!')

			if (!role) return message.channel.send(`**${message.author.username}**, role not found`)

			message.guild.members.filter(m => !m.user.bot).forEach(member => member.addRole(role))
			message.channel.send(`**${message.author.username}**, role **${role.name}** was added to all members`)
		}
	}
		 
			
	
	//===help===
	
	if (message.content === ('..help')) {
		message.channel.send(`version 1.4\n>>> ..ping\n..test\n..meow\n..VCLink (presence in Voice Channel needed)\n..avatar [mention]\n..invite\n..role [* mention] [* role] (Admin power needed)\n..purgemsg [* number] (Admin power needed)\n。。。`);
	}

});


//===music functions===
/*
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
*/
//===token===

client.login('//');

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