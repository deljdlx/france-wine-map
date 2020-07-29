
WineMap = function (path) {
  this.path = path;
  this.container = null;
  this.height = null;
  this.map = null;

  this.configuration = {
    zoom:1,
    colors: {
      mapBackground: '#ccc',
      mapBorder: '#fff',
      regions: [
        '#FE93A3',
        '#B83838',
        '#A3BB3E',
        '#948FF6',
        '#FE00C3',
        '#C1BC81',
        '#B2DB00',
        '#83CBDA',
        '#149D61',
        '#D0B1DB',
        '#FCED53',
        '#DF00FA',
        '#FCBB08',
        '#EAE0A2',
        '#0185E8',
      ],
      regionBorderColor: '#fff',
      regionHoverBorderColor: '#0ff',
    },
    url: {
      franceGeoJSON: this.path + '/map/region.geojson',
      wineGeoJSON: this.path + '/map/vin.geojson',
    },
    wineList: this.getWineZones()
  };

};


WineMap.prototype.render = function (container) {
  this.container = document.querySelector(container);
  this.height = this.container.offsetHeight;
  this.width = this.height * 1.06;

  this.container.style.width = this.width + 'px';

  this._drawFranceMap();
};



WineMap.prototype.getWineZones = function() {
  return {
    "Lorraine": [],
    "Jura": [],
    "Languedoc": [],
    "Roussillon": [],
    "Bordeaux": [],
    "Sud Ouest": [],
    "Provence": [],
    "Vin De France": [],
    "Bourgogne": [],
    "Vallée du Rhône": [],
    "Loire": [],
    "Beaujolais": [],
    "Alsace": [],
    "Italie": [],
    "Savoie": [],
    "Champagne": [],
  };
};

//==========================================================================================================

WineMap.prototype._initializeListeners = function () {

  console.log('ineractive');

  this.map.on('mouseover', function (data) {

    console.debug('mouseover');
    console.debug(data);
  }.bind(this));



  this.map.on('mouseout', function (data) {
    return;
    console.debug('mouse out');
    console.log(data);
  });


  this.map.on('click', function (data) {
    console.log('click');
    console.log(data);
  }.bind(this));
};


WineMap.prototype._drawFranceMap = function () {
  console.log('drawing france');
  this.map = myChart = echarts.init(this.container);

  fetch(this.configuration.url.franceGeoJSON).then((response) => {
    return response.json();
  }).then((france) => {
    echarts.registerMap('France', france);
    fetch(this.configuration.url.wineGeoJSON).then((response) => {
      return response.json();
    }).then((franceWine) => {
      echarts.registerMap('FranceWine', franceWine);

      const options = this._getFranceMapOptions();
      options.series[1].data = this._getWineDataset();

      this.map.setOption(options, true);
      this._initializeListeners();
    });
  });
};


WineMap.prototype._getFranceMapOptions = function () {
  return {
    tooltip: {
      show: true,
      showContent: true,
      trigger: 'item',
      showDelay: 0,
      hideDelay: 0,
      transitionDuration: 0,
      formatter: function (params) {
        return params.name;
      }
    },

    visualMap: {
      left: 'right',
      min: 0,
      max: 14,
      inRange: {
        color: this.configuration.colors.regions
      },
      /*text: ['High', 'Low'],*/
      calculable: false,
      show: false,
    },

    series: [
      this._getRegionSerie(),
      this._getWineSerie()
    ]
  };
};


WineMap.prototype._getRegionSerie = function () {
  return {
    zoom: this.configuration.zoom,
    width: this.width,

    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    boundingCoords: this._getBoundingBox(),
    type: 'map',
    mapType: 'France',
    silent: true,

    itemStyle: {
      borderWidth: 1,
      borderColor: this.configuration.colors.mapBorder,
      areaColor: this.configuration.colors.mapBackground,
      label: {
        show: true
      }
    }

  };
};


WineMap.prototype._getWineSerie = function () {
  return {

    clickable: true,
    zoom: this.configuration.zoom,
    width: this.width,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    boundingCoords: this._getBoundingBox(),
    type: 'map',
    mapType: 'FranceWine',
    emphasis: {
      itemStyle: {
        borderWidth: 2,
        borderColor: this.configuration.colors.regionHoverBorderColor,
        areaColor: '#faf',
      },
      label: {
        show: false,
        textStyle: {
          color: '#fff'
        }
      }
    },

    label: {
      show: false,
    },
    itemStyle: {
      borderWidth: 1,
      borderColor: this.configuration.colors.regionBorderColor,
      //color: '#F0F',
      //areaColor: '#F0F',
    }
  };
};


WineMap.prototype._getBoundingBox = function() {
  return [
    // [lng, lat] of left-top corner
    [-6, 51.5],
    // [lng, lat] of right-bottom corner
    [10, 40.855139]
  ];
};


WineMap.prototype._getWineDataset = function () {
  let data = []

  let i = 1;
  for (let region in this.configuration.wineList) {
    data.push({
      name: region,
      value: i
    });

    i++;
  }
  return data;
};
