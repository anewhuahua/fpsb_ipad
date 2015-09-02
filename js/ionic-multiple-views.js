angular.module('ionicMultipleViews', [])
	.directive('multipleViewsSupport', function ($state) {
		function findView(name) {
			var views = angular.element(document.body).find('ion-nav-view');
			for (var i = 0; i < views.length; i++) {
				var view = angular.element(views[i]);
				if (view.attr('name') === name) {
					return view;
				}
			}
			return false;
		}
		
		return {
			restrict: 'E',
			scope: {
				width: '@'
			},
			link: function (scope, element, attrs) {
				var views = $state.current.views;
				
				if (views) {
					var names = Object.keys($state.current.views);
					if (names.length > 1) {
						var pane = element.parent();
						var myView = pane.parent();
						
						// remove the current view name from the names list, 
						// so we can get the other view name.
						names.splice(names.indexOf(myView.attr('name')), 1)
						var otherView = findView(names[0]);
				
						pane.css('width', scope.width);
						
						if (myView[0].compareDocumentPosition(otherView[0]) 
							& Node.DOCUMENT_POSITION_PRECEDING) {
							pane.css('left', (100 - parseInt(scope.width.replace('%', ''), 10)) + '%');
						}
					}
				}
			}
		};
	})
	.factory('MultipleViewsManager', function ($rootScope, $state) {
		var viewCallbacks = {};
		var pendingCalls = [];
		var viewCallbacks1 = {};
		var pendingCalls1 = [];
		return {
			updateView: function (viewName, params) {
				if (!this.isActive()) {
					throw 'Cannot use updateView in a single view layout. Please make sure that you are in a multiple views layout using ViewManager.isActive()';
				}
				
				var views = $state.current.views;
				var callback = viewCallbacks[$state.current.name];
				if (callback) {
					callback(params);
				} else {
					pendingCalls.push({
						stateName: $state.current.name,
						params: params
					});
				}
			},
			isActive: function () {
				return $state.current.views && Object.keys($state.current.views).length > 1;
			},


			updated: function (callback) {
				viewCallbacks[$state.current.name] = callback;
				
				for (var i = 0; i < pendingCalls.length; i++) {
					var call = pendingCalls[i];
					if (call.stateName === $state.current.name) {
						callback(call.params);
						pendingCalls.splice(i, 1);
						return;
					}
				}
			},
			updateViewLeft: function (viewName, params) {
				if (!this.isActive()) {
					throw 'Cannot use updateView in a single view layout. Please make sure that you are in a multiple views layout using ViewManager.isActive()';
				}
				
				var views = $state.current.views;
				var callback = viewCallbacks1[$state.current.name];
				if (callback) {
					callback(params);
				} else {
					pendingCalls1.push({
						stateName: $state.current.name,
						params: params
					});
				}
			},
			updatedLeft: function (callback) {
				viewCallbacks1[$state.current.name] = callback;
				
				for (var i = 0; i < pendingCalls1.length; i++) {
					var call = pendingCalls1[i];
					if (call.stateName === $state.current.name) {
						callback(call.params);
						pendingCalls1.splice(i, 1);
						return;
					}
				}
			}
		};
	});



