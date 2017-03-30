"use strict"

var CORE = (function ($) {
	var modLib = {}, cacheLib = {}, _dom, _utilities;

	_utilities = {
		is_obj : function (obj) {
			return $.isPlainObject(obj);         
		},
		is_arr : function (arr) {
			return $.isArray(arr);         
		},
	}


	//methods inside CORE object
	return {
		dom : function(selector) {
			return dom(selector)
		},

		util : _utilities,

		register : function(moduleID, constructor) {
			modLib[moduleID] = {
				instantiate : constructor,
				instance 	: null
			}
		},
		list : function() {
			return (modLib)
			// console.log(modLib)
		},
		start : function (moduleID) {
			var mod = modLib[moduleID],
				
				sandbox = Sandbox.build(this, moduleID);

			if (mod) {
				mod.instance = mod.instantiate(sandbox);
// console.log("started: "+moduleID)
				mod.instance.init();
			}
		},
		stop : function(moduleID) {
			var mod = modLib[moduleID];
			if (mod.instance) {
				mod.instance.destroy()
				mod.instance = null
				console.log("stopped: "+moduleID)
			}
		},
		startAll : function() {
			var mod;

			for (mod in modLib)
			{
				if(modLib.hasOwnProperty(mod))
					this.start(mod)
			}
		},
		stopAll : function() {
			var mod;
			
			for (mod in modLib)
			{
				if(modLib.hasOwnProperty(mod))
					this.stop(mod)
			}

		},
		registerEvents : function(eventObj, callback, moduleID)
		{
			var mod = moduleID,
				module = modLib[mod],
				module, evt;

			if ( mod && modLib[mod] ) 
			{
				if (!module.events && !callback)
				{
					module.events = eventObj
					module.events.selfID = mod
				}
				else if (!module.events && callback)
				{
					module.events = {}
					module.events[eventObj] = callback
					module.events.selfID = mod
				}
				else if (module.events && callback)
				{
					module.events[eventObj] = callback			
				}
				else if (module.events && !callback) 
				{
					for (evt in eventObj)
					{
						module.events[evt] = eventObj[evt]
					}
				}
			}

		},
		triggerEvent: function(event, data) { //clean this up
			var eventObj, prop, mod, selfID, selfInst, self, callback;

// console.log("_EVENT_: "+event)

			for (prop in modLib)
			{
				if(modLib.hasOwnProperty(prop)) //get all properties of all modules
				{
					mod = modLib[prop]
					if (mod.events && (callback = mod.events[event]) ) //check if module has event we want to trigger
					{
						selfID 	 = mod.events.selfID,
						selfInst = modLib[selfID].instance,
						eventObj = {	event 	: event,
										data 	: data,
										self 	: selfInst	}
						
						if (typeof callback == "function")
							callback(eventObj) //trigger listener callback function

						else if (callback instanceof Array) {
							for (var i=0 ; i<callback.length ; i++)
								callback[i](eventObj)
						}
					}
				}
			}

		},
		unregisterEvents : function(events, moduleID)
		{
			var mod = moduleID,
				evt, evts;
			if (this.util.is_arr(events) && mod && 
				(mod = modLib[mod]) && mod.events)
			{
				// console.log(events)
				for ( evt in (evts = mod.events) )
				{
					for (var i=0 ; i<events.length ; i++)
					{
						if (evt == events[i]) {
							delete mod.events[evt]
						}
					}
				}
			}
		},
		cache: function(cachee, value) {
			if (value) {
				if (typeof cachee === "string")
					cacheLib[cachee] = value
			}
			else if (typeof cachee === "string")
				return cacheLib[cachee]
			
			else if (typeof cachee === "object")
				cacheLib[cachee.name] = cachee.data

			else
				console.log('youfuckingseriousman?')
		}
	}
}(jQuery))


var Sandbox = (function() {
	return {
		build : function (core, module_ID) {
			//object to return to module on creation through paramater (sandbox) 
			return {
				dom : function (selector) {
					return core.dom(selector)
				},
				listen : function(events, callback) {

					if (callback && typeof callback === "function" && typeof events === "string") 
						core.registerEvents(events, callback, module_ID)
					else if (typeof events === "object") 
						core.registerEvents(events, null, module_ID);

				},
				ignore: function(events) { //array

					if (core.util.is_arr(events))
					{
						core.unregisterEvents(events, module_ID)
					}
				},
				dispatch: function(eventObj, data) {
					var event;


					if (typeof eventObj === "string")
						event = eventObj
					else if (typeof eventObj === "object")
					{
						event = eventObj.type					
						data  = eventObj.data
					}
					// console.log(event)
					// console.log(data)
					core.triggerEvent(event, data)
				},
				cache: function(cachee, data) {
					var returned = core.cache(cachee, data)
					if (returned)
						return returned
				},
				utils : {
					quotesToSingle : function(string) {
						var string = string.split(""),
							// singles = [],
							doubles = [],
							i, char, atPos;

						for (i=0 ; i<string.length ; i++)
						{
							char = string[i]
							// if (char == "'")
							// 	singles.push(i)
							if (char == '"')
								doubles.push(i)
						}
						// //replace singles
						// for (i=0 ; i<singles.length ; i++)
						// {
						// 	atPos = singles[i]
						// 	string[atPos] = '"'
						// }
						//replace doubles
						for (i=0 ; i<doubles.length ; i++)
						{
							atPos = doubles[i]
							string[atPos] = "'"
						}						
						return string.join("")
					},
					getBlockID : function(block) {
						var attrs = block.attributes,

						prop, blockID
						for (var prop in attrs)
						{
							if (attrs[prop].name == 'data-id')
								blockID = attrs[prop].value
						}
						return blockID
					},
					determineParentBlock : function(node) {
						if (node.parentNode.nodeName == "SEED")
							return node.parentNode.parentNode
						else if (node.parentNode.nodeName == "BLOCK")
							return node.parentNode
					},					
					determineParentNode : function(node) {
						if (node.parentNode.nodeName == "SEED")
							return node.parentNode
						else if (node.parentNode.nodeName == "BLOCK")
							return node
						else if (node.nodeName == "BLOCK") //"<block><br></block>"
							return node.childNodes[0]
					}
				}

			}
		}
	}
}())