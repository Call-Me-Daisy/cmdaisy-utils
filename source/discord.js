const {Client} = require("discord.js");
//--------------------------------------------------------------------BOT
class DiscordBot extends Client {
	fetchCachedChannel(_channelId) {
		return this.channels.cache.get(_channelId);
	}
	async fetchChannel(_channelId) {
		return this.channels.fetch(_channelId);
	}

	async fetchMessage(_channelId, _messageId, _channelIsCached = true) {
		return (_channelIsCached)
			? this.fetchCachedChannel(_channelId).messages.fetch(_messageId)
			: this.fetchChannel(_channelId).then((_channel) => {return _channel.messages.fetch(_messageId)})
		;
	}
	fetchReference(_msg) {
		return _msg.reference !== null && this.fetchMessage(_msg.reference.channelId, _msg.reference.messageId);
	}
}
//--------------------------------------------------------------------CLEANER
const DiscordCleaner = {
	async delete(_obj) {
		(await _obj).delete().catch((e) => {});
	},
	deleteAfter(_obj, _timer) {
		setTimeout(this.delete, _timer, _obj);
	}
};
//--------------------------------------------------------------------FINALIZE
module.exports = {
	DiscordBot,
	DiscordCleaner
};
