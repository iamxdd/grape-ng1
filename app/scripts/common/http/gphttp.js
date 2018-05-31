define(function () {
	
	var modName = 'grape.http';
	var appMod = angular.module( modName, [] );
	appMod.service( 'gpHttp', [ "$http", function ( $http ) {
		
		this.getItemList = function ( options ) {
			
		};

		this.getSpecificItem = function ( options ) {
			
		}

		this.editItem = function ( options ) {
			
		};

		this.deleteItem = function ( options ) {
			
		};

		this.createNewItem = function ( options ) {
			
		}
	}]);

	return modName;
})