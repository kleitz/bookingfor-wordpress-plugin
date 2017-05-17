var bookingfor = new function() {
    this.version = "3.0.1";
	this.bsVersion = ( typeof jQuery.fn.typeahead !== 'undefined' ? 2 : 3 );
    this.offersLoaded = [];

    this.getDiscountAjaxInformations = function (discountId, hasRateplans) {
        if (cultureCode.length > 1) {
          cultureCode = cultureCode.substring(0, 2).toLowerCase();
        }
        if (defaultcultureCode.length > 1) {
          defaultcultureCode = defaultcultureCode.substring(0, 2).toLowerCase();
        }

        var query = "discountId=" + discountId + "&hasRateplans=" + hasRateplans + "&language=en-gb&task=getDiscountDetails";
        jQuery.getJSON(urlCheck + "?" + query, function(data) {

          var name = getXmlLanguage(data.Name, cultureCode, defaultcultureCode);;
          name = nl2br(jQuery("<p>" + name + "</p>").text());
          jQuery("#divoffersTitle" + discountId).html(name);

          var descr = getXmlLanguage(data.Description, cultureCode, defaultcultureCode);;
          descr = nl2br(jQuery("<p>" + descr + "</p>").text());
          jQuery("#divoffersDescr" + discountId).html(descr);
          jQuery("#divoffersDescr" + discountId).removeClass("com_bookingforconnector_loading");
        });

      };

    this.getRateplanAjaxInformations = function (rateplanId) {
        if (cultureCode.length > 1) {
          cultureCode = cultureCode.substring(0, 2).toLowerCase();
        }
        if (defaultcultureCode.length > 1) {
          defaultcultureCode = defaultcultureCode.substring(0, 2).toLowerCase();
        }

        var query = "rateplanId=" + rateplanId + "&language=en-gb&task=getRateplanDetails";
        jQuery.getJSON(urlCheck + "?" + query, function(data) {

          var name = getXmlLanguage(data.Name, cultureCode, defaultcultureCode);;
          name = nl2br(jQuery("<p>" + name + "</p>").text());
          jQuery("#divrateplanTitle" + rateplanId).html(name);

          var descr = getXmlLanguage(data.Description, cultureCode, defaultcultureCode);;
          descr = nl2br(jQuery("<p>" + descr + "</p>").text());
          jQuery("#divrateplanDescr" + rateplanId).html(descr);
          jQuery("#divrateplanDescr" + rateplanId).removeClass("com_bookingforconnector_loading");
        });

      };

    this.getData = function (urlCheck, query, elem, name, act) {
		query += '&simple=1';
		if (typeof(ga) !== 'undefined') {
			ga('send', 'event', 'Bookingfor', act, name);
			ga(function(){
				jQuery.post(urlCheck, query, function(data) {
						jQuery(elem).parent().html(data);
						jQuery(elem).remove();
				});
			});
		}else{
			jQuery.post(urlCheck, query, function(data) {
					jQuery(elem).parent().html(data);
					jQuery(elem).remove();
			});
		}
	};

    this.getXmlLanguage = function (value, cultureCode, defaultcultureCode) {
		var ret = value;
		if(value && value.indexOf("<languages>")>-1){
			var xmlValue = jQuery.parseXML(value);
			var jsonValue = jQuery.xml2json(xmlValue);
			try {
				if (jsonValue.language.hasOwnProperty("code")) {
					ret = (jsonValue.language.hasOwnProperty("text") ? jsonValue.language.text : "") ;
				} else {
					var defaultValue = '';
					jQuery.each(jsonValue.language, function (i, lang) {
						if (lang.code === cultureCode)
						{
							ret = (lang.hasOwnProperty("text") ? lang.text : "") ;
						}
						if (lang.code === defaultcultureCode)
						{
							defaultValue = (lang.hasOwnProperty("text") ? lang.text : "") ;
						}

					});
					if(ret===''){
						ret = defaultValue;
					}

				}
			}
			catch (e) {
			}
		}
		return ret;
	};

	this.make_slug = function ( str )
	{
		str = str.toLowerCase();
		str = str.replace(/\&+/g, 'and');
		str = str.replace(/[^a-z0-9]+/g, '-');
		str = str.replace(/^-|-$/g, '');
		return str;
	};

	this.nl2br = function (str, is_xhtml) {   
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
	};

	this.nomore1br = function (str) {   
		return (str + '').replace(new RegExp('(\n){2,}', 'gim') , '\n');
	};

	this.stripbbcode = function (str, is_xhtml) {   
		str = (str + '').replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '$2');
		str = str.replace(/(\[ul\]|\[\/ul\]|\[ol\]|\[\/ol\])+/g, '');
		return str;
	};

	this.priceFormat = function (number, decimals, dec_point, thousands_sep) {   
	  number = (number + '')
		.replace(/[^0-9+\-Ee.]/g, '');
	  var number = !isFinite(+number) ? 0 : +number,
		//conversion valuta;
		defaultcurrency = bfi_variable.defaultCurrency;//  bfi_get_defaultCurrency();
		currentcurrency = bfi_variable.currentCurrency;//  bfi_get_currentCurrency();

		if(defaultcurrency!=currentcurrency){
			//try to convert
			currencyExchanges =  bfi_variable.CurrencyExchanges;// BFCHelper::getCurrencyExchanges();
			if (currencyExchanges.hasOwnProperty(currentcurrency)) {
				number = number*currencyExchanges[currentcurrency];
			}
		}
		return bookingfor.number_format(number, decimals, dec_point, thousands_sep);
	};

	this.number_format = function (number, decimals, dec_point, thousands_sep) {
	  //  discuss at: http://phpjs.org/functions/number_format/
	  // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // improved by: davook
	  // improved by: Brett Zamir (http://brett-zamir.me)
	  // improved by: Brett Zamir (http://brett-zamir.me)
	  // improved by: Theriault
	  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // bugfixed by: Michael White (http://getsprink.com)
	  // bugfixed by: Benjamin Lupton
	  // bugfixed by: Allan Jensen (http://www.winternet.no)
	  // bugfixed by: Howard Yeend
	  // bugfixed by: Diogo Resende
	  // bugfixed by: Rival
	  // bugfixed by: Brett Zamir (http://brett-zamir.me)
	  //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	  //  revised by: Luke Smith (http://lucassmith.name)
	  //    input by: Kheang Hok Chin (http://www.distantia.ca/)
	  //    input by: Jay Klehr
	  //    input by: Amir Habibi (http://www.residence-mixte.com/)
	  //    input by: Amirouche
	  //   example 1: number_format(1234.56);
	  //   returns 1: '1,235'
	  //   example 2: number_format(1234.56, 2, ',', ' ');
	  //   returns 2: '1 234,56'
	  //   example 3: number_format(1234.5678, 2, '.', '');
	  //   returns 3: '1234.57'
	  //   example 4: number_format(67, 2, ',', '.');
	  //   returns 4: '67,00'
	  //   example 5: number_format(1000);
	  //   returns 5: '1,000'
	  //   example 6: number_format(67.311, 2);
	  //   returns 6: '67.31'
	  //   example 7: number_format(1000.55, 1);
	  //   returns 7: '1,000.6'
	  //   example 8: number_format(67000, 5, ',', '.');
	  //   returns 8: '67.000,00000'
	  //   example 9: number_format(0.9, 0);
	  //   returns 9: '1'
	  //  example 10: number_format('1.20', 2);
	  //  returns 10: '1.20'
	  //  example 11: number_format('1.20', 4);
	  //  returns 11: '1.2000'
	  //  example 12: number_format('1.2000', 3);
	  //  returns 12: '1.200'
	  //  example 13: number_format('1 000,50', 2, '.', ' ');
	  //  returns 13: '100 050.00'
	  //  example 14: number_format(1e-8, 8, '.', '');
	  //  returns 14: '0.00000001'

	  number = (number + '')
		.replace(/[^0-9+\-Ee.]/g, '');
	  var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function (n, prec) {
		  var k = Math.pow(10, prec);
		  return '' + (Math.round(n * k) / k)
			.toFixed(prec);
		};
	  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
	  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
		.split('.');
	  if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	  }
	  if ((s[1] || '')
		.length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1)
		  .join('0');
	  }
	  return s.join(dec);
	};

	this.updateQueryStringParameter = function (uri, key, value) {
	  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	  if (uri.match(re)) {
		return uri.replace(re, '$1' + key + "=" + value + '$2');
	  }
	  else {
		return uri + separator + key + "=" + value;
	  }
	};



	this.waitBlockUI = function (msg1 ,msg2, img1){
	msg1 = msg1 ? msg1 : "";
	msg2 = msg2 ? msg2 : "";
	var msggeneral = jQuery.trim(msg1).length && jQuery.trim(msg2).length ? msg1 + '<br />' + msg2 : (jQuery.trim(msg1).length ? msg1 : msg2);
	jQuery.blockUI({
		message: (jQuery.trim(msggeneral).length ? '<h1 style="font-size: 15px;">'+msggeneral+'</h1><br />' : "") + '<i class="fa fa-spinner fa-spin fa-3x fa-fw margin-bottom"></i><span class="sr-only">Loading...</span>', 
		css: {border: '2px solid #1D668B', padding: '20px', backgroundColor: '#fff', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', color: '#1D668B'},
		overlayCSS: {backgroundColor: '#1D668B', opacity: .7}  
		});
	};

	this.waitBlock = function (msg1 ,msg2, obj){
	obj.block({
		message: '<h1 style="font-size: 15px;">'+msg1+'<br />'+msg2+'</h1><br /><i class="fa fa-spinner fa-spin fa-3x fa-fw margin-bottom"></i><span class="sr-only">Loading...</span>', 
		css: {border: '2px solid #1D668B', padding: '20px', backgroundColor: '#fff', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', color: '#1D668B', width: '80%'},
//		overlayCSS: {backgroundColor: '#1D668B', opacity: .7}  
		overlayCSS: {backgroundColor: '#1D668B', opacity: 0}  
		});
	};

	this.waitSimpleBlock = function (obj){
		obj.block({
			message: '<i class="fa fa-spinner fa-spin fa-3x fa-fw margin-bottom"></i><span class="sr-only">Loading...</span>',
			css: {border: '2px solid #1D668B', padding: '10px 20px', backgroundColor: '#fff', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', color: '#1D668B', width: '80%'},
			overlayCSS: {backgroundColor: '#1D668B', opacity: .7}
		});
	};

	this.waitSimpleWhiteBlock = function (obj){
		obj.block({
			message: '<i class="fa fa-spinner fa-spin fa-3x fa-fw margin-bottom"></i><span class="sr-only">Loading...</span>',
			css: {border: 'none', width: '100%'},
			overlayCSS: {backgroundColor: '#ffffff', opacity: 0.7}  
		});
	};

	this.dateAdd = function(date, interval, units) {
		var ret = new Date(date); //don't change original date
		switch(interval.toLowerCase()) {
			case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
			case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
			case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
			case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
			case 'day'    :  ret.setDate(ret.getDate() + units);  break;
			case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
			case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
			case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
			default       :  ret = undefined;  break;
		}
		return ret;
	}

	this.convertDateToInt = function(currDate) {
		var month = currDate.getMonth() + 1;
		var day = currDate.getDate();
		var year = currDate.getFullYear();
		var datereformat = year + '' + bookingfor.pad(month,2) + '' + bookingfor.pad(day,2);
		var intDate = Number(datereformat);
		return (intDate)
	}

	this.pad = function(str, max) {
		if (!str) {
			str = "";
		}
		str = str.toString();
		return str.length < max ? this.pad("0" + str, max) : str;
	}

	this.addToCart = function(objSource) {
		bookingfor.waitBlockUI();
//		jQuery.blockUI({�message:�''});
		var cart = jQuery('.bookingfor-shopping-cart');
		var recalculareOrder = 0;
		var orderDetailSummarytodrag = jQuery("#orderDetailSummary");
		if (jQuery(objSource).length) {
			orderDetailSummarytodrag = objSource;
			recalculateOrder = 1;
		}
		if (cart.length)
		{
			if (orderDetailSummarytodrag.length ) {
				var divClone = orderDetailSummarytodrag.clone().offset({
					top: orderDetailSummarytodrag.offset().top,
					left: orderDetailSummarytodrag.offset().left
				})
					.css({
						'opacity': '0.5',
						'width': orderDetailSummarytodrag.width() + "px",
						'height': orderDetailSummarytodrag.height() + "px",
						'position': 'absolute',
						'z-index': '100',
						'overflow': 'hidden'
					})
					.appendTo(jQuery('body'))
					.animate({
						'top': cart.offset().top + 10,
						'left': cart.offset().left,
						'width': 0,
						'height': 0
					}, 1000, 'easeInOutExpo', function () {
						jQuery(this).remove();
						//cartModel();
						jQuery.ajax({
							cache: false,
							type: 'POST',
							url: bfi_variable.bfi_urlCheck + '?task=addToCart',
							data: 'hdnOrderData=' + jQuery("#hdnOrderDataCart").val() + "&recalculateOrder=" + recalculateOrder +  '&hdnBookingType=' + jQuery("#hdnBookingType").val(),
							success: function (data) {
	//							console.log(data);
								jQuery.unblockUI();
								
								var currTitle = jQuery("#bfimodalcart").find(".bfi-title").first().html();
								var currHtml = jQuery("#bfimodalcart").find(".bfi-body").first().html();
								var currFooter = jQuery("#bfimodalcart").find(".bfi-footer").first().html();

								var thisHtml = currHtml;
								jQuery(".bf-summary-body-resourcename").each(function () {
									var cuttTitle = $(this).find("strong").first();
									if (cuttTitle.length) {
										thisHtml += "<div>" + cuttTitle.html() + "</div>";
									}
								});
								thisHtml += currFooter;
								cart.webuiPopover({
									title : currTitle,
									content : thisHtml,
									container: document.body,
									cache: false,
									closeable:true,
									arrow: false,
									backdrop:true,
									placement:'auto-bottom',
									type:'html',
								});
								cart.webuiPopover("show");


//								jQuery("#bfimodalcart").find(".modal-body").first().html(thisHtml);
//								jQuery("#bfimodalcart").modal({ backdrop: 'static' });
							}
						});
						//send data 

						//$("#LoginRegisterModel").html("");
						//$("#LoginRegisterModel").load(cartUrl);
						//$("#LoginRegisterModel").modal({ backdrop: 'static' });

					});

			}else{
				jQuery.ajax({
					cache: false,
					type: 'POST',
					url: bfi_variable.bfi_urlCheck + '?task=addToCart',
					data: 'hdnOrderData=' + jQuery("#hdnOrderDataCart").val() + "&recalculateOrder=" + recalculateOrder+  '&hdnBookingType=' + jQuery("#hdnBookingType").val(),
					success: function (data) {
		//							console.log(data);
						jQuery.unblockUI();
//						var thisHtml = "<div>Add to cart</div>";
	//					jQuery(".bf-summary-body-resourcename").each(function () {
	//						var cuttTitle = $(this).find("strong").first();
	//						if (cuttTitle.length) {
	//							thisHtml += "<div>" + cuttTitle.html() + "</div>";
	//						}
	//					});
//						jQuery("#bfimodalcart").find(".modal-body").first().html(thisHtml);
//						jQuery("#bfimodalcart").modal({ backdrop: 'static' });
								var currTitle = jQuery("#bfimodalcart").find(".bfi-title").first().html();
								var currHtml = jQuery("#bfimodalcart").find(".bfi-body").first().html();
								var currFooter = jQuery("#bfimodalcart").find(".bfi-footer").first().html();

								var thisHtml = currHtml;
//								jQuery(".bf-summary-body-resourcename").each(function () {
//									var cuttTitle = $(this).find("strong").first();
//									if (cuttTitle.length) {
//										thisHtml += "<div>" + cuttTitle.html() + "</div>";
//									}
//								});
								thisHtml += currFooter;
								cart.webuiPopover({
									title : currTitle,
									content : thisHtml,
									container: document.body,
									cache: false,
									closeable:true,
									arrow: false,
									backdrop:true,
									placement:"auto",
									html :"true"
								});
								cart.webuiPopover("show");
					}
				});
			}
		}


	}



	this.removeFromCart = function() {
		jQuery.ajax({
			cache: false,
			type: 'POST',
			url: removeFromCartUrl,
			beforeSend: function () {
				bookingfor.waitBlockUI();
				//blockui();
			},
			data: {
				cartOrderId: jQuery(this).attr("data-cartorderid")
			},
			success: function (data) {
				jQuery("#LoginRegisterModel").html(data);
				//$("#LoginRegisterModel").modal({ backdrop: 'static' });
				jQuery.unblockUI();
			}
		});
	}
	this.GetDiscountsInfo = function(discountIds,language, obj, fn) {
			var query = "discountIds=" + discountIds;
			var queryDiscount = "discountId=" + discountIds + "&language=" + language + "&task=getDiscountDetails";
			jQuery.post(urlCheck, queryDiscount, function(data) {

				$html = '';
				jQuery.each(data || [], function (key, val) {
					var name = val.Name;
					var descr = val.Description;
					name = bookingfor.nl2br(jQuery("<p>" + name + "</p>").text());
					$html += '<p class="title">' + name + '</p>';
					descr = bookingfor.nl2br(jQuery("<p>" + bookingfor.stripbbcode(descr) + "</p>").text());
					$html += '<p class="description ">' + descr + '</p>';
				});
				bookingfor.offersLoaded[discountIds] = $html;
				fn(obj, $html);
			},'json');
		}
	this.checkBookable = function(currSelect) {
		var isbookable = jQuery(currSelect).attr("data-isbookable");
		jQuery(".ddlrooms.ddlrooms-indipendent[data-isbookable!='" + isbookable+"']").each(function (index) {
			jQuery(this).val(0);
			bookingfor.checkMaxSelect(this);
		});
	}

	this.checkMaxSelect = function(currSelect) {
		var maxSelectable = Number(jQuery(currSelect).attr("data-availability")||0);
		var isbookable = jQuery(currSelect).attr("data-isbookable");
		var resourceId = jQuery(currSelect).attr("data-resid");
		if(jQuery(".ddlrooms-" + resourceId+"[data-isbookable='" + isbookable+"']").length>1){
			var occupancyResource = bookingfor.getOccupancy(resourceId,isbookable);
			var remainingResource = maxSelectable-occupancyResource;

			jQuery(".ddlrooms-" + resourceId+"[data-isbookable='" + isbookable+"']").each(function () {
				var selIndx = jQuery(this).find("option[value='"+remainingResource+"']").index();
				var currSelect = jQuery(this).prop('selectedIndex');
				if (currSelect > selIndx)
				{
					selIndx += currSelect ;
				}
				jQuery(this).find('option:lt(' + selIndx + ')').prop('disabled', false)
				jQuery(this).find('option:gt(' + selIndx + ')').prop('disabled', true)
				jQuery(this).find('option:eq(' + selIndx + ')').prop('disabled', false)
			});
		}

	}
	this.getOccupancy = function(resourceId,isbookable) {
        var occupancy = 0;
		jQuery(".ddlrooms-" + resourceId+"[data-isbookable='" + isbookable+"']").each(function () {
			occupancy += Number(jQuery(this).val()||0)
		});
		return occupancy;
	}





}





jQuery(document).ready(function() {
//      jQuery(".variationlabel").click(
//        function() {
//          var discountId = jQuery(this).attr('rel');
//          var hasRateplans = jQuery(this).attr('rel1');
//          if (jQuery.inArray(discountId, offersLoaded) === -1) {
//            bookingfor.getDiscountAjaxInformations(discountId, hasRateplans);
//            offersLoaded.push(discountId);
//          }
//          jQuery("#divoffers" + discountId).slideToggle("slow");
//        }
//      );
//      jQuery(".rateplanslabel").click(
//        function() {
//          var rateplanId = jQuery(this).attr('rel');
//          if (jQuery.inArray(rateplanId, rateplansLoaded) === -1) {
//            getRateplanAjaxInformations(rateplanId);
//            rateplansLoaded.push(rateplanId);
//          }
//          jQuery("#divrateplan" + rateplanId).slideToggle("slow");
//        }
//      );

	jQuery("#my-account-tabs").tabs();

	var start = jQuery('.checkincalendar').val();
	if (typeof start !== "undefined") {
		 date = jQuery.datepicker.parseDate('dd/mm/yy', start);
		 var dstart = new Date(date);
		 
		 var end = jQuery('.checkoutcalendar').val();
		 date = jQuery.datepicker.parseDate('dd/mm/yy', end);
		 var dend = new Date(date);
		 
		 var dendmin = new Date(dstart);
		 dendmin.setDate(dstart.getDate() + 1);

		jQuery('.checkincalendar').datepicker({
			dateFormat : 'dd/mm/yy',
			defaultDate: dstart,
			onSelect: function(selectedDate) {
			  instance = jQuery('.checkincalendar').data("datepicker");
			  date = jQuery.datepicker.parseDate(
				  instance.settings.dateFormat ||
				  $.datepicker._defaults.dateFormat,
				  selectedDate, instance.settings);
			 var d = new Date(date);
			 d.setDate(d.getDate() + 1);
			 jQuery(".checkoutcalendar").datepicker("option", "minDate", d);
			}
		});
		 
		jQuery('.checkoutcalendar').datepicker({
			dateFormat : 'dd/mm/yy',
			defaultDate: dend,
			minDate: dendmin
		});
	}

	jQuery('a.boxedpopup').on('click', function (e) {
		var width = jQuery(window).width()*0.9;
		var height = jQuery(window).height()*0.9;
			if(width>800){width=870;}
			if(height>600){height=600;}

		e.preventDefault();
		var page = jQuery(this).attr("href")
//		var pagetitle = jQuery(this).attr("title")

		jQuery.post(page, function(data) {
			jQuery.unblockUI();
			var $dialog = jQuery('<div id="boxedpopupopen"></div>')
				.html(data)
			.dialog({
				autoOpen: false,
				modal: true,
				height:height,
				width: width,
				fluid: true, //new option
//				title: pagetitle
			});
			$dialog.dialog('open');
			if (typeof window.BFIInitReCaptcha2 === "function") { 
				// safe to use the function
				BFIInitReCaptcha2();
			}
		});
	});

		jQuery(window).resize(function() {
			var bpOpen = jQuery("#boxedpopupopen");
				var wWidth = jQuery(window).width();
				var dWidth = wWidth * 0.9;
				var wHeight = jQuery(window).height();
				var dHeight = wHeight * 0.9;
				if(dWidth>800){dWidth=870;}
				if(dHeight>600){dHeight=600;}
					bpOpen.dialog("option", "width", dWidth);
					bpOpen.dialog("option", "height", dHeight);
					bpOpen.dialog("option", "position", "center");

			jQuery("table.bfi-table-resources:not(.bfi-table-selectableprice)").each(function(){
				var existSticked = jQuery(this).find("thead.bfi-sticked").first();
				var $currDivBook = jQuery(this).find(".bfi-book-now").first();
				if(existSticked.length){existSticked.remove();};
				if($currDivBook.length){$currDivBook.removeClass("bfi-sticked");};
			});
		});

		jQuery(window).scroll(function(){
			jQuery("table.bfi-table-resources:not(.bfi-table-selectableprice)").each(function(){
				var existSticked = jQuery(this).find("thead.bfi-sticked").first();
				var $currDivBook = jQuery(this).find(".bfi-book-now").first();
				if(jQuery(".bfi-result-list").offset().top <jQuery(window).scrollTop()){
					
					if(!$currDivBook.hasClass("bfi-sticked")){
						$currDivBook.addClass("bfi-sticked");
					}
					if(!existSticked.length){
						var $currthead = jQuery(this).find("thead").first();
						var newthead =  jQuery($currthead.clone());
						newthead.appendTo(jQuery(this));
						newthead.width(jQuery(this).width());
						newthead.css('top',0);
						newthead.addClass("bfi-sticked");
					}
					if((jQuery(".bfi-result-list").offset().top+jQuery(".bfi-result-list").height()) <(jQuery(window).scrollTop()+$currDivBook.height() + 50)){
						$currDivBook.css('top',( (jQuery(".bfi-result-list").offset().top+jQuery(".bfi-result-list").height()) - (jQuery(window).scrollTop()+$currDivBook.height()))  + 'px');
					}else{
						$currDivBook.css('top','50px');
					}
					if((jQuery(".bfi-result-list").offset().top+jQuery(".bfi-result-list").height()) <jQuery(window).scrollTop()){
						existSticked.hide();
						$currDivBook.hide();
					}else{
						existSticked.show();
						$currDivBook.show();
					}
				}else{
					existSticked.remove();
					$currDivBook.removeClass("bfi-sticked");
				}
			});
		});

});      
     
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}   

if (typeof jQuery.fn.serializeObject !== 'function') {
	jQuery.fn.serializeObject = function()
	{
	   var o = {};
	   var a = this.serializeArray();
	   jQuery.each(a, function() {
		   if (o[this.name]) {
			   if (!o[this.name].push) {
				   o[this.name] = [o[this.name]];
			   }
			   o[this.name].push(this.value || '');
		   } else {
			   o[this.name] = this.value || '';
		   }
	   });
	   return o;
	};
}   


function bfi_quoteCalculatorServiceChanged(el){
	
	var selectedExtra = parseInt(jQuery(el).val());
	var currProdRelatedId = jQuery(el).attr("data-resid");
	var currMaxAvailability = servicesAvailability[currProdRelatedId];
	jQuery(".ddlrooms-"+currProdRelatedId).each(function(){
		var currselectableprice = jQuery(this).val();
		currMaxAvailability -= parseInt(currselectableprice);
	});

	//rebuild ddl
	jQuery(".ddlrooms"+currProdRelatedId).not(this).each(function(){
		var currMaxValue = jQuery(this).children("option:last").val();
		var currValue = parseInt(jQuery(this).val());

		jQuery(this).children("option").prop('disabled',false);
		var maxValue = pcurrValue+currMaxAvailability;

		if(currMaxValue>maxValue){
			var prodRelatedId = jQuery(this).attr("data-resid");
			var selIndx  = jQuery(this).children("option").index( jQuery(this).children("option[value='" +maxValue +"']"));
			if(selIndx>-1){
				jQuery(this).children("option:gt("+selIndx+")").prop('disabled',true);

			}
		}
	});

	bfi_getcompleterateplansstaybyrateplanid(jQuery(el));
//	console.log("Recalc");
}

function bfi_getcompleterateplansstaybyrateplanid($el) {
	//console.log("calcolo prezzo per id: " + priceId);
	
//	debugger;
	var selectedExtra = parseInt($el.val());
	var priceId = $el.attr("data-resid");
	var resId = $el.attr("data-bindingproductid");
	var rateplanId = $el.attr("data-rateplanid");
	currTable = $el.closest("table");
    bookingfor.waitSimpleWhiteBlock(currTable);

	var extrasselect = [];
	jQuery(currTable).find(".ddlrooms").each( function( index, element ){
		var currValue = jQuery(this).val();
		var currResId = jQuery(this).attr("data-resid");
		var currAvailabilityType = jQuery(this).attr("data-availabilityType");
		if(currValue!="0"){
			var extraValue = currResId + ":1"; // + currValue;
			if(currAvailabilityType =="2"){
				var currSelectData = jQuery(this).closest("tr").find(".bfi-timeperiod").first();				
				
				extraValue += ":" + currSelectData.attr("data-checkin") + currSelectData.attr("data-timeminstart") + ":" + currSelectData.attr("data-duration") + "::::"
			}
			if(currAvailabilityType =="3"){
				var currSelectData = jQuery(this).closest("tr").find(".bfi-timeslot").first();	
				extraValue += ":::" + currSelectData.attr("data-timeslotid")  + ":" + currSelectData.attr("data-timeslotstart") + ":" + currSelectData.attr("data-timeslotend") + ":" + currSelectData.attr("data-checkin") + "::::"
			}

			extrasselect.push(extraValue);
		}
	});

	obj = jQuery("tr[id^=data-id-"+resId+"-"+rateplanId +"]");
	var ddlroom = jQuery(obj).find(".ddlrooms");

	var searchModel = jQuery('#calculatorForm').serializeObject();
	var dataarray = jQuery('#calculatorForm').serializeArray();
	dataarray.push({name: 'resourceId', value: resId});
	dataarray.push({name: 'id', value: resId});

	var accomodation = {
		ResourceId: resId,
		RatePlanId: rateplanId,
		AvailabilityType:ddlroom.attr("data-availabilityType"),
		TimeMinStart:0,
		TimeMinEnd:0,
		FromDate:"",
		ExtraServices: extrasselect
	};
	
	if(ddlroom.attr("data-availabilityType")==2){

		var currTr = jQuery("#bfi-timeperiod-"+resId);
		dataarray.push({name: 'timeMinStart', value: currTr.attr("data-timeminstart")});
		dataarray.push({name: 'timeMinEnd', value: currTr.attr("data-timeminend")});
		dataarray.push({name: 'CheckInTime', value: currTr.attr("data-checkintime")});
		dataarray.push({name: 'duration', value: currTr.attr("data-duration")});
	}
	if(ddlroom.attr("data-availabilityType")==3){
		var currTr = jQuery("#bfi-timeslot-"+resId);
		accomodation.TimeSlotId = currTr.attr("data-timeslotid");
		accomodation.TimeSlotStart = currTr.attr("data-timeslotstart");
		accomodation.TimeSlotEnd = currTr.attr("data-timeslotend");
	}

	dataarray.push({name: 'pricetype', value:  accomodation.RatePlanId});
	dataarray.push({name: 'rateplanid', value: accomodation.RatePlanId});
//	dataarray.push({name: 'timeMinStart', value: accomodation.TimeMinStart});
//	dataarray.push({name: 'timeMinEnd', value: accomodation.TimeMinEnd});
	dataarray.push({name: 'selectableprices', value: accomodation.ExtraServices.join("|")});
	dataarray.push({name: 'availabilitytype', value: accomodation.AvailabilityType});
	dataarray.push({name: 'searchModel', value: searchModel});

	var jqxhr = jQuery.ajax({
		url: urlCheck + '?task=getCompleteRateplansStay',
		type: "POST",
		dataType: "json",
		data : dataarray
//            data: {
//                id: resId,
//                rateplanid: accomodation.RatePlanId,
//                timeMinStart: accomodation.TimeMinStart,
//                timeMinEnd: accomodation.TimeMinEnd,
//                selectableprices: accomodation.ExtraServices.join("|"),
//                productAvailabilityType : accomodation.AvailabilityType,
//                searchModel: searchModel
//            }
	});

	jqxhr.done(function(result, textStatus, jqXHR)
	{
		if (result) {

			 UpdateQuote();

			if(result.length > 0)
			{
//                    debugger;
				var currResult = jQuery.grep(result, function (rs) {
					return (rs.RatePlanId == parseInt(accomodation.RatePlanId));
				});

				currStay = currResult[0].SuggestedStay;
				var currTr = $el.closest("tr");
				var CalculatedPrices = JSON.parse(currResult[0].CalculatedPricesString);
//                    console.log(CalculatedPrices)
				var showPrice = false;

				var currentDivPrice = jQuery(currTr).find(".bfi-totalextrasselect");
				currentDivPrice.hide();

				CalculatedPrices.forEach(function (cprice) {
					//if (cprice.PriceId == priceId) {
					if (cprice.RelatedProductId == priceId) {

//                            console.log("Visualizzo prezzo id: " + priceId);

						showPrice = true;
						cprice.TotalPrice = cprice.TotalAmount;
						cprice.DiscountedPrice = cprice.TotalDiscounted;
						var simpleDiscountIds = [];
						cprice.Variations.forEach(function (variation) {
							simpleDiscountIds.push(variation.VariationPlanId);
						});
						cprice.SimpleDiscountIds = simpleDiscountIds.join(",");

						var curr_bfi_price = currTr.find(".bfi-price");
						var curr_bfi_discounted_price = currTr.find(".bfi-discounted-price");
						var curr_percent_discount = currTr.find(".bfi-percent-discount");

						var ddlroom = currTr.find(".ddlrooms");
						ddlroom.attr("data-baseprice",bookingfor.number_format(cprice.DiscountedPrice, 2, '.', '') );
						ddlroom.attr("data-basetotalprice",bookingfor.number_format(cprice.TotalPrice, 2, '.', '') );
						ddlroom.attr("data-price",bookingfor.priceFormat(cprice.DiscountedPrice, 2, '.', '') );
						ddlroom.attr("data-totalprice",bookingfor.priceFormat(cprice.TotalPrice, 2, '.', '') );

						curr_bfi_price.html(bookingfor.priceFormat(cprice.TotalPrice, 2, ',', '.') );
						curr_bfi_discounted_price.html(bookingfor.priceFormat(cprice.DiscountedPrice, 2, ',', '.') );

						if(cprice.DiscountedPrice == cprice.TotalPrice) {
							curr_bfi_price.removeClass("bfi-red");
							curr_bfi_discounted_price.hide();
							curr_percent_discount.hide();
						} else {
							curr_bfi_price.addClass("bfi-red");
							curr_bfi_discounted_price.show();
							curr_percent_discount.show();
							curr_percent_discount.attr("rel", cprice.SimpleDiscountIds);
							curr_percent_discount.find(".bfi-percent").html(cprice.VariationPercent);
						}
					}
				});

				if(showPrice){
					currentDivPrice.show();
				}
				
				bfi_updateQuoteService();

			}
		}
		$el.unblock();

	});


	jqxhr.always(function() {
		jQuery(currTable).unblock();
	});
}

function bfi_updateQuoteService() {
				var totalServices = 0;
				var currTotalServices = 0;
				var currTotalNotDiscoutedServices = 0;
				jQuery(".ddlextras").each( function( index, element ){
					var nExtras = parseInt(jQuery(this).val());
					if(nExtras>0)
					{
						totalServices+=nExtras;
						var currTr = jQuery(this).closest("tr");

						currTotalServices += ( parseFloat( currTr.find(".bfi-price").html().replace(".","").replace(",",".")) * nExtras);
						currTotalNotDiscoutedServices += ( parseFloat( currTr.find(".bfi-discounted-price").html().replace(".","").replace(",",".")) *nExtras);
					}
				});

				jQuery(".bfi-extras-total span").html(totalServices);
				if(totalServices > 0){
					jQuery(".bfi-extras-total").show();
				}else{
					jQuery(".bfi-extras-total").hide();
				}

				jQuery(".bfi-price-total").html(bookingfor.number_format(bfi_totalQuote + currTotalServices, 2, ',', '.') );
				jQuery(".bfi-discounted-price-total").html(bookingfor.number_format(bfi_totalQuoteDiscount + currTotalNotDiscoutedServices, 2, ',', '.') );
				jQuery(".bfi-discounted-price-total").hide();
				if((bfi_totalQuoteDiscount + currTotalNotDiscoutedServices)> (bfi_totalQuote + currTotalServices)){
				jQuery(".bfi-discounted-price-total").show();
				}

}