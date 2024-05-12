

var map;
var view;
var graphic;
var currLocation;
var watchId;
var locationGraphic;


require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Search",
  "esri/geometry/Point",
  "esri/layers/MapImageLayer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Graphic",
  "esri/Color"


], function(
  Map,
  MapView,
  Search,
  Point,
  MapImageLayer,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  Graphic,
  Color,
  esriBasemaps

) {

	map = new Map({
	  basemap: "streets-night-vector",
      layers: []
	});
    
    
    view = new MapView({
        container: "mapView",
        map: map,
        center: [-95.36, 36.75],
        zoom: 3,
        popup: {
            dockEnabled: true,
            dockOptions: {
              buttonEnabled: false,
              breakpoint: false
            }
        }
    });

    var tempLayer = new MapImageLayer({
          url:
            "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/NDFD_temp/MapServer",
          sublayers: [
            {
              id: 3,
              visible: true

            }
          ]
    });

    var weatherLayer = new MapImageLayer({
          url:
            "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Observations/radar_base_reflectivity/MapServer",
          sublayers: [
            {
              id: 3,
              visible: true

            }
          ]
    });
	
	map.layers.add(weatherLayer);
    
    var weatherLoading = weatherLayer.on("layerview-create", weatherLoaded);
	function weatherLoaded(evt){
		$("#weather_loading").css('visibility', 'hidden');
	}
    
    $('#weatherCheckbox').change(function () {
        if ($(this).prop('checked')) {
            if (!weatherLayer.loaded){
                $("#weather_loading").css('visibility', 'visible');
            }
            weatherLayer.findSublayerById(3).visible = true;
            map.layers.add(weatherLayer);
            
        } else {
            weatherLayer.findSublayerById(3).visible = false;
        }
	});
    
    
    


	function orientationChanged() {
	  if(map){
		map.reposition();
		map.resize();
	  }
	}
	
	
    $(function(){
        $(".compass").click(function(){
            initFunc();
        });
    });



	function initFunc(map) {
	  if( navigator.geolocation ) {
		  $("#geoloading").css('visibility', 'visible');
		  //Dummy one, which will result in a working next statement.
		  navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
		  //The working next statement.
		  navigator.geolocation.getCurrentPosition(function (position) {
			//Your code here
			navigator.geolocation.watchPosition(watchLocation);
			zoomToLocation(position)
			}, function (e) {
				//Your error handling here
				//$("#geoloading").css('visibility', 'hidden');
			}, {
				enableHighAccuracy: true
			})
		  
			console.log(navigator);
	  } else {
		alert("Browser doesn't support Geolocation. Visit http://caniuse.com to see browser support for the Geolocation API.");
	  }
	}


	function locationError(error) {
	  //error occurred so stop watchPosition
	  if( navigator.geolocation ) {
		navigator.geolocation.clearWatch(watchId);
	  }
	  switch (error.code) {
		case error.PERMISSION_DENIED:
		  alert("Location not provided");
		  break;

		case error.POSITION_UNAVAILABLE:
		  alert("Current location not available");
		  break;

		case error.TIMEOUT:
		  alert("Timeout");
		  break;

		default:
		  alert("unknown error");
		  break;
	  }
	}

	
	
	function zoomToLocation(location) {
		console.log("zoomToLocation");
		var pt = new Point(location.coords.longitude, location.coords.latitude);
		addGraphic(pt);
        //navigator.geolocation.watchPosition(watchLocation);
		view.center = pt;
        view.zoom = 12;
		//$("#geoloading").css('visibility', 'hidden');
    }


	function showLocation(location) {
	  //zoom to the users location and add a graphic
	  console.log("showLocation..");
	  var pt = new Point(location.coords.longitude, location.coords.latitude);
	  if ( !graphic ) {
		addGraphic(pt);
	  } else { // move the graphic if it already exists
		graphic.setGeometry(pt);
	  }
	}


	function zoomer() {
		var p = 1;		
	}
	
	
	function watchLocation(location) {
        var pt = new Point(location.coords.longitude, location.coords.latitude);
        addGraphic(pt);
        console.log(location.coords.latitude);
        console.log(location.coords.longitude);
    }
	
	function addGraphic(pt){
        var symbol = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE, 
            12, 
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color("#ffffff"),
                1.5
            ),
            new Color("#4285f4")
        );
	
        view.graphics.remove(locationGraphic);
        locationGraphic = new Graphic(pt, symbol);
        locationGraphic.id = "location_graphics_layer";
        console.log(locationGraphic.id);
        view.graphics.add(locationGraphic);
    }


	$('#filtersubmit').click(function() {
	alert('Searching for '+$('#filter').val());
	});
    
    
    var searchWidget = new Search({
        view: view
    });
    view.ui.add(searchWidget, {
        position: "top-left",
        index : 0
    });


});


