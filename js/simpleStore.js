/*
* simplestore
* Copyright 2015 Chris Diana
* https://github.com/cdmedia/simplestore
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

var simpleStore = {

    products: [],
    plugins: {},

    // Default settings
    settings: {
        numColumns: 3,
        brand: "SimpleStore",
        mode: "JSON",
        JSONFile: "products.json",
        fadeSpeed: 200,
        buttonColor: null,
        backgroundColor: null,
        textColor: null,
        container: $('.simpleStore_container'),
        cartContainer: $('.simpleStore_cart_container'),
        rowClass: 'simpleStore_row_',
        columnWidthClasses: {
            1: "",
            2: "one-half",
            3: "one-third"
        }
    },

    productPageOptions: [
        'OneOfAKind'
    ],

    extend: function (target, opts, callback) {
        var next;
        if (typeof opts === "undefined") {
            opts = target;
            target = simpleStore;
        }
        for (next in opts) {
            if (Object.prototype.hasOwnProperty.call(opts, next)) {
                target[next] = opts[next];
            }
        }
        callback(); // check user config options
        return target;
    },

    render: function (url, s) {
        var type = url.split('/')[0];

        var map = {
            // Main view
            '': function () {
                $('.banner').css('display','flex')
                $('.empty_view').css('display', 'none')
                simpleStore.renderProducts(simpleStore.products, s);
            },

            // Category view
            '#home': function () {
               
                var type_category = url.split('#home/')[0].trim();
                $('.banner').css('display','none')
                $('.empty_view').css('display', 'none')
                simpleStore.renderProductsCategory(simpleStore.products, s, type_category);
            },

            // Category view All
            '#all': function () {
        
                var type_category = url.split('#all/')[0].trim();
                $('.banner').css('display','none')
                $('.empty_view').css('display', 'none')
                simpleStore.renderProducts(simpleStore.products, s);
            },

            // Category view
            '#category': function () {
                var type_category = url.split('#category/')[1].trim();
                $('.banner').css('display','none')
                simpleStore.renderProductsCategory(simpleStore.products, s, type_category);
            },
            // Detail view
            '#product': function () {
                var id = url.split('#product/')[1].trim();
                $('.banner').css('display','none')
                $('.empty_view').css('display', 'none')
                simpleStore.renderSingleProduct(id, s);
            },
            // Cart view
            '#cart': function () {
                $('.banner').css('display','none')
                $('.empty_view').css('display', 'none')
                simpleStore.renderCart(s);
            }
        };

        if (map[type]) {
            map[type]();
        } else {
            simpleStore.renderError(s);
        }
    },

    insertData: function (tmpl, product) {
        tmpl.find('.item_thumb').attr("src", product.image);
        tmpl.find('.item_thumb_min').attr("src", product.image_min);
        tmpl.find('.item_name').text(product.name);
        tmpl.find('.item_price').text(product.price);
        tmpl.find('.item_description').text(product.description);
        tmpl.find('.item_brand').text(product.brand);
        tmpl.find('.item_preper').text(product.preper);
        tmpl.find('.item_sku').text(product.sku);
        tmpl.addClass(product.categoria)
    },

    renderProducts: function (products, s) {

        var rowCount = 1,
            numProducts = products.length,
            numRows = Math.ceil(products.length / s.numColumns),
            itemWidth;

        s.cartContainer.hide();
        s.container.fadeOut(s.fadeSpeed, function () {

            // Empty out main container on load
            s.container.html('').fadeIn(s.fadeSpeed);

            // Build rows based on number of products
            for (var r = 0; r < numRows; r++) {
                s.container.append('<div class="row ' + s.rowClass + (r + 1) + '"></div>');
            }

            // Get item column width
            var widthClasses = s.columnWidthClasses;
            for (var k in widthClasses) {
                if (k == s.numColumns) {
                    itemWidth = widthClasses[k];
                }
            }

            // List layout
            products.forEach(function (product, i) {

                if (!product.soldOut) {
                    var tmpl = $('#products-template').html(),
                        $tmpl = $(tmpl);

                    // Set item width
                    $tmpl.first().addClass(itemWidth);

                    // Insert data into template
                    simpleStore.insertData($tmpl, product);

                    // Render detail view on hash change
                    var getDetail = $tmpl.find('.simpleStore_getDetail');
                    getDetail.on('click', function (e) {
                        e.preventDefault();
                        window.location.hash = 'product/' + product.id;
                    });

                    // Check where to add new item based on row
                    if (i === 0) {
                        i = 1;
                    }
                    if (i % (s.numColumns) === 0) {
                        rowCount++;
                    }

                    // Append to appropriate container
                    $('.' + s.rowClass + rowCount).append($tmpl);
                }
            });
        });
    },

    renderProductsCategory: function (products, s, category = '') {

        console.log("filtro categoria", category);
        console.log("produtos", products);

        var filtered = products.filter(function (el) { return el.category == category; });
        
        if(filtered == ''){
            $('.empty_view').css('display', 'block')
        }else{
            $('.empty_view').css('display', 'none')
        }

        products = filtered

        var rowCount = 1,
            numProducts = products.length,
            numRows = Math.ceil(products.length / s.numColumns),
            itemWidth;

        s.cartContainer.hide();
        s.container.fadeOut(s.fadeSpeed, function () {

            // Empty out main container on load
            s.container.html('').fadeIn(s.fadeSpeed);

            // Build rows based on number of products
            for (var r = 0; r < numRows; r++) {
                s.container.append('<div class="row ' + s.rowClass + (r + 1) + '"></div>');
            }

            // Get item column width
            var widthClasses = s.columnWidthClasses;
            for (var k in widthClasses) {
                if (k == s.numColumns) {
                    itemWidth = widthClasses[k];
                }
            }

            // List layout
            products.forEach(function (product, i) {

                if (!product.soldOut && product.category == category) {
                    var tmpl = $('#products-template').html(),
                        $tmpl = $(tmpl);

                    // Set item width
                    $tmpl.first().addClass(itemWidth);

                    // Insert data into template
                    simpleStore.insertData($tmpl, product);

                    // Render detail view on hash change
                    var getDetail = $tmpl.find('.simpleStore_getDetail');
                    getDetail.on('click', function (e) {
                        e.preventDefault();
                        window.location.hash = 'product/' + product.id;
                    });

                    // Check where to add new item based on row
                    if (i === 0) {
                        i = 1;
                    }
                    if (i % (s.numColumns) === 0) {
                        rowCount++;
                    }

                    // Append to appropriate container
                    $('.' + s.rowClass + rowCount).append($tmpl);
                }
            });
        });
    },

    renderProductOptions: function (options, s) {

        var optionsLayout = '';

        options.forEach(function (option) {
            if (!(simpleStore.productPageOptions in option)) {
                var selectItems = '';
                var attributeLabel = Object.keys(option)[0].trim();
                var attributeValues = option[attributeLabel].trim().split(",");

                // Set attribute values
                $(attributeValues).each(function (attribute, attributeValue) {
                    selectItems += '<option value="' + attributeValue.replace(/ /g, "_").toLowerCase() + '"> ' + attributeValue + ' </option>';
                });

                // Build options layout
                if (options.length) {
                    optionsLayout += '<label>' + attributeLabel + '</label><select class="item_' + attributeLabel.replace(/ /g, "_").toLowerCase() + '">' + selectItems + '</select>';
                }
            } else {
                simpleStore.renderProductPageOptions(option);
            }
        });

        return optionsLayout;
    },

    renderProductPageOptions: function (option) {
        if (option.OneOfAKind) {
            $('.qty').hide();
        }
    },

    renderSingleProduct: function (id, s) {

        s.container.fadeOut(s.fadeSpeed, function () {

            var tmpl = $('#product-detail-template').html(),
                $tmpl = $(tmpl);

            simpleStore.products.forEach(function (product) {
                if (product.id == id) {

                    // Insert data into template
                    simpleStore.insertData($tmpl, product);

                    // Load detail view into main container
                    s.container.html($tmpl);

                    // Render product options
                    if (product.options.length) {
                        var options = simpleStore.renderProductOptions(product.options, s);
                        $('.simpleStore_options').append(options);
                    }
                    s.container.fadeIn(s.fadeSpeed);
                }
            });
        });
    },

    renderCart: function (s) {
        s.container.fadeOut(s.fadeSpeed, function () {
            s.cartContainer.fadeIn(s.fadeSpeed);
        });
    },

    renderError: function (s, msg) {
        var tmpl = $('#error-template').html(),
            $tmpl = $(tmpl);

        // Empty out main container on load
        s.container.html('').fadeIn(s.fadeSpeed);

        if (msg.length) {
            $tmpl.find('.error_text').text(msg);
        }
        s.container.append($tmpl);
        s.container.fadeIn(s.fadeSpeed);

        $tmpl.find('.alert_close').on('click', function (e) {
            e.preventDefault();
            $tmpl.fadeOut(s.fadeSpeed, function () {
                $tmpl.remove();
            });
        });
    },

    handleFailure: function (s, errorMsg) {
        setTimeout(function () {
            simpleStore.renderError(s, errorMsg);
        }, 1000);
    },

    notifier: function (msg, time_ = 2000) {
        s = this.settings;

        var tmpl = $('#notify-template').html(),
            $tmpl = $(tmpl);
       
        if (msg.length) {
            $tmpl.find('.notify_text').text(msg);
            s.container.append($tmpl);
            $tmpl.hide();
            $tmpl.fadeIn(s.fadeSpeed);
            setTimeout(function () {
                $tmpl.fadeOut(s.fadeSpeed);
            }, time_);
        }
    },

    initJSON: function (s) {
        var errorMsg = 'There was an error loading the JSON file.' +
            ' Please make sure you have "' + s.JSONFile + '" file in' +
            ' your main directory.';

        // Checks to make sure file exists
        $.get(s.JSONFile)
            .success(function () {
                // Get product data from JSON file
                $.getJSON(s.JSONFile, function (data) {
                    simpleStore.setProducts(data.products);
                })
                .fail(function () { simpleStore.handleFailure(s, errorMsg); });
            })
            .fail(function () { simpleStore.handleFailure(s, errorMsg); });
    },

    checkMode: function (s) {
        if (s.hasOwnProperty("spreadsheetID") || s.hasOwnProperty("spreadsheetId")) {
            s.mode = "Google";
        }
    },

    checkout: function (s, checkoutData) {
        if (!$.isEmptyObject(checkoutData)) {
            simpleCart.checkout();
            s.cartContainer.fadeOut(s.fadeSpeed, function () {
                s.container.html('<i class="fa fa-spin fa-circle-o-notch loader"></i>');
                s.container.fadeIn(s.fadeSpeed);
            });
        }
    },

    verifyCheckoutData: function (cdata, adata, v) {
        for (var d in cdata) {
            if (cdata.hasOwnProperty(d)) {
                var cp = cdata[d], cn = cp.name, cpp = cp.price;
                for (var i = 0; i < adata.length; i++) {
                    var ap = adata[i], an = ap.name, app = ap.price;
                    if (cn === an) { if (cpp != app) { v = false; } }
                }
            }
        }
        return v;
    },

    validatePrices: function (s) {
        var checkoutData = JSON.parse(localStorage.simpleCart_items),
            errorMsg = 'There was an error validating your cart.';

        if (s.mode === "JSON") {
            $.get(s.JSONFile)
                .success(function () {
                    $.getJSON(s.JSONFile, function (data) {
                        var JSONData = data.products;
                        if (simpleStore.verifyCheckoutData(checkoutData, JSONData, true)) {
                            simpleStore.checkout(s, checkoutData);
                        } else {
                            simpleStore.renderError(s, errorMsg);
                        }
                    })
                        .fail(function () { simpleStore.handleFailure(s, errorMsg); });
                })
                .fail(function () { simpleStore.handleFailure(s, errorMsg); });
        } else {
            var plugin = s.mode.toLowerCase();
            if (simpleStore.plugins[plugin]) {
                simpleStore.plugins[plugin].validate(checkoutData);
            }
        }
    },

    setProducts: function (products, s) {
        if (products.length > 0) {
            products.forEach(function (product, index) {
                product.id = index + 1;
                simpleStore.products.push(product);
            });
        }

        // Manually trigger on initial load
        $(window).trigger('hashchange');
    },

    setLayout: function (s) {
        // Set brand
        if (s.brand.match('^http://') || s.brand.match('^https://') || s.brand.match('^www.')) {
            $('.brand').html('<img src="' + s.brand + '" />');
        } else {
            $('.brand').html('<h5>' + s.brand + '</h5>');
        }

        // Set title
        $('title').html(s.brand);
    },

    generateCart: function (s) {
        var tmpl = $('#cart-template').html(),
            $tmpl = $(tmpl);
        s.cartContainer.html($tmpl);
    },

    generateStore: function () {

        var s = this.settings;

        // Set mode
        this.checkMode(s);

        // Check for hash changes
        $(window).on('hashchange', function () {
            simpleStore.render(window.location.hash, s);
        });

        // Set products based on mode
        switch (s.mode) {
            case 'JSON':
                this.initJSON(s);
                break;
            case 'Google':
                if (simpleStore.plugins.google) {
                    simpleStore.plugins.google.init(function (products) {
                        simpleStore.setProducts(products, s);
                    });
                } else {
                    var errorMsg = 'There was an error loading the Google plugin. Make sure it is installed properly.';
                    simpleStore.renderError(s, errorMsg);
                }
                break;
            default:
                this.initJSON(s);
        }

        // Because simpleCart items appends to cart, set up only once
        this.generateCart(s);

        // Setup layout
        this.setLayout(s);

        // Handle Checkout
        $('.simpleStore_checkout').on('click', function (e) {
            e.preventDefault();
            simpleStore.validatePrices(s);
        });

        // View Cart
        $('.simpleStore_viewCart').on('click', function (e) {
            e.preventDefault();
            window.location = '#cart';
        });

        // Go to home on close
        $('.view_close').on('click', function (e) {
            e.preventDefault();
            window.location.hash = '';
        });

        // SimpleCart extend
        simpleCart({
            afterAdd: function () {
                simpleStore.notifier('Item added to cart');
            }
        });
    },

    init: function (options) {
        if ($.isPlainObject(options)) {
            return this.extend(this.settings, options, function () {
                simpleStore.generateStore();
            });
        }
    }
};

sider_bar = {
    init: function (options) {
        options.button_event.click(() => {
            //Ação no btn menu
            let uni = $('#unidades option:selected').text()
           
            if (!options.button_event.hasClass("open")) {
                $('#mySite').addClass('nav_shadow')
                options.button_event.addClass("open")
                options.div.html(options.template.html())
                options.div.fadeOut(0, function () {
                    options.div.fadeIn(400)
                })

                $('.name').html(localStorage.getItem('name_facilities_food'));
                $('.email').html(localStorage.getItem('email_facilities_food'));
            } else {
                $('#mySite').removeClass('nav_shadow')
                options.button_event.removeClass('open')
                options.div.fadeOut(400, function () {
                    options.div.html('').fadeIn(0)
                })
            }
            // Checks to make sure file exists
            $.get(options.category)
                .success(function (response) {
                    response = JSON.parse(response)
                    let tmp = `<a href="#all" class="${options.close_generic}"><span class="fa fa-circle ml-1"></span> Todos</a>`;
                    Object.keys(response).forEach((a) => {
                        tmp += `<a href="#category/${a}" class="${options.close_generic}"><span class="fa fa-circle ml-1"></span> ${response[a]}</a>`
                    });
                    $('.div_category').html(tmp);
                    action_close()
                })
                .fail(function () {
                    alert('Erro ao carregar as categorias')
                });
            // fechar sidebar em outros elementos
            let action_close = () => {
                $(options.class_close.selector).each((a, i) => {
                    $(i).on('click', () => {
                        $('#mySite').removeClass('nav_shadow')
                        options.button_event.removeClass('open')
                        options.div.fadeOut(400, function () {
                            options.div.html('').fadeIn(200)
                        })
                    })
                });
            }

            $('#text_unidade').text(uni)
            action_close()
        });
    }
}

function openModalLogin(functionCallCheckout = null) {

    /** Open and close modal */
    $('#div-modal-login').html($('#modal-login-template').html())
    $('#div-modal-login').fadeOut(0, function () {
        $('#div-modal-login').fadeIn(400)
        $('#mySite').css('overflow-y','hidden')
    })
    $('#close-login').on('click', () => {
        $('#div-modal-login').fadeOut(400, function () {
            $('#div-modal-login').html('').fadeIn(0)
            $('#mySite').css('overflow-y','auto')
        })
    })

    /** Submit auth api */
    $('#form_login_auth').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "http://35.237.253.252/facilities-food/api/login",
            data: { "login": $('#login_').val(), "password": $('#password_').val() },
            method: "POST"
        })
            .success((resp) => {
                let res = JSON.parse(resp);
                console.log(res)
                if (res.error) {
                    clearStorage()
                } else {
                    localStorage.setItem('remember_facilities_food', res.remember);
                    localStorage.setItem('name_facilities_food', res.name);
                    localStorage.setItem('email_facilities_food', res.email);
                    localStorage.setItem('id_facilities_food', res.data.id);
                    localStorage.setItem('unidade_facilities_food', res.data.unidade);
                    let url = `/facilities-food/api/user-order?token=${res.remember}`
                    $('#meus_pedidos').attr('href', url)
                    console.log(res);
                    $('#div-modal-login').fadeOut(400, function () {
                        $('#div-modal-login').html('').fadeIn(0);
                    })
                    /** check that before login calls the method checkout custom */
                    if (functionCallCheckout != null) {
                        functionCallCheckout()
                    }
                }
            })
            .fail(() => {
                return false
            })
            .done(() => {
                return false
            })
        return false
    });

    return "PI"
}

