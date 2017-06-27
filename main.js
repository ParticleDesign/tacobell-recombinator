"use strict"

var app = {
	self,
//.................. config ...................
	numberOfIngredients:0,
	weightedArray_NumberOfIngredientChances: [
		{item:1, chance: .02},
		{item:2, chance: .03},
		{item:3, chance: .1},
		{item:4, chance: .2},
		{item:5, chance: .25},
		{item:6, chance: .2},
		{item:7, chance: .1},
		{item:8, chance: .05},
		{item:9, chance: .03},
		{item:10, chance: .02}

		/*{item:1, chance: 0},
		{item:2, chance: 1},
		{item:3, chance: 0},
		{item:4, chance: 0},
		{item:5, chance: 0},
		{item:6, chance: 0},
		{item:7, chance: 0},
		{item:8, chance: 0},
		{item:9, chance: 0},
		{item:10, chance: 0} */
		// {item:10, chance: 1}
	],

	//chances have to add up to 1.0
	weightedArray_IngredientTypeChances: [
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
	//meal ingredients 
	meal:[],

	//JSON ingredients
	ingredientsArray:[], 
		sauceArray: [], exteriorArray: [], meatArray: [], toppingArray: [], fillingArray: [],

	//
	ingredientContainerIDs:[],
	// item name
	mealName: "",

	soundOn: false,

//..................................... application .............................................
	init: function() {
		self = this
		
		this.armStartButton()

		//create Ingredient Arrays that can be pulled from with Recombinator  
		this.fetchIngredientsFromJSON()
		//set handlers for 
		this.armRecombinateButton()

		this.armShareButton()

		this.armSoundToggle()

		// //play intro sound
		// var chalupa = new Audio("sounds/chalupa.mp3"); // buffers automatically when created
		// chalupa.play();

	},
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
			
			// load sounds here for iOS
			var audioSprite = new Audio("sounds/squish_250ms.mp3");

			var squish = document.getElementById("squish")
			squish.load()
			console.log(squish)

		})

		$('div#sound_on').on('click', function() {
			console.log("sound on clicked!")
			if (self.soundOn == false) {
				$('div#sound_on').html("<img class='inline-img' src='images/headphones.png' />SOUND <span id='headphone_toggle'>ON </span>TO HEAR THE FLAVOR")
				self.soundOn = true;
				$('img#sound_control_icon').attr('src', '/images/soundcontrol.svg')
			} else {
				$('div#sound_on').html("<img class='inline-img' src='images/headphones.png' />SOUND <span id='headphone_toggle'>OFF</span> TO KEEP IT MELLOW")
				self.soundOn = false;
				$('img#sound_control_icon').attr('src', '/images/soundcontrol_off.svg')
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
				$('div#meal_title_banner').transition({
					"clip-path":"inset(0 100% 0 0)"
				},0)
			})
		})



	},
	armRecombinateButton: function() {
		$('div#recombinate_button').on("click", function(){
// console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

			
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

		})
	},

	armShareButton: function() {
		//var share_menu = document.getElementByID("#share_menu");
		$('div#share_button').on("click", function() {

			//console.log("share open!");
			//$('div#share_menu').toggleClass("open");
			//screenshotPage();
			//share_menu.classList.toggle("open");

			var shareItems = []
			shareItems.push(document.getElementsByClassName("share_item"))
			console.log("share clicked!")
			//console.log(shareItems);
			
			if ($('.share_item').hasClass('show-cards')) {
				console.log("checking for class...")
				$('.share_item').each(function(i) {
					setTimeout(function() {
						document.getElementsByClassName("share_item")[2-i].classList.add('hide-cards');
						document.getElementsByClassName("share_item")[2-i].classList.remove('show-cards')
					}, 200 * (i*.40))
				})
			} else {
				$('.share_item').each(function(i) {
					console.log("showing cards");
					//var item = $(this);
					setTimeout(function() {
						document.getElementsByClassName("share_item")[i].classList.remove('hide-cards')
						document.getElementsByClassName("share_item")[i].classList.add('show-cards');
					}, 200 * (i*.5))
				})
			}
		



		})

		/*function screenshotPage() {
			  // 1. Rewrite current doc's imgs, css, and script URLs to be absolute before
			  // we duplicate. This ensures no broken links when viewing the duplicate.
			  //urlsToAbsolute(document.images);
			  //urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
			  //urlsToAbsolute(document.scripts);

			  // 2. Duplicate entire document tree.
			  var screenshot = document.documentElement.cloneNode(true);

			  // 3. Screenshot should be readyonly, no scrolling, and no selections.
			  //screenshot.style.pointerEvents = 'none';
			  //screenshot.style.overflow = 'hidden';
			  //screenshot.style.userSelect = 'none'; // Note: need vendor prefixes

			  // 4. ... read on ...

			  // 5. Create a new .html file from the cloned content.
			  var blob = new Blob([screenshot.outerHTML], {type: 'text/html'});

			  // Open a popup to new file by creating a blob URL.
			  //window.open(window.URL.createObjectURL(blob));
			  var myURL = window.URL.createObjectURL(blob);
			  console.log(myURL);
			}*/

	},

	armSoundToggle: function() {
		$('div#sound_control').on("click", function() {
			//alert("Sound off!");
			if (self.soundOn == false) {
				self.soundOn = true;
				$('div#sound_control').html('<img src="/images/soundcontrol.svg" />')
			} else { 
				self.soundOn = false; 
				$('div#sound_control').html('<img src="/images/soundcontrol_off.svg" />')
			}

			console.log("soundOn = " + self.soundOn)
		})
	},

	//seperates Ingredient objects from JSON Array into a seperate array for each ingredient Type 
	//self.sauceArray = [{ingredient, type, address},{etc.}], self.meatArray = [{etc.},{etc.}]
	fetchIngredientsFromJSON : function(){

		$.getJSON('ingredients.json', function( JSONarray ){ 
			JSONarray.forEach(function(item) {
				var currentIngredientType = item.type;

				if 		(currentIngredientType === "sauce") 	self.sauceArray.push(item)
				else if (currentIngredientType === "exterior") 	self.exteriorArray.push(item)
				else if (currentIngredientType === "meat") 		self.meatArray.push(item)
				else if (currentIngredientType === "topping") 	self.toppingArray.push(item)
				else if (currentIngredientType === "filling") 	self.fillingArray.push(item)
			
				self.ingredientsArray.push(item)
			})
		})

	},

