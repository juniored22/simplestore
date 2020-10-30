$(function() {
	simpleCart({

	    // array representing the format and columns of the cart, see
	    // the cart columns documentation
	    cartColumns: [
			{ attr: "name" , label: "Nome" },
			{ attr: "note" , label: false },
	        { attr: "price" , label: "Preço", view: 'currency' },
			{ view: "decrement" , label: false },
	        { attr: "quantity" , label: "Qty" },
	        { view: "increment" , label: false },
	        { attr: "total" , label: "SubTotal", view: 'currency' },
	        { view: "remove" , text: "Remove" , label: false }
	    ],

	    // "div" or "table" - builds the cart as a table or collection of divs
	    cartStyle: "div",

	    // how simpleCart should checkout, see the checkout reference for more info
	    checkout: {
	        type: "custom" ,
			email: "you@yours.com",
			method:"POST",
			urlChecout: 'http://35.237.253.252/facilities-food/api/checkout',
			fn: (fun, simpleCart, checkout_config)=>{
			
					$.get('http://35.237.253.252/facilities-food/api/produto')
					.success((data)=>{
						if(localStorage.getItem('remember_facilities_food')){
							setTimeout(()=>{
								fun()
							},2000)
							
						}else {
							openModalLogin(fun)
						}
					})
			}
		},

	    // set the currency, see the currency reference for more info
	    currency: "BRL",

	    // collection of arbitrary data you may want to store with the cart,
	    // such as customer info
	    data: {},

	    // set the cart langauge (may be used for checkout)
	    language: "english-us",

	    // array of item fields that will not be sent to checkout
	    excludeFromCheckout: [
	    	'qty',
	    	'thumb'
	    ],

	    // custom function to add shipping cost
	    shippingCustom: null,

	    // flat rate shipping option
	    shippingFlatRate: 0,

	    // added shipping based on this value multiplied by the cart quantity
	    shippingQuantityRate: 0,

	    // added shipping based on this value multiplied by the cart subtotal
	    shippingTotalRate: 0,

	    // tax rate applied to cart subtotal
	    taxRate: 0,

	    // true if tax should be applied to shipping
	    taxShipping: false,

	    // event callbacks
	    beforeAdd               	: null,
	    afterAdd                	: null,
	    load                    	: null,
	    beforeSave              	: null,
	    afterSave               	: clearNote,
	    update                  	: null,
	    ready                   	: null,
	    checkoutSuccess             : null,
	    checkoutFail                : null,
	    beforeCheckout              : null

	});

	simpleStore.init({

		// brand can be text or image URL
		brand : "http://35.237.253.252/facilities-food/images/kcb-facilities_logo.png",

		// numder of products per row (accepts 1, 2 or 3)
		numColumns : 3,

		// name of JSON file, located in directory root
		JSONFile : "http://35.237.253.252/facilities-food/api/produto?unidade=" + localStorage.getItem('unidade_facilities_food') || ''

	});

	sider_bar.init({
		div : 			$('#div-sidebar'),
		template: 		$('#sidebar-template'),
		element:		$('.sidebar'),
		button_event:	$('#event_sidebar'),
		class_close:	$('.close_sidebar'),
		close_generic:	'close_sidebar',
		category: "http://35.237.253.252/facilities-food/api/categorias"
	});

});