try {
    if(localStorage.getItem('remember_facilities_food')){
        let url_ = `/facilities-food/api/user-order?token=${localStorage.getItem('remember_facilities_food')}`
        $('#meus_pedidos').attr('href', url_)
    }else{
        $('#meus_pedidos')
        .attr('href','#')
        .html('<i class="fa fa-user"></i>LOGIN')
        .click(()=>{
            openModalLogin(reload)
        })
    }
} catch (error) {
    
}


function reload(){
    window.location.reload()
}

function logout(){
    localStorage.removeItem('remember_facilities_food')
    localStorage.removeItem('email_facilities_food')
    localStorage.removeItem('name_facilities_food')
    setTimeout(() => {
      window.location.href = "http://35.237.253.252/facilities-store/"
    }, 1000);
}

function clearStorage(){
    localStorage.removeItem('remember_facilities_food');
    localStorage.removeItem('name_facilities_food');
    localStorage.removeItem('email_facilities_food');
    localStorage.removeItem('id_facilities_food');
    localStorage.removeItem('unidade_facilities_food');
}

$.ajax({
    url:"/facilities-food/api/unidades",
    method: 'get',
    success:(response)=>{
        response = JSON.parse(response)
        console.log(response);
        let my_unidade = localStorage.getItem('unidade_facilities_food')
        let template = ''
        response.unidades.forEach((e)=>{
            template += `
            <option value="${e.id}" ${my_unidade == e.id ? 'selected' : ''}>${e.unidade}</option>
            `
        })
        $('#unidades').html(template)
    }
})



function clearNote(arg=''){
    $('.item_note').val('')
    $('input.item_Quantity').val(1)
}


let config = ()=>{
    if(!$('.config_unidade').hasClass('hidden')){
        $('.config_unidade').addClass('hidden')
        $('#mySite').removeClass('desfoca')
        return
    }
    $('.config_unidade').removeClass('hidden')
    $('#mySite').addClass('desfoca')
}

let saveConfig = ()=>{
    let unidade = $('#unidades').val()
    localStorage.setItem('unidade_facilities_food', unidade)
    localStorage.setItem('simpleCart_items',JSON.stringify({}))
    simpleCart.empty()
    simpleStore.products = []
    simpleStore.setProducts({})
    simpleStore.initJSON({
		// name of JSON file, located in directory root
		JSONFile : "http://35.237.253.252/facilities-food/api/produto?unidade=" + localStorage.getItem('unidade_facilities_food') || ''
	});
}

$('.mouse_scroll').click(()=> $('#mySite').scrollTop(500) )

$('.setting').click(()=>{
    config()
})

$('.save_config').click(()=>{
    saveConfig()
    config()
})