//.......................... create meal model from random ingredients .............................
	recombinate : function() {
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

			//clear previous meal model and add an exterior
			self.meal = []
			self.mealName = ""

			//add exterior to model			
			self.meal.push(self.pickRandomFromArray(self.exteriorArray))

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
			


			//determine number of ingredients
			self.numberOfIngredients = self.returnRandomWeightedItemFromArray(self.weightedArray_NumberOfIngredientChances)

			//pick remaining ingredients
			var determineIngredientType, randomIngredient,
				i=1;
			for (i; i<self.numberOfIngredients; i++) { 

				//determine which type of ingredient will be chosen
				determineIngredientType = self.returnRandomWeightedItemFromArray(self.weightedArray_IngredientTypeChances)
				//then randomly choose an ingredient from the list of determined type
				if 		(determineIngredientType === "sauce") 		randomIngredient = self.pickRandomFromArray(self.sauceArray)
				else if (determineIngredientType === "exterior") 	randomIngredient = self.pickRandomFromArray(self.exteriorArray)
				else if (determineIngredientType === "meat") 		randomIngredient = self.pickRandomFromArray(self.meatArray)
				else if (determineIngredientType === "topping") 	randomIngredient = self.pickRandomFromArray(self.toppingArray)
				else if (determineIngredientType === "filling") 	randomIngredient = self.pickRandomFromArray(self.fillingArray)

				//add every ingredient object chosen to the meal
				self.meal.push(randomIngredient)

			}

			//TO-DO: loop through meal array, check type, match text to the type and add to name string



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

			if (numTortillas == 2 && numShells == 2) {
				base = "Quesadilla"
				prefix.replace(/Double Decker/, "")
			}

			if (self.numberOfIngredients == 2) {
				self.meal.forEach(function(item) {
					if (item.ingredient.match("Lettuce")) {
						prefix+="Lite "
					}
				})
			}

			/*if (self.numberOfIngredients > 1 && self.numberOfIngredients <= 3 && numMeats == 0 && fillings == "" && signifier == "" && prefix != "Lite ") {
				signifier+="Veggie "
			}*/

			if (self.numberOfIngredients == 1 && base != "Naked Chicken Chalupa ") {
				prefix+="Veggie "
			}

			if (self.numberOfIngredients > 3 && numMeats == 0 && fillings == "" && signifier == "" && prefix != "Lite " && numShells == 1) {
				prefix+="Loaded "
			}

			//if (self.numberOfIngredients == 1)	prefix = "Fresco "

			self.mealName+=prefix + signifier + base + suffix
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

		//animate each ingredient Div one by one
		self.animateMealDivs()
	},
	clearCurrentMeal: function() {
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
		//$('div#recombinator').html("")
	},
	animateMealDivs: function() {

		var mealContainerHeight = $(window).height() - $('#buttons').height();

		/*// Prep audio file - should this go somewhere else?
		var audioSprite = new Audio("sounds/squish_250ms.mp3");
		// store stopping times for each ingredient amount
		var spriteData = {
			    ing1: {
			        start: 0,
			        length: 0.455
			    },
			    ing2: {
			        start: 0,
			        length: 0.910
			    },
			    ing3: {
			        start: 0,
			        length: 1.32
			    },
			    ing4: {
			        start: 0,
			        length: 1.818
			    },
			    ing5: {
			        start: 0,
			        length: 2.272
			    },
			    ing6: {
			        start: 0,
			        length: 2.727
			    },
			    ing7: {
			        start: 0,
			        length: 3.182
			    },
			    ing8: {
			        start: 0,
			        length: 3.637
			    },
			    ing9: {
			        start: 0,
			        length: 4.09
			    }
			};
		// create a handler to stop the sound at the right time 
		var handler = function() {
			console.log(this.currentTime);
			switch (self.numberOfIngredients) {
				case 1:
					console.log("one ingredient");
					if (this.currentTime >= spriteData.ing1.length) {
						this.pause();	
					}
					break;
				case 2:
					console.log("two ingredients");
					if (this.currentTime >= spriteData.ing2.length) {
						this.pause();	
					}
					break;
				case 3:
					console.log("three ingredients");
					if (this.currentTime >= spriteData.ing3.length) {
						this.pause();	
					}
					break;
				case 4:
					if (this.currentTime >= spriteData.ing4.length) {
						this.pause();	
					}
					console.log("four ingredients");
					break;
				case 5:
					console.log("five ingredients");
					if (this.currentTime >= spriteData.ing5.length) {
						this.pause();	
					}
					break;
				case 6:
					console.log("six ingredients");
					if (this.currentTime >= spriteData.ing6.length) {
						this.pause();	
					}
					break;
				case 7:
					console.log("seven ingredients");
					if (this.currentTime >= spriteData.ing7.length) {
						this.pause();	
					}
					console.log(spriteData.ing7.length)
					break;
				case 8:
					console.log("eight ingredients");
					if (this.currentTime >= spriteData.ing8.length) {
						this.pause();	
					}
					break;
				case 9:
					console.log("nine ingredients");
					if (this.currentTime == spriteData.ing9.length) {
						this.pause();	
					}
					break;

			
		}}
		// Add event listener to the audio sprite
		audioSprite.addEventListener('timeupdate', handler, false);*/
		
		//var squish = new Audio("/sounds/squish1.mp3"); // buffers automatically when created
		//squish.addEventListener("ended", function() { squish.currentTime=0; console.log("squish over!")}, false);
		
		//move each ingredient into view
		self.ingredientContainerIDs.forEach(function(containerID, i) {

			var $currentIngredient = $("div#"+containerID),
				delay = self.animationInterval_ingredients * i * 1.2;

			//push all ingredients offscreen above window
			//$currentIngredient.transition({ y:mealContainerHeight*-1 },0)

			//animate each ingredient into place one at a time
			setTimeout(function() {
				$currentIngredient.addClass("drop");
				/*$currentIngredient.transition({
					y:0
				},self.animationInterval_ingredients)*/
			}, delay)

			console.log("soundOn = " + self.soundOn)


			//play squish for each ingredient
			if (self.soundOn == true) {

				//audioSprite.play()
				//squish.currentTime = 0
				setTimeout(function() {
					//var squish = new Audio("sounds/squish1.mp3"); // buffers automatically when created
					//squish.play()					
					squish.cloneNode().play()
					//document.getElementById("squish").cloneNode(true).play()
				}, delay+100)
			}
		})

		self.displayNameBanner()
	},

	displayNameBanner: function() {
		//banner background animation
		var $banner = $('div#meal_title_banner');
		$banner.removeClass("show")
	
		//hide and reset banner on recombinate! button press
		$banner.transition({
			"clip-path":"inset(0 100% 0 0)" // clip-path is experimental, only supported in Chrome
		},0)
		$banner.html("<div id='meal_title'>"+self.mealName+"</div>")

		//banner animation
		var ingredientsDoneFalling = self.ingredientContainerIDs.length * self.animationInterval_ingredients;
		var $banner_title = $('div#meal_title')

		var expandBannerText = function(callback) {
			if (self.soundOn == true) {
				var	bong = new Audio("sounds/tacobell_bong.mp3") // buffers automatically when created			
				bong.play();
			}

			$banner_title.transition({
				"font-size":"7vh",
				"width":"126%",
				"left":"-13%"
			}, self.animationInterval_bannerText, function() {
				callback()
			})
		}
		var contractBannerText = function() {
			setTimeout(function(){

				$banner_title.transition({
					"font-size":"5vh",
					"width":"90%",
					"left":"5%"
				}, self.animationInterval_bannerText)

			},self.animationInterval_bannerTextExpandedPause)			
		}
		//reveal banner
		setTimeout(function() {
			$banner.transition({"clip-path":"inset(0 0 0 0)"}, self.animationInterval_banner, function() {
			
				$banner_title.transition({"opacity":"1"}, self.animationInterval_bannerText, function() {

					expandBannerText(contractBannerText)
				})
			})

			$banner.addClass("show")
		}, ingredientsDoneFalling)

	}

}
app.init()