$(function(){
	$('#basemap_toggle').click(function(){
		if ($('#basemap_toggle').hasClass('fa-flip-horizontal')){
			$('#basemap_toggle').removeClass('fa-flip-horizontal');
                        map.basemap = "streets-night-vector";
		} else {
			$('#basemap_toggle').addClass('fa-flip-horizontal');
                        map.basemap = "streets-navigation-vector"
		}
	});
});


$(function(){
	$('#basemap_details_toggle').click(function(){
		if ($('#basemap_details').css('display') == 'none'){
			$('#basemap_details_toggle').removeClass('fa-angle-right').addClass('fa-angle-double-up');
			$('#basemap_details').css('display', 'block');
		} else {
			$('#basemap_details').css('display', 'none');
			$('#basemap_details_toggle').removeClass('fa-angle-double-up').addClass('fa-angle-right');
		}
	});
});


$(function(){
	$('#weather_layer_details_toggle').click(function(){
		if ($('#weather_layer_details').css('display') == 'none'){
			$('#weather_layer_details_toggle').removeClass('fa-angle-right').addClass('fa-angle-double-up');
			$('#weather_layer_details').css('display', 'block');
		} else {
			$('#weather_layer_details').css('display', 'none');
			$('#weather_layer_details_toggle').removeClass('fa-angle-double-up').addClass('fa-angle-right');
		}
	});
});


$(function(){
	$('#bcycle_layer_details_toggle').click(function(){
		if ($('#bcycle_layer_details').css('display') == 'none'){
			$('#bcycle_layer_details_toggle').removeClass('fa-angle-right').addClass('fa-angle-double-up');
			$('#bcycle_layer_details').css('display', 'block');
		} else {
			$('#bcycle_layer_details').css('display', 'none');
			$('#bcycle_layer_details_toggle').removeClass('fa-angle-double-up').addClass('fa-angle-right');
		}
	});
});


$(function(){
	$('#high_layer_details_toggle').click(function(){
		if ($('#high_layer_details').css('display') == 'none'){
			$('#high_layer_details_toggle').removeClass('fa-angle-right').addClass('fa-angle-double-up');
			$('#high_layer_details').css('display', 'block');
		} else {
			$('#high_layer_details').css('display', 'none');
			$('#high_layer_details_toggle').removeClass('fa-angle-double-up').addClass('fa-angle-right');
		}
	});
});


$(function(){
	$('#low_layer_details_toggle').click(function(){
		if ($('#low_layer_details').css('display') == 'none'){
			$('#low_layer_details_toggle').removeClass('fa-angle-right').addClass('fa-angle-double-up');
			$('#low_layer_details').css('display', 'block');
		} else {
			$('#low_layer_details').css('display', 'none');
			$('#low_layer_details_toggle').removeClass('fa-angle-double-up').addClass('fa-angle-right');
		}
	});
});


$(function(){
	$('#key_layer_details_toggle').click(function(){
		if ($('#key_layer_details').css('display') == 'none'){
			$('#key_layer_details_toggle').removeClass('fa-angle-right').addClass('fa-angle-double-up');
			$('#key_layer_details').css('display', 'block');
		} else {
			$('#key_layer_details').css('display', 'none');
			$('#key_layer_details_toggle').removeClass('fa-angle-double-up').addClass('fa-angle-right');
		}
	});
});


$(function(){
	$('#railstations_layer_details_toggle').click(function(){
		if ($('#railstations_layer_details').css('display') == 'none'){
			$('#railstations_layer_details_toggle').removeClass('fa-angle-right').addClass('fa-angle-double-up');
			$('#railstations_layer_details').css('display', 'block');
		} else {
			$('#railstations_layer_details').css('display', 'none');
			$('#railstations_layer_details_toggle').removeClass('fa-angle-double-up').addClass('fa-angle-right');
		}
	});
});


$(function(){
	$('#transit_layer_details_toggle').click(function(){
		if ($('#transit_layer_details').css('display') == 'none'){
			$('#transit_layer_details_toggle').removeClass('fa-angle-right').addClass('fa-angle-double-up');
			$('#transit_layer_details').css('display', 'block');
		} else {
			$('#transit_layer_details').css('display', 'none');
			$('#transit_layer_details_toggle').removeClass('fa-angle-double-up').addClass('fa-angle-right');
		}
	});
});


$(function(){
	$("#layers").click(function(){
		$("#panel").toggle('slow');
	});
});


$(function(){
	$(".menuclose").click(function(){
		$("#legend").toggle();
	});
});


$(function(){
	$("#transit_layer_details_zoomto").click(function(){
		$("#panel").toggle('slow');
	});
});
   
