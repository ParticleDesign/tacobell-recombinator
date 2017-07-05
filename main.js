"use strict"

var app = {
	self,
//.................. config ...................
	numberOfIngredients:0,
	weightedArray_ingredientCountChances: [
		{item:1, chance: .02},
		{item:2, chance: .03},
		{item:3, chance: .1},
		{item:4, chance: .2},
		{item:5, chance: .26},
		{item:6, chance: .21},
		{item:7, chance: .1},
		{item:8, chance: .05},
		{item:9, chance: .03}
		//{item:10, chance: .02}

		// {item:1, chance: 0},
		// {item:2, chance: 0},
		// {item:3, chance: 0},
		// {item:4, chance: 1},
		// {item:5, chance: 0},
		// {item:6, chance: 0},
		// {item:7, chance: 0},
		// {item:8, chance: 0},
		// {item:9, chance: 0},
		// {item:10, chance: 0} 

	],

	//chances have to add up to 1.0
	weightedArray_ingredientTypeChances: [
		{item:"meat", 		chance:.2},
		{item:"sauce", 		chance:.2},
		{item:"exterior", 	chance:.1},
		{item:"topping", 	chance:.3},
		{item:"filling", 	chance:.2},

		/*{item:"meat", 		chance:.0},
		{item:"sauce", 		chance:.0},
		{item:"exterior", 	chance:.0},
		{item:"topping", 	chance:1},
		{item:"filling", 	chance:.0}, */
	],

	animationInterval_ingredients: 250,
	animationInterval_banner: 300,
	animationInterval_bannerText: 400,
	animationInterval_bannerTextExpandedPause:150,
//........... global variables .................
	//meal model
	meal:[],
	mealName: "",
	mealHash: "",
	
	//JSON ingredients
	ingredientsArray:[], 
		sauceArray: [], exteriorArray: [], meatArray: [], toppingArray: [], fillingArray: [],
	//
	ingredientContainerIDs:[],


	soundOn: false,

//..................................... application .............................................
	init: function() {
		self = this

		//create Ingredient Arrays that can be pulled from with Recombinator  
		self.fetchIngredientsFromJSON()
		$.getJSON('ingredients.json', function( JSONarray ){ 
			self.cacheIngredientArrays(JSONarray)

			var url 		= window.location.href
			var mealPath 	= url.match(/\#[^\]]+/g) //get characters after ? in url

			if (mealPath)	{ 

				var $landing_page = $('div#landing_page')
				var $recombinator_page = $('div#recombinator_page')

				$landing_page.transition({
					'transform':"translate(-100%)"
				},0)
				$recombinator_page.transition({
					'transform':"translate(0%)"
				},0)
				self.meal = self.mealModelFromMealPath(mealPath)

				self.createMealName()
				self.displayMealDivs()
			}
		})

		//checkUrl
		// self.checkUrl()

		//set handlers:
		self.armStartButton()
		self.armRecombinateButton()
		self.armShareButton()
		self.armSoundToggle()

		// //play intro sound
		// var chalupa = new Audio("sounds/chalupa.mp3"); // buffers automatically when created
		// chalupa.play();

	},
		cacheIngredientArrays: function(JSONarray) {
			JSONarray.forEach(function(item) {
				var currentIngredientType = item.type;

				if 		(currentIngredientType === "sauce") 	self.sauceArray.push(item)
				else if (currentIngredientType === "exterior") 	self.exteriorArray.push(item)
				else if (currentIngredientType === "meat") 		self.meatArray.push(item)
				else if (currentIngredientType === "topping") 	self.toppingArray.push(item)
				else if (currentIngredientType === "filling") 	self.fillingArray.push(item)
			
				self.ingredientsArray.push(item)
			})
		},
		mealModelFromMealPath: function(mealPath) {
			var mealPath = mealPath.toString().substring(1)
			var mealPathArray = mealPath.match(/.{1,1}/g)

			var meal = []

			mealPathArray.forEach(function(item) {
				var currentIngredient = $.grep(self.ingredientsArray, function(e){ 
					return e.hash == item
				})[0]

				meal.push(currentIngredient)
			})

			return meal
		},		
// 	checkUrl: function(){
// 		var url 	= window.location.href
// 		var origin 	= window.location.origin
// console.log(url)
// 		console.log(url.match(/\?[^\]]+/g))
// 	},


	armStartButton: function(){
		var $landing_page = $('div#landing_page')
		var $recombinator_page = $('div#recombinator_page')

		$('div#title').on('click', function(){
			console.log("Title clicked!");

			$landing_page.transition({
				'transform':"translate(-100%)"
			},500)
			$recombinator_page.transition({
				'transform':"translate(0%)"
			},500, function(){
				self.recombinate()
				self.displayMealDivs()
			})

			var audioSprite = document.getElementById("squish")
			audioSprite.load()

			var bong = document.getElementById("bell")
			bong.load()

			ga('send', 'event', 'Enter', 'enter_the_recombinator'); // log click in Analytics

			
			// load sounds here for iOS
			//var audioSprite = document.getElementById("squish")
			//audioSprite.load()

			//var bong = document.getElementById("bell")
			//bong.load()
			//audioSprite.play()
			//var squish = document.getElementById("squish")
			//squish.load()
			//console.log(squish)
		})

		$('div#sound_on').on('click', function() {
			console.log("sound on clicked!")
			if (self.soundOn == false) {
				//$('div#sound_on').html("<img class='inline-img' src='images/headphones.png' />SOUND <span id='headphone_toggle'>ON </span>TO HEAR THE FLAVOR")
				//$('div#sound_on').html("<img src='images/sound_on_button.svg' />")
				$('div#sound_on').css('background-position', '0px 99.6%')

				
				$('div#sound_control').css('background-position', '-3px 0px')
				self.soundOn = true;
				ga('send', 'event', 'Sound', 'toggle_on'); // log click in Analytics


				/*var audioSprite = document.getElementById("squish")
				audioSprite.load()

				var bong = document.getElementById("bell")
				bong.load()*/

			} else {
				//$('div#sound_on').html("<img class='inline-img' src='images/headphones.png' />SOUND <span id='headphone_toggle'>OFF</span> TO KEEP IT MELLOW")
				//$('div#sound_on').html("<img src='images/sound_off_button.svg' />")
				$('div#sound_on').css('background-position', '0px 0px')

				
				$('div#sound_control').css('background-position', '-46px 0px')
				self.soundOn = false;
				ga('send', 'event', 'Sound', 'toggle_off'); // log click in Analytics
			}
		})

		//arm "recombinator!" header home button
		$('div#header_text').on('click', function() {
			$landing_page.transition({
				'transform':"translate(0%)"
			})
			$recombinator_page.transition({
				'transform':"translate(100%)"
			},500, function() {

				//hide recombinator contents
				$('div#recombinator').html('')
				$('div#meal_title').css('opacity', '0')
			})
			window.location.hash = ""
		})



	},
	armRecombinateButton: function() {
		$('div#recombinate_button').on("click", function(){
// console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
			$('div#recombinate_button').addClass('disabled')
			
			self.clearCurrentMeal()

			setTimeout(function() {
				$('div#recombinator').html("");
				self.recombinate();
				self.displayMealDivs();
			}, self.animationInterval_ingredients*(self.numberOfIngredients/2))

			//self.clearCurrentMeal()

			//$('div#recombinator').html("")	//clear previous meal view

			//self.recombinate()					//start new meal
			//self.displayMealDivs();
			if ($('.share_item').hasClass('show-cards')) {
					$('div#share_button_text').html("SHARE THIS COMBO");
					console.log("checking for class...")
					$('.share_item').each(function(i) {
						setTimeout(function() {
							document.getElementsByClassName("share_item")[2-i].classList.add('hide-cards');
							document.getElementsByClassName("share_item")[2-i].classList.remove('show-cards')
						}, 200 * (i*.40))
					})
			}

			ga('send', 'event', 'Recombinator', 'recombinate'); // log click in Analytics

		})

	},

	armShareButton: function() {
		//var share_menu = document.getElementByID("#share_menu");
		$('div#share_button').on("click", function() {
			
			if ($('div#meal_url').html('')) {
				$("div#meal_url").html(window.location.href); 
			}

			var shareItems = []
			shareItems.push(document.getElementsByClassName("share_item"))
			console.log("share clicked!")
			//console.log(shareItems);
			
			if ($('.share_item').hasClass('show-cards')) {
				$('div#share_button_text').html("SHARE THIS COMBO");
				console.log("checking for class...")
				$('.share_item').each(function(i) {
					setTimeout(function() {
						document.getElementsByClassName("share_item")[2-i].classList.add('hide-cards');
						document.getElementsByClassName("share_item")[2-i].classList.remove('show-cards')
					}, 200 * (i*.40))
				})

				console.log("we're at the bottom...")
			} else {
				$('.share_item').each(function(i) {
					$('div#share_button_text').html("<img src='/images/close_share_menu.png' />");
					console.log("showing cards");
					//var item = $(this);
					setTimeout(function() {
						document.getElementsByClassName("share_item")[i].classList.remove('hide-cards')
						document.getElementsByClassName("share_item")[i].classList.add('show-cards');
					}, 200 * (i*.5))
				})
			}

			$('div#twitter').on('click', function() {
				ga('send', 'event', 'Share', 'twitter'); // log click in Analytics
				console.log('twitter clicked');
			})

			$('div#fb').on('click', function() {
				ga('send', 'event', 'Share', 'facebook'); // log click in Analytics
			})

  			$('div#copy_group').on('click', function() {
  				var meal_url = document.getElementById('meal_url')

				if ( document.selection ) {
           			var range = document.body.createTextRange();
            		range.moveToElementText( meal_url  );
            		range.select();
        		} else if ( window.getSelection ) {
            		var range = document.createRange();
            		range.selectNodeContents( meal_url );
            		window.getSelection().removeAllRanges();
            		window.getSelection().addRange( range );
        		}

        		try {
    				var successful = document.execCommand('copy');
   	 				var msg = successful ? 'successful' : 'unsuccessful';
    				console.log('Copying text command was ' + msg);
				   	$('div#link_copied_modal').show().fadeOut(3000);
   	  				ga('send', 'event', 'Share', 'link_copied'); // log click in Analytics

  				} catch (err) {
    				console.log('Unable to copy');
  				}



        	});
		})
	},

	armSoundToggle: function() {
		$('div#sound_control').on("click", function() {
			//alert("Sound off!");
			if (self.soundOn == false) {
				self.soundOn = true;

				$('div#sound_on').css('background-position', '0px 100%')

				$('div#sound_control').css('background-position', '-3px 0px')

				var audioSprite = document.getElementById("squish")
				audioSprite.load()

				var bong = document.getElementById("bell")
				bong.load()

				ga('send', 'event', 'Sound', 'toggle_on'); // log click in Analytics

			} else { 
				self.soundOn = false; 

				$('div#sound_on').css('background-position', '0px 0px')

				$('div#sound_control').css('background-position', '-46px 0px')

				ga('send', 'event', 'Sound', 'toggle_off'); // log click in Analytics


			}

			console.log("soundOn = " + self.soundOn)


		})
	},

	//seperates Ingredient objects from JSON Array into a seperate array for each ingredient Type 
	//self.sauceArray = [{ingredient, type, address},{etc.}], self.meatArray = [{etc.},{etc.}]
	fetchIngredientsFromJSON : function(){



	},

//.......................... create meal model from random ingredients .............................
	recombinate : function() {
		self.createMealModel()
		// self.createMealUrl()
		self.createMealName()
		self.createMealHash()

		self.setSocialMediaLinks()

	},
	createMealHash: function(){
		var hash = ''
		self.meal.forEach(function(item) {
			hash += item.hash
		})

		location.hash = hash
//<<<<<<< HEAD
		console.log(hash)
		$("div#meal_url").html("http://"+ window.location.hostname + "/#" + hash); 
//=======

		self.mealHash = hash

//>>>>>>> 6d096cd1e71fd9a5e4c820f13812c5cb0549e9f1
	},
	createMealModel: function() {
			//........................ reset model ....................
			self.meal = []
			self.mealName = ""
			self.mealHash = ""

			//........................ base ingredient ....................
			//add exterior to model			
			self.meal.push(self.pickRandomFromArray(self.exteriorArray))

			//........................ remaining ingredients ....................
			//determine number of ingredients
			self.numberOfIngredients = self.returnRandomWeightedItemFromArray(self.weightedArray_ingredientCountChances)

			//pick remaining ingredients
			var determineIngredientType, randomIngredient,
				i=1;
			for (i; i<self.numberOfIngredients; i++) { 

				//determine which type of ingredient will be chosen
				determineIngredientType = self.returnRandomWeightedItemFromArray(self.weightedArray_ingredientTypeChances)
				//then randomly choose an ingredient from the list of determined type
				if 		(determineIngredientType === "sauce") 		randomIngredient = self.pickRandomFromArray(self.sauceArray)
				else if (determineIngredientType === "exterior") 	randomIngredient = self.pickRandomFromArray(self.exteriorArray)
				else if (determineIngredientType === "meat") 		randomIngredient = self.pickRandomFromArray(self.meatArray)
				else if (determineIngredientType === "topping") 	randomIngredient = self.pickRandomFromArray(self.toppingArray)
				else if (determineIngredientType === "filling") 	randomIngredient = self.pickRandomFromArray(self.fillingArray)

				//add every ingredient object chosen to the meal
				self.meal.push(randomIngredient)
			}
	},
		pickRandomFromArray : function(array) {
			return array[Math.floor(Math.random()*array.length)]
		},
		returnRandomWeightedItemFromArray : function(weightedArray) {
		
			//create an array of ranges from weightArray to be rolled on with Math.random()
			var weightRangesArray = [],
				currentWeightMax=0;

			weightedArray.forEach(function(object, i) {
				currentWeightMax+=object.chance
				weightRangesArray.push(currentWeightMax)
			})

			//roll random number, find which range it fits into, return the weightedArray item that range is associated with
			var i=0,
				random = Math.random();

			while (i<weightRangesArray.length) {
				if(random<=weightRangesArray[i]) {	
					return weightedArray[i].item
					break
				}
				i++
			}
		},

	// createMealUrl: function() {
	// 	var url = window.location.origin + '/?'
	// 	self.meal.forEach(function(item) {
	// 		url += item.hash
	// 	})

	// 	window.location.href = url
	// 	console.log(url)
	// },

	createMealName: function() {
		// declare variables for naming the meal
		// currentMealName = ""
		var prefix = ""
		var signifier = ""
		var fillings = ""
		var suffix = ""
		var numShells = 0
		var numTortillas = 0
		var numMeats = 0
		var base = ""
		//var meatArray = []

		//TO-DO: loop through meal array, check type, match text to the type and add to name string

		//add the name of the base to the mealName
		var isBase = /Taco Salad|Naked Chicken Chalupa|Locos|Chalupa|Gordita|Pizza|Taco|Tortilla|Tostada/

		if (self.meal[0].ingredient.match(isBase) == "Tortilla") {
			base+="Burrito "
		} else if (self.meal[0].ingredient.match(isBase) == "Locos") {
			//console.log("It's loco!")
			var isLocos = /Cool Ranch|Nacho Cheese|Fiery/
			base+=self.meal[0].ingredient.match(isLocos) + " Taco "
		} else { base+=self.meal[0].ingredient.match(isBase) + " " 
		
		}
		

		self.meal.forEach(function(item) {

			if (item.type === "meat") {
				var re = /Beef|Chicken|Sausage|Steak|Bacon/
				signifier+=item.ingredient.match(re) + " "
				//meatArray.push(item.ingredient.match(re))
				numMeats++
			}

			else if (item.type === "topping") {
				var isSupreme = /Sour Cream/
				if (item.ingredient.match(isSupreme)) {
					if(!suffix.match("Supreme")){
						suffix+="Supreme "
					}
				}

				var isAvo = /Guacamole/
				if (item.ingredient.match(isAvo)) {
					if (!signifier.match("Avocado")) {
						signifier+="Avocado "
					}
				}

				var hasCheese = /Cheese/
				if (item.ingredient.match(hasCheese)) {
					fillings+="Cheese "
				}

			}

			else if (item.type === "filling") {
				var isChili = /Chili/
				if (item.ingredient.match(isChili)) {
					signifier+=item.ingredient.match(isChili) + " "
				}

				var isBreakfast = /Eggs/
				if (item.ingredient.match(isBreakfast)) {
					if (!prefix.match("Breakfast")) {
						prefix+="Breakfast" + " "
					}
				}

				var fill = /Bean|Rice|Potato|Cheese/
				if (item.ingredient.match(fill)) {
						fillings+=item.ingredient.match(fill) + " "
				}
			}

			else if (item.type === "sauce") {
				var isNacho = /Nacho/
				if (item.ingredient.match(isNacho)) {
					if(!prefix.match("Nacho")) {
						prefix+="Nacho "
					}
				}

				var isVolcano = /Spicy|- Fire|- Hot|Diablo/
				if (item.ingredient.match(isVolcano)) {
					prefix+="Volcano "
				}
			}

			else if (item.type === "exterior") {
				numShells++
				if (item.ingredient.match("Tortilla")) {
					numTortillas++
					//console.log("Found a tortilla!")
				} 

			}

		})
	
		if (numShells === 2)		prefix+="Double Decker "
		if (numShells === 3)		prefix+="Triple Decker "
		if (numShells > 3)			prefix+="Xtreme Decker "
		if (numMeats === 0)	signifier+=fillings

		if (numTortillas == 2 && numShells == 2 && fillings.match("Cheese")) {
			base = "Quesadilla"
			prefix.replace(/Double Decker/, "")
		}


			if (self.numberOfIngredients == 1 && base != "Naked Chicken Chalupa ") {
				prefix+="Lite "
			}

		if (self.numberOfIngredients == 2) {
			self.meal.forEach(function(item) {
				if (item.ingredient.match("Lettuce")) {
					prefix+="Veggie "
				}
			})
		}


		/*if (self.numberOfIngredients > 1 && self.numberOfIngredients <= 3 && numMeats == 0 && fillings == "" && signifier == "" && prefix != "Lite ") {
			signifier+="Veggie "
		}*/

		/*if (self.numberOfIngredients == 1 && base != "Naked Chicken Chalupa") {
			prefix+="Veggie "
		}*/

		if (self.numberOfIngredients > 3 && numMeats == 0 && fillings == "" && signifier == "" && prefix != "Lite " && numShells == 1) {
			prefix+="Loaded "
		}

		//if (self.numberOfIngredients == 1)	prefix = "Fresco "

		self.mealName+=prefix + signifier + base + suffix
	},
	setSocialMediaLinks: function(){
		var mealNameArray = self.mealName.split(' ').slice(0,-1)
		var mealName = ""
		mealNameArray.forEach(function(item,i,arr) {
			mealName+=item

			if (i!==arr.length-1) mealName += "%20"
		})

		var href = "https://twitter.com/intent/tweet?text=Have%20you%20ever%20seen%20a%20"
				+ mealName
				+ "?&url=https%3A%2F%2Fwww.recombinator.zone%2F%23"
				+ self.mealHash
				+ "&hashtags=recombinator,recombinate";

		$('.twitter-share-button').attr('href', href)
	},


//................................... display meal model in html ...................................
	displayMealDivs: function() {

		var currentPictureDiv, currentLabelDiv, currentIngredientContainerID, currentIngredientContainerStyle, currentIngredientHTML,
			z=1;
		
		//reset ingredient DOM identifier array
		self.ingredientContainerIDs = [];

		self.meal.forEach(function(ingredient, i) {

			currentPictureDiv = "<div id='ingredient_picture"+i+"' class='ingredient_picture'><img class='ingredient_img' src=" + ingredient.address + "></div>"
			currentLabelDiv = "<div id='ingredient_label"+i+"' class='label'>" + ingredient.ingredient + '<div class="line"></div>'+"</div>"
			//container ID
			currentIngredientContainerID = 'ingredient_container'+i,
			currentIngredientContainerStyle = "z-index:"+(z+=1),
			currentIngredientHTML = "<div id="+currentIngredientContainerID+" class='ingredient_container hidden' style="+currentIngredientContainerStyle+">"
				//ingredient label
				+"<div class='label_container'>"
					+"<div class='label_container2'>"
						+currentLabelDiv
					+"</div>"
				+"</div>"
				//ingredient picture
				+"<div class='picture_container'>"
					+currentPictureDiv
				+"</div>"
			+"</div>";

			$('div#recombinator').prepend(currentIngredientHTML)
			
			//cache IDs of each ingredient container div for DOM manipulation
			self.ingredientContainerIDs.push(currentIngredientContainerID)
		})
		
		//make sure all images are loaded
		var numImages = $('.ingredient_container').length
		var loadCounter = 0

		$('div#recombinator img').on('load', function() {
			loadCounter++
			if (numImages == loadCounter) {
				self.animateMealDivs();
			}
		})
		//animate each ingredient Div one by one
		//self.animateMealDivs()
	},
	clearCurrentMeal: function() {

		if (self.soundOn == true) {
				crunch.play()
		}

		//setTimeout(function() {

			self.ingredientContainerIDs.forEach(function(containerID, i) {

				var $currentIngredient = $("div#"+containerID),
					delay = self.animationInterval_ingredients * (i / 2.5);

			//push all ingredients offscreen above window
			//$currentIngredient.transition({ y:mealContainerHeight*-1 },0)
			//animate each ingredient into place one at a time
				setTimeout(function() {
					$currentIngredient.addClass("clear");
					console.log("dropping!")
				}, delay)
			})
		//}, 200)


		//$('div#recombinator').html("")
	},
	animateMealDivs: function() {

		var mealContainerHeight = $(window).height() - $('#buttons').height();

		/*// Prep audio file - should this go somewhere else?
		var audioSprite = new Audio("sounds/squish_250ms.mp3");*/
		//var audioSprite = new Audio("sounds/squish_1sec.mp3");
		var audioSprite = document.getElementById("squish")

		// store stopping times for each ingredient amount
		var spriteData = [ 
			    {
			    	start: 0,
			    	length: 0.43
			    },
			    {
			    	start: 1.43,
			    	length: 2.140
			    },
			    {
			    	start: 3.140,
			    	length: 4.13
			    },
			    {
			    	start: 5.13,
			    	length: 6.40
			    },
			    {
			    	start: 7.4,
			    	length: 8.92
			    },
			    {
			    	start: 9.92,
			    	length: 11.72
			    },
			    {
			    	start: 12.72,
			    	length: 14.80
			    },
			    {
			    	start: 15.80,
			    	length: 18.16
			    },
			    {
			    	start: 19.16,
			    	length: 21.8
			    }
			];

			// console.log(spriteData)
		// create a handler to stop the sound at the right time 
		var handler = function() {
			console.log(this.currentTime);
			if (this.currentTime >= spriteData[self.numberOfIngredients-1].length) {
				this.pause();
				console.log("Stopping squish...");
			}
		}
		// Add event listener to the audio sprite
		audioSprite.addEventListener('timeupdate', handler, false);

			//play squish for each ingredient
			if (self.soundOn == true) {
				//setTimeout(function() {
					audioSprite.currentTime = spriteData[self.numberOfIngredients-1].start
					audioSprite.play()
					//var squish = new Audio("sounds/squish1.mp3"); // buffers automatically when created
					//squish.play()					
					//squish.cloneNode().play()
					//document.getElementById("squish").cloneNode(true).play()
				//}, 50)
			}
		
		//move each ingredient into view
		self.ingredientContainerIDs.forEach(function(containerID, i) {

			var $currentIngredient = $("div#"+containerID),
				delay = self.animationInterval_ingredients * i;

			//push all ingredients offscreen above window
			//$currentIngredient.transition({ y:mealContainerHeight*-1 },0)

			//animate each ingredient into place one at a time
			setTimeout(function() {
				$currentIngredient.addClass("drop");
				/*$currentIngredient.transition({
					y:0
				},self.animationInterval_ingredients)*/
			}, delay)

			// console.log("soundOn = " + self.soundOn)


		})


		self.displayNameBanner()
	},

	displayNameBanner: function() {
		//banner background animation
		var $banner = $('div#meal_title_banner');
		//$banner.removeClass("show")
	
		//hide and reset banner on recombinate! button press
		/*$banner.transition({
			"clip-path":"inset(0 100% 0 0)" // clip-path is experimental, only supported in Chrome
		},0)*/
		$banner.html("<div id='meal_title'>"+self.mealName+"</div>")

		//banner animation
		var ingredientsDoneFalling = self.ingredientContainerIDs.length * self.animationInterval_ingredients + 500; // added +500 to prevent overlap with bong 7/2
		var $banner_title = $('div#meal_title')

		var expandBannerText = function(callback) {

			if (self.soundOn == true) {
				//var	bong = new Audio("sounds/tacobell_bong.mp3") // buffers automatically when created
				var bong = document.getElementById("bell")			
				bong.play();
			}

			$banner_title.transition({
				"width":"126%",
				//"height":"200%",
				"opacity": "1",
				"left":"-13%",
				//"top": "0",
				//"bottom":"0",
				"font-size":"2.5rem",
				//"font-size":"7vh"
			}, self.animationInterval_bannerText, function() {
				callback()
			})

			$('div#recombinate_button').removeClass('disabled')

		}
		var contractBannerText = function() {
			setTimeout(function(){

				$banner_title.transition({
					"font-size":"1.8rem",
					//"font-size":"5vh",
					"width":"90%",
					"left":"5%"
				}, self.animationInterval_bannerText)

			},self.animationInterval_bannerTextExpandedPause)			
		}
		//reveal banner
		setTimeout(function() {
			//$banner.transition({"clip-path":"inset(0 0 0 0)"}, self.animationInterval_banner, function() {
			
				//$banner_title.transition({"opacity":"1"}, self.animationInterval_bannerText, function() {

					expandBannerText(contractBannerText)
				//})
			//})

			//$banner.addClass("show")
		}, ingredientsDoneFalling)

	}

}
app.init()















