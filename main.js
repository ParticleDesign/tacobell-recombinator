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

		// {item:10, chance: 1}
	],

	//chances have to add up to 1.0
	weightedArray_IngredientTypeChances: [
		{item:"meat", 		chance:.2},
		{item:"sauce", 		chance:.2},
		{item:"exterior", 	chance:.1},
		{item:"topping", 	chance:.3},
		{item:"filling", 	chance:.2},
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

//..................................... application .............................................
	init: function() {
		self = this
		//create Ingredient Arrays that can be pulled from with Recombinator  
		this.fetchIngredientsFromJSON()
		//set handlers for 
		this.armRecombinateButton()

		//play intro sound
		var snd = new Audio("sounds/chalupa.mp3"); // buffers automatically when created
		snd.play();

	},

	armRecombinateButton: function() {
		$('div#recombinate_button').on("click", function(){
// console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
			
			$('div#recombinator').html("")	//clear previous meal view

			self.recombinate()					//start new meal
			self.displayMealDivs();	
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
			var numMeats = 0
			var base = ""

			//clear previous meal model and add an exterior
			self.meal = []
			self.mealName = ""

			//add exterior to model			
			self.meal.push(self.pickRandomFromArray(self.exteriorArray))

			//add the name of the base to the mealName
			var isBase = /Taco|Chalupa|Gordita|Pizza|Salad|Tortilla|Tostada/
			base+=self.meal[0].ingredient.match(isBase) + " "


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
					numMeats++
				}

				else if (item.type === "topping") {
					var isSupreme = /Sour Cream/
					if (item.ingredient.match(isSupreme)) {
						suffix+="Supreme "
					}
				}

				else if (item.type === "filling") {
					var isChili = /Chili/
					if (item.ingredient.match(isChili)) {
						signifier+=item.ingredient.match(isChili) + " "
					}

					var isBreakfast = /Eggs/
					if (item.ingredient.match(isBreakfast)) {
						prefix+="Breakfast" + " "
					}

					var fill = /Bean|Rice|Potato|Cheese/
					if (item.ingredient.match(fill)) {
							fillings+=item.ingredient.match(fill) + " "
					}
				}

				else if (item.type === "sauce") {
					var isNacho = /Nacho/
					if (item.ingredient.match(isNacho)) {
						prefix+="Nacho "
					}

					var isVolcano = /Spicy|- Fire|- Hot|Diablo/
					if (item.ingredient.match(isVolcano)) {
						prefix+="Volcano "
					}
				}

				else if (item.type === "exterior") {
					numShells++ 

				}

			})

			
			if (numShells > 1)		prefix+="Double Decker "
			if (numMeats == 0)	signifier+=fillings

			self.mealName+=prefix + signifier + base + suffix
			console.log("You got a: " + self.mealName)

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
	animateMealDivs: function() {

		var mealContainerHeight = $(window).height() - $('#buttons').height();

		//move each ingredient into view
		self.ingredientContainerIDs.forEach(function(containerID, i) {

			var $currentIngredient = $("div#"+containerID),
				delay = self.animationInterval_ingredients * i;

			//push all ingredients offscreen above window
			$currentIngredient.transition({ y:mealContainerHeight*-1 },0)

			//animate each ingredient into place one at a time
			setTimeout(function() {

				$currentIngredient.transition({
					y:0
				},self.animationInterval_ingredients)

			}, delay)

			//play squish for each ingredient
			setTimeout(function() {
				var snd = new Audio("sounds/squish1.mp3"); // buffers automatically when created
				snd.play();

			}, delay+100)

		})
		self.displayNameBanner()
	},
	displayNameBanner: function() {
		//banner background animation
		var ingredientsDuration = self.ingredientContainerIDs.length * self.animationInterval_ingredients,
			$banner = $('div#meal_title_banner');
	
		//hide and reset banner on recombinate! button press
		$banner.transition({
			"clip-path":"inset(0 100% 0 0)"
		},0)
		$banner.html("<div id='meal_title'>"+self.mealName+"</div>")

		//banner reveal animation
		setTimeout(function() {
			$banner.transition({
				"clip-path":"inset(0 0 0 0)"
			}, self.animationInterval_banner)
		}, ingredientsDuration)

	var banner_title_expand = function() {

	}

		//banner title animations
		var $banner_title = $('div#meal_title'),
			bannerTitleDelay = ingredientsDuration+self.animationInterval_banner;

		//banner title hidden on recombinate! button press
		$banner_title.transition({
			"opacity":"0"
		})
		//banner title reveal animation
		setTimeout(function() {
			$banner_title.transition({
				"opacity":"1"
			}, self.animationInterval_bannerText)
		}, bannerTitleDelay)

		//banner title expand animation
		setTimeout(function() {
			$banner_title.transition({
				"font-size":"7vh",
				"width":"126%",
				"left":"-13%"
			}, self.animationInterval_bannerText)
		}, bannerTitleDelay+self.animationInterval_bannerText)
		// banner title contract animation
		setTimeout(function(){
			$banner_title.transition({
				"font-size":"5vh",
				"width":"90%",
				"left":"5%"
			}, self.animationInterval_bannerText)
		}, bannerTitleDelay+self.animationInterval_bannerText*2+self.animationInterval_bannerTextExpandedPause)

		//play bong sound
		setTimeout(function() {
			var snd = new Audio("sounds/tacobell_bong.mp3"); // buffers automatically when created
			snd.play();
		}, bannerTitleDelay+self.animationInterval_bannerText)
	},

}
app.init()

//comment














