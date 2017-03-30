"use strict"

var app = {
	self,
//.................. config ...................
	minIngredients: 3,
	maxIngredients: 7,
	ingredientAnimateInterval: 300,

//........... global variables .................
	meal:[],
	mealDivs: [],
	labelDivs: [],
	//gather ingredients
	ingredientsArray:[], 
		sauceArray: [], exteriorArray: [], meatArray: [], toppingArray: [], fillingArray: [],



//..................................... application .............................................
	init: function() {
		self = this
		this.fetchIngredientsFromJSON()
		this.armRecombinateButton()

	},

	armRecombinateButton: function() {
		$('div#recombinate_button').click(function(){
			
			$('div#meal_container').html("")	//clear previous meal view
			$('div#label_container').html("")	//clear previous label view
			self.recombinate()					//start new meal
		})
	},


	//fetch all the ingredients
	fetchIngredientsFromJSON : function(){

		$.getJSON('ingredients.json', function( data ){ 

			self.cacheIngredients(data)

		})
	},
	//save ingredients in seperate lists
	cacheIngredients : function( JSONarray ){
		JSONarray.forEach(function(item) {
			
			var currentIngredientType = item.type,
				currentIngredient = item.ingredient;

			if (currentIngredientType === "sauce") 		self.sauceArray.push(currentIngredient)
			if (currentIngredientType === "exterior") 	self.exteriorArray.push(currentIngredient)
			if (currentIngredientType === "meat") 		self.meatArray.push(currentIngredient)
			if (currentIngredientType === "topping") 	self.toppingArray.push(currentIngredient)
			if (currentIngredientType === "filling") 	self.fillingArray.push(currentIngredient)
		
			self.ingredientsArray.push(currentIngredient)
		})

		this.recombinate()
	},


//.......................... make meal from random ingredients .............................
	recombinate : function() {
		var exteriorArray = this.exteriorArray,
			exterior = this.randomPicker(exteriorArray),
			randomNumber = this.generateNumberOfIngredients();

			self.meal = []				//clear previous meal model
			self.mealDivs = []			//clear previous meal model
			self.labelDivs = []			//clear previous label model
			self.meal.push( exterior ) 	//add random exterior to meal

			for (var i=1; i<randomNumber; i++) { //add the rest of the ingredients to meal
				var randomIngredient = self.randomPicker(self.ingredientsArray)//send the ingredients array to the randomizer
				self.meal.push(randomIngredient)
			}

// console.log(self.meal)
		this.constructMealDivs();
	},
		randomPicker : function(array) {
			return array[Math.floor(Math.random()*array.length)]
		},
		generateNumberOfIngredients : function() {
			var min = self.minIngredients, max = self.maxIngredients;
			return Math.floor(Math.random() * (max - min + 1) + min)
		},


//................................... make meal into html ...................................
	constructMealDivs: function() {
		var div, divs = '';

		//construct Meal Divs
		this.meal.forEach(function(item, number) {
			div = "<div id='ingredient"+number+"' class='ingredient'>" + item + "</div>"

			self.mealDivs.push(div)
		})
		//construct Label Divs
		this.meal.forEach(function(item, number) {
			div = "<div id='label"+number+"' class='labels'>" + item + "</div>"

			self.labelDivs.push(div)
		})

		this.displayMeal()
		// this.displayLabels()
		
	},
	displayMeal : function() {
		var interval, currentIngredient;

		this.labelDivs.forEach(function(item, i){
			console.log(item)

			$('div#label_container').prepend('<div class="line">').prepend(item)

		})
	},
	// displayLabels: function(){
	// 	var l = this.mealDivs.length,
	// 		timeout = l*self.ingredientAnimateInterval;


	// 	//set timer
	// 	setTimeout(function(){
	// 		self.mealDivs.forEach(function(item) {
	// 			$('div#label_container').prepend(item)
	// 		})

	// 	}, timeout)

	// }


}

app.init()
