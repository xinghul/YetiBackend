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
  myApp.controller('PlayerCtrl', function ($scope, $state, $http, $timeout) {
      $scope.playerDetails = null;
      $http.get('/api/players').
      success(function (data, status, headers, config) {
          $scope.players = data;
      });
      $scope.addPlayer = function () {
        $http.post('/api/players', {"name": $scope.playerName}).
            success(function (data) {
                return $timeout(function () {
                    $state.go('.', {}, { reload: true });
                }, 1000);
            });
      };
      $scope.showDetails = function (data) {
          $scope.playerDetails = data;
      }
      $scope.deletePlayer = function () {
          $http.delete('/api/player/' + $scope.playerDetails.pid).
              success(function (data, status, headers, config) {
                  return $timeout(function () {
                      $state.go('player', {}, { reload: true });
                  }, 1000);
              }).
              error(function (data, status, headers, config) {
                  console.log(data);
              });
      }
  });
  myApp.controller('AnimalCtrl', function ($scope, $state, $http, $timeout) {
      $scope.animalDetails = null;
      $scope.animalInfo = {};
      $http.get('/api/animals').
      success(function (data, status, headers, config) {
          $scope.animals = data;
      });
      $scope.addAnimal = function () {
          $http.post('/api/animals', {data: $scope.animalInfo}).
              success(function (data) {
                  return $timeout(function () {
                      $state.go('.', {}, { reload: true });
                  }, 1000);
              });
      };
      $scope.showDetails = function (data) {
          $scope.animalDetails = data;
      };
      $scope.deleteAnimal = function () {
          $http.delete('/api/animal/' + $scope.animalDetails.aid).
              success(function (data, status, headers, config) {
                  return $timeout(function () {
                      $state.go('animal', {}, { reload: true });
                  }, 1000);
              }).
              error(function (data, status, headers, config) {
                  console.log(data);
              });
      };
  });
  myApp.controller("LoginCtrl", function ($scope, $state, $http, $timeout) {
      $scope.userInfo = {};
      $scope.logIn = function () {
          $http.post('/api/login', {data: $scope.userInfo}).
          success(function (data, status, headers, config) {
              console.log(data);
          });
      };
  });
  myApp.controller("SignupCtrl", function ($scope, $state, $http) {
      $scope.userInfo = {};
      $scope.signUp = function () {
          $http.post('/api/signup', {data: $scope.userInfo}).
          success(function (data, status, headers, config) {
              console.log(data);
          });
      };
  });
  myApp.controller("ProfileCtrl", function ($scope, $state, $http) {

  });

  myApp.controller("LogCtrl", function ($scope, $state, $http) {
      $scope.generateGraph = function (values) {

          // A formatter for counts.
          var formatCount = d3.format(",.0f");

          var margin = {top: 10, right: 30, bottom: 30, left: 30},
              width = $("#graphDiv").width() - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

          var min = Math.floor(Math.min.apply(null, values)),
              max = Math.ceil(Math.max.apply(null, values));
          console.log(min, max);
          var x = d3.scale.linear()
              .domain([0, max])
              .range([0, width]);

          // Generate a histogram using twenty uniformly-spaced bins.
          var data = d3.layout.histogram()
              .bins(x.ticks(max))
              (values);

          var y = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d.y; })])
              .range([height, 0]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

          var svg = d3.select("#graphDiv").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var bar = svg.selectAll(".bar")
              .data(data)
            .enter().append("g")
              .attr("class", "bar")
              .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

          bar.append("rect")
              .attr("x", 1)
              .attr("width", x(data[0].dx) - 1)
              .attr("height", function(d) { return height - y(d.y); });

          bar.append("text")
              .attr("dy", ".75em")
              .attr("y", 6)
              .attr("x", x(data[0].dx) / 2)
              .attr("text-anchor", "middle")
              .text(function(d) { return formatCount(d.y); });

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
      };
      $http.get("/api/log/time").
      success(function (data, status, headers, config) {
          console.log(data);
          $scope.data = data;
      });

  });

  myApp.controller("LogMissionCtrl", function ($scope, $state, $http) {
      $scope.generateGraph($scope.data.mission);
  });
  myApp.controller("LogClueCtrl", function ($scope, $state, $http) {
      $scope.generateGraph($scope.data.clue);
  });
}());