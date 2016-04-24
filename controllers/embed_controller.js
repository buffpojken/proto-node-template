var express 			= require('express');
var router 				= express.Router();
var db 					= require('./../models');
var oembed				= require('oembed');
var redis				= require('redis');
var Promise				= require('bluebird');
var _					= require('underscore');
var cheerio				= require('cheerio');
var crypto				= require('crypto');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
var client = redis.createClient();

function _parse_oembed(data, url) {
	var embed = {
		width: data.width,
		height: data.height,
		type: data.type
	};

	var dom = cheerio.load(data.html);
	var elements = dom('*');

	if (elements.length == 1) {
		embed.url = dom(elements[0]).attr('src');
	} else {
		console.log(url, encodeURIComponent(url));
		embed.url = '/embed/iframe?url=' + encodeURIComponent(url);
		embed.content = data.html;
	}

	return embed;
}

function _get_embeds(urls) {
	var hashes = _.map(urls, (url) => {
		return crypto.createHash('sha1').update(url).digest('hex');
	});


	return Promise.all(_.map(urls, (url, key) => {
		return new Promise((resolve, reject) => {

			Promise.all(_.map(hashes, (hash) => {
				return new Promise((cache_resolve, cache_reject) => {
					client.getAsync(hash).then(function(data) {
				    	cache_resolve(JSON.parse(data));
					}).catch(function(err) {
						cache_reject(err);
					});
				});
			})).then(function (cache) {
				if (cache[key] !== undefined && cache[key] !== null) {
					resolve(cache[key]);
				} else {
					oembed.fetch(url, { maxwidth: 320 }, function(error, result) {
					    if (error) {
					        reject(error);
					    } else {
					    	var embed_data = _parse_oembed(result, url);
							client.set(hashes[key], JSON.stringify(embed_data));
							client.expire(hashes[key], 60);
					        resolve(embed_data);
					    }
					});
				}
			});
		});
	}));
}

// http://localhost:3000/embed?urls[]=https%3A%2F%2Fwww.youtube.com%2Fwatch%2FNHQFbyOzwBc&urls[]=https%3A%2F%2Fwww.flickr.com%2Fphotos%2Fbees%2F2341623661
router.get('/', function(req, res){
	var urls = req.query.urls;
	_get_embeds(urls).then((data) => {
		res.json(data);
	}).catch((err) => {
		new Error(err);
	});
});

// http://localhost:3000/embed/iframe/https%3A%2F%2Fwww.flickr.com%2Fphotos%2Fbees%2F2341623661
router.get('/iframe/', function(req, res){
	console.log(req.params.url);
	_get_embeds([decodeURIComponent(req.query.url)]).then((embeds) => {
		res.send(embeds[0].content);
	});	
});

module.exports = {
	route: "/embed", 
	controller: router
}
