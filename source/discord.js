const {Client} = require("discord.js");

const {splitAtAny} = require("./general");
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
//--------------------------------------------------------------------ROLLER
const DiceRoller = {
	parsePool: function(_poolStr) {
		let temp = _poolStr.toLowerCase().split("d");
		if (temp.length === 1) {return parseInt(temp[0], 10);}

		const out = {num: parseInt(temp[0], 10)};
		temp = temp[1].split("k");
		out.faces = parseInt(temp[0], 10);
		temp[1] && (out[temp[1][0]] = parseInt(temp[1].slice(1), 10));

		return out;
	},
	parseMany: function(_poolsStr) {
		const out = [];
		!(_poolsStr.startsWith("+") || _poolsStr.startsWith("-")) && (_poolsStr = "+" + _poolsStr);

		for (const poolStr of splitAtAny(_poolsStr, ["+", "-"], 0)) {
			const sign = poolStr.startsWith("-") ? -1 : 1;
			out.push([sign, this.parsePool(poolStr.slice(1))]);
		}
		return out;
	},

	rollDie: function(_faces) {
		return Math.floor(Math.random() * _faces) + 1;
	},
	rollPool: function(_pool) {
		_pool.num || (_pool.num = 1);

		const results = {};
		for (let i = 0; i < _pool.num; i++) {
			const result = this.rollDie(_pool.faces);
			results[result] = (results[result]) ? results[result] + 1 : 1;
		}
		const entries = (_pool.h) ? Object.entries(results).reverse() : Object.entries(results);

		let out = 0, keep = _pool.h || _pool.l || _pool.num;
		for (const [result, num] of entries) {
			out += result*Math.min(num, keep);
			keep -= num;
			if (keep <= 0) {break;}
		}
		return out;
	},
	rollMany: function(_pools) {
		let out = 0;
		for (const entry of ((_pools instanceof Array) ? _pools : [_pools])) {
			const [sign, pool] = (entry instanceof Array) ? entry : [1, entry];
			out += sign*((pool.faces) ? this.rollPool(pool) : pool);
		}
		return out;
	},
	rollStr: function(_poolsStr) {
		return this.rollMany(this.parseMany(_poolsStr));
	}
}
//--------------------------------------------------------------------FINALIZE
module.exports = {
	DiscordBot,
	DiscordCleaner,
	DiceRoller
};
