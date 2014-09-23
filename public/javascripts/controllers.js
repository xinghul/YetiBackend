(function () {
  "use strict";

  /* Controllers */

  myApp.controller('dBeaconCtrl', function ($scope, $route, $http, $timeout) {
    $scope.data = null;
    $scope.nodeLabels = {};
    $scope.linkTypes = [];
    $scope.selectedLabel = null;
    $scope.selectedRls = null;
    $scope.nodeId = null;
    $scope.nodeInfo = null;
    $scope.nodeLabel = null;
    $scope.graphInfo = "";
    $scope.editFormData = {};
    $scope.dataAddNode = {};
    $scope.addingRls = false;
    $scope.nodeChosen = [];
    $scope.deleteNode = function () {
      $http.post('/api/dbeacon/delete', {"id": $scope.nodeId}).
        success(function (data) {
          refreshView(data);
        });
    };
    $scope.editNode = function () {
      var dataToSend = {};
      for (var key in $scope.nodeInfo)
        dataToSend[key] = $scope.editFormData.hasOwnProperty(key) ? 
                          $scope.editFormData[key] : $scope.nodeInfo[key];
      $http.post('/api/dbeacon/update', {"id": $scope.nodeId, "data": dataToSend}).
        success(function (data) {
          refreshView(data);
        });
    };
    $scope.addNode = function () {
      $http.post('/api/dbeacon/addnode', {"label": $scope.selectedLabel.label, "data": $scope.dataAddNode}).
        success(function (data) {
          refreshView(data);
        });
    };
    $scope.addRls = function () {
      $http.post('/api/dbeacon/addrls', {"nodes": $scope.nodeChosen, "type": $scope.selectedRls}).
        success(function (data) {
          refreshView(data);
        });
      $scope.addingRls = false;
      $scope.selectedRls = null;
      $scope.nodeChosen = [];
    };
    $scope.chooseNodes = function () {
      if (!$scope.addingRls) {
        $scope.addingRls = true;
      } else {
        $scope.addingRls = false;
      }
      $scope.nodeChosen = [];
    };

    var height = 600;
    var svg = d3.select("#frame").append("svg")
        .attr("height", height);

    var colorTable = {}, labels = [];
    var colorTableLink = {};
    
    var node = svg.selectAll(".node"),
        linkgroup = svg.selectAll(".link"),
        link = null,
        textNode = null,
        textLink = null,
        cursor = null;

    var color = d3.scale.category20(), 
        link_color = d3.scale.ordinal()
        .domain([0, 1, 2, 3])
        .range(["#000", "#660000", "#006633", "#666600"]);

    var force = d3.layout.force()
        .nodes([{}])
        .charge(-400)
        .on("tick", tick);

    $http.get('/api/dbeacon/list').
    success(function (data, status, headers, config) {
      $scope.data = data;
      $scope.graphInfo = "Displaying " + data.nodes.length + " nodes, " + data.links.length + " relationships.";
      console.log(data);
      initLabelFields();
      updateColorRef();
      updateGraph();
      force.size([angular.element('#frame svg').width(), height]);
    });

    var refreshView = function (data) {
      $timeout(function () {
        $scope.graphInfo = data.msg;
        $scope.$apply();
      });
      $timeout(function () {
        $route.reload();
      }, 1500);
    };

    var initLabelFields = function () {
      var data = $scope.data;
      data.nodes.forEach(function (node) {
        if (!$scope.nodeLabels.hasOwnProperty(node.label)) {
          $scope.nodeLabels[node.label] = [];
          $scope.nodeLabels[node.label].label = node.label;
          $scope.nodeLabels[node.label].fields = [];
          for (var key in node.data)
            $scope.nodeLabels[node.label].fields.push(key);
        }
      });
    };

    var updateColorRef = function () {
      var data = $scope.data;

      data.nodes.forEach(function (node) {
        if (!colorTable.hasOwnProperty(node.label)) {
          labels.push(node.label);
          colorTable[node.label] = color(node.group);
        }
      });

      data.links.forEach(function (link) {
        if (!colorTableLink.hasOwnProperty(link.type)) {
          $scope.linkTypes.push(link.type);
          colorTableLink[link.type] = link_color($scope.linkTypes.length - 1);
        }
      });

      labels.sort();
      $scope.linkTypes.sort();

      var colorSvgNode = d3.select("#color-table-node").append("svg");

      // for nodes
      var cNode = colorSvgNode.selectAll("circle")
      .data(labels, function (d) { return d; });
      
      var heightSvg = 0;

      cNode.enter().append("circle")
      .attr("cx", 40)
      .attr("cy", function (d, i) { return (heightSvg = 40 * i + 20); })
      .style("fill", function (d) { return colorTable[d]; })
      .attr("r", 8);

      var textNode = colorSvgNode.selectAll("text")
      .data(labels, function (d) { return d; })
      .enter().append("text");

      var labelNode = textNode
      .attr("x", 60)
      .attr("y", function (d, i) { return 40 * i + 25; })
      .text( function (d) { return d; })
      .attr("font-family", "Open Sans")
      .attr("font-size", 14);

      colorSvgNode.attr("height", heightSvg + 25);
      heightSvg = 0;

      //for links
      var colorSvgLink = d3.select("#color-table-link").append("svg");
      var cLine = colorSvgLink.selectAll("line")
      .data($scope.linkTypes, function (d) { return d; });
      
      cLine.enter().append("line")
      .attr("x1", 33)
      .attr("y1", function (d, i) { return (heightSvg = 40 * i + 20); })
      .attr("x2", 47)
      .attr("y2", function (d, i) { return 40 * i + 20; })
      .style("stroke", function (d) { return colorTableLink[d]; })
      .style("stroke-width", 3);

      var textLink = colorSvgLink.selectAll("text")
      .data($scope.linkTypes, function (d) { return d; })
      .enter().append("text");

      var labelLink = textLink
      .attr("x", 60)
      .attr("y", function (d, i) { return 40 * i + 25; })
      .text( function (d) { return d; })
      .attr("font-family", "Open Sans")
      .attr("font-size", 14);

      colorSvgLink.attr("height", heightSvg + 25);

      cNode.exit().remove();
      cLine.exit().remove();
    };

    var updateGraph = function () {
      var graph = $scope.data;
      force
          .nodes(graph.nodes)
          .links(graph.links)
          .linkDistance(function (d) { return d.target.weight * 25;})
          .start();

      linkgroup = linkgroup.data(graph.links)
          .enter().append("g");
      link = linkgroup.append("line").attr("class", "link")
          .style("stroke", function (d) { return colorTableLink[d.type]; });
      textLink = linkgroup.append("text")
          .attr("class", "textLink")
          .attr("fill", "#606060")
          .attr("text-anchor", "middle")
          .attr("font-family", "Open Sans")
          .attr("font-size", "12px")
          .attr("font-style", "italic")
          .text(function(d) { return d.type; });

      node = node.data(graph.nodes)
          .enter().append("g")
          .call(force.drag);
      node.append("circle").attr("r", 13)
          .attr("class", "node")
          .style("fill", function (d) { return color(d.group); })
          .on("click", nodeOnClick)
          .on("focusin", nodeFocusIn)
          .on("focusout", nodeFocusOut);
      textNode = node.append("text")
          .attr("class", "textNode")
          .attr("dy", 4)
          .attr("fill", "black")
          .attr("text-anchor", "middle")
          .attr("font-family", "Open Sans")
          .attr("font-size", "15px")
          .text(function(d) { return d.data.name; });
    };
    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      textLink.attr("transform", function(d) { 
        return "translate(" + (d.source.x + d.target.x) / 2 + "," + (d.source.y + d.target.y) / 2 + ")"; 
      });

      node.attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; 
      });
    }

    function nodeOnClick(d) {
      $scope.nodeId = d.id;
      $scope.nodeInfo = d.data;
      $scope.nodeLabel = d.label;
      if ($scope.addingRls) {
        if ($scope.nodeChosen.length < 2) {
          $scope.nodeChosen.push(d.id);
          if ($scope.nodeChosen.length == 2) {
            $("#modalAddRls").modal("show");
          }
        }
      }
      $scope.$apply();
    }

    function nodeFocusIn() {
      d3.select(this).transition()
          .duration(400)
          .attr("r", 20);
    }
    function nodeFocusOut() {
      d3.select(this).transition()
          .duration(400)
          .attr("r", 13);
    }
  });

  myApp.controller('EditorCtrl', function ($scope, $http) {
      $scope.article = {};
      var editor, html = '';
      $scope.createEditor = function () {
          var config = {};
          editor = CKEDITOR.appendTo('editor', null, html);
      };
      $scope.preview = function () {
          document.getElementById('preview').innerHTML = html = editor.getData();
      };
      $scope.addArticle = function () {
          var article = $scope.article;
          article.content = editor.document.getBody().getHtml();
          $http.post('/api/dbeacon/article', article)
              .success(function (data) {
                  console.log(data);
              });
      };
      $scope.createEditor();
  });

  function TestCtrl($scope, $http) {
    $http.get('/api/dbeacon/relation').
    success(function (data, status, headers, config) {
      draw(data);
    });
    var r = 360
    ,   height = 960;

    var fill = d3.scale.category20c();

    var chord = d3.layout.chord()
        .padding(.04)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);

    var arc = d3.svg.arc()
        .innerRadius(r)
        .outerRadius(r + 20);

    var svg = d3.select("#frame").append("svg")
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + angular.element('#frame svg').width() / 2 + "," + height / 2 + ")");

    function fade(opacity) {
      return function(g, i) {
        svg.selectAll("g path.chord")
        .filter(function(d) {
          return d.source.index != i && d.target.index != i;
        })
        .transition()
        .style("opacity", opacity);
      };
    }
      
    function draw(nodes) {
      var indexByName = {},
          nameByIndex = {},
          matrix = [],
          n = 0;

      function name(name) {
        return name
      }

      // Compute a unique index for each name.
      nodes.forEach(function(d) {
        d = name(d.name);
        if (!(d in indexByName)) {
          nameByIndex[n] = d;
          indexByName[d] = n++;
        }
      });

      // Construct a square matrix counting relationships.
      nodes.forEach(function(d) {
        var source = indexByName[name(d.name)],
            row = matrix[source];
        if (!row) {
         row = matrix[source] = [];
         for (var i = -1; ++i < n;) row[i] = 0;
        }
        d.neighbors.forEach(function(d) { row[indexByName[name(d)]]++; });
      });

      chord.matrix(matrix);

      var g = svg.selectAll("g.group")
          .data(chord.groups)
          .enter().append("g")
          .attr("class", "group");

      g.append("path")
          .style("fill", function(d) { return fill(d.index); })
          .style("stroke", function(d) { return fill(d.index); })
          .attr("d", arc)
          .on("mouseover", fade(.1))
          .on("mouseout", fade(1));
          
      
      g.append("text")
          .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
          .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (r + 26) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
          })
          .text(function(d) { return nameByIndex[d.index]; });

      svg.selectAll("path.chord")
          .data(chord.chords)
          .enter().append("path")
          .attr("class", "chord")
          .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
          .style("fill", function(d) { return fill(d.source.index); })
          .attr("d", d3.svg.chord().radius(r));
    }
  };

  function BeaconListCtrl($scope, $http) {
    $http.get('/api/dbeacon/list').
    success(function (data, status, headers, config) {
      $scope.beacons = data;
    });
  };

  function BeaconCtrl($scope, $routeParams, $http) {
    $http.get('/api/dbeacon/beacon/' + $routeParams.id).
    success(function (data, status, headers, config) {
      $scope.device = data.device;
      $scope.records = data.records;
    });
  };

  function CypherCtrl($scope, $http, $location) {
    $scope.form = {};
    $scope.submitQuery = function () {
      $http.post('/api/dbeacon/query', $scope.form).
        success(function(data) {
          console.log(data);
        });
    };
  };

  function AreaCtrl($scope, $http, $location) {
    $http.get('/api/dbeacon/list/Area').
    success(function (data, status, headers, config) {
      $scope.areas = data;
    });
  };

  function RegionCtrl($scope, $http, $location) {
    $http.get('/api/dbeacon/list/Region').
    success(function (data, status, headers, config) {
      $scope.regions = data;
    });
  };

  function LocationCtrl($scope, $http, $location) {
    $http.get('/api/dbeacon/list/Location').
    success(function (data, status, headers, config) {
      $scope.locations = data;
    });
  };

  function PositionCtrl($scope, $http, $location) {
    $http.get('/api/dbeacon/list/Position').
    success(function (data, status, headers, config) {
      $scope.positions = data;
    });
  };

  function AreaTypeCtrl($scope, $http, $location) {
    $http.get('/api/dbeacon/list/AreaType').
    success(function (data, status, headers, config) {
      $scope.areatypes = data;
    });
  };

  function RegionTypeCtrl($scope, $http, $location) {
    $http.get('/api/list/RegionType').
    success(function (data, status, headers, config) {
      $scope.regiontypes = data;
    });
  };

  function LocationTypeCtrl($scope, $http, $location) {
    $http.get('/api/dbeacon/list/LocationType').
    success(function (data, status, headers, config) {
      $scope.locationtypes = data;
    });
  };

  function PositionTypeCtrl($scope, $http, $location) {
    $http.get('/api/dbeacon/list/PositionType').
    success(function (data, status, headers, config) {
      $scope.positiontypes = data;
    });
  };
}());