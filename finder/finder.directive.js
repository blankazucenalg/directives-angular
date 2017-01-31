(function() {
  'use strict';

  angular
    .module('gireAdminCasosV2')
    .directive('finderDirective', finderDirective);

  /** @ngInject */
  function finderDirective($timeout) {
    return {
      restrict: 'E',
      scope: {
        ngModel: '='
      },
      templateUrl: 'app/components/finder/finder.html',
      link: linkFinderDirective
    }

    function linkFinderDirective(scope) { //,element,attrs){
    	scope.getLevelChildren = getLevelChildren;
    	scope.select = select;
    	scope.isSelected = isSelected;
      console.log(scope.ngModel);

      scope.levels = Array.apply(null, {length: getHeight(scope.ngModel)}).map(Number.call, Number);
      console.log(scope.levels);
      scope.lists = {};
      scope.levels.forEach(function(level) {
      	scope.lists[level] = getLevelChildren(level, scope.ngModel);
      });
      console.log(scope.lists);

      function select(node, level){
      	scope.lists[level].forEach(function(n){
      		n.selected = false;
      		if(angular.equals(node, n))
      			n.selected = true;
      	})
      	if(scope.lists[level + 1]) {
      		scope.lists[level + 1].forEach(function(child){
      			child.selected = false;
      			child.parent.selected = false;
	      		if(angular.equals(node.slug, child.parent.slug))
      				child.parent.selected = true;
      		})
      	}
      	console.log(scope.lists[level], scope.lists[level + 1]);
      }

      function isSelected(node, level){
      	if(level >= 0)
      		return _.find(scope.lists[level], node).selected;
      	return true;
      }

      function getHeight(model) {
        var height = 0;
        if (model.children) {
          model.children.forEach(function(child) {
            height = Math.max(height, getHeight(child))
          });
          height += 1;
        }
        return height;
      }

      function getLevelChildren(level, model){
      	var c = 0;
      	var children = [];
    		if(model.children) {
    			model.children.forEach(function(child){
    				if(level == c) {
    					child.parent = model;
    					children.push(child);
    				} else {
    					children = children.concat(getLevelChildren(level - 1, child));
    				}
    			})
    		}
      	return children;
      }
    }
  }
})();
