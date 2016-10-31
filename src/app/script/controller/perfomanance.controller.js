(function () {
    'use strict';
    angular.module('app').controller('performananceController', performananceController);
    performananceController.$inject = ['$scope'];

    function performananceController($scope) {
        var vm=this;
        // load the data
        vm.data = readData();
        vm.monthDetailMap = {};
        vm.monthlyCommentMap = {};
        vm.showMonthMap = {};
        vm.costCenterCode = '2556';
        vm.selectedYear = '2016';
        vm.monthSequence = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        vm.filterFieldsBy = ["ShowOverview", "ShowAll","ShowAllhidden","HQversion","HRplanningHQ","HRPlanningOps","ReviewDeltas"];
        vm.filedHeaderTxtMap = {'Same Year Same Month Plan':'Plan','Same Year Same Month Actual':'Actual',
            'Prev Year Same Month Actual':'YTD Prev Yr.','Cumulative Same Year Same Month Plan':'YTD Plan',
            'Cumulative Same Year Same Month Actual':'YTD Actual', 'Cumulative Prev Year Same Month Actual':'YTD Actual Prev Yr.'};

        vm.getTreeView = function(){
            dataservice.callAction('SPSReviewCtrl', 'getTreeStructure').then(function(result){
                console.log(result);
                vm.fieldSet = result;
            });
        }

        vm.toggleFilter = function(){
            var domElm = document.getElementsByTagName('cost-center-filter')[0];
            if(domElm){
                domElm.style.display = domElm.style.display == 'block' ? 'none' : 'block';
            }
        }

        vm.getYearlyData = function(){
            var param = {CostCenterCode: vm.costCenterCode, Year: vm.selectedYear};
            dataservice.callAction('SPSReviewCtrl', 'returnPCILIList', param).then(function(result){
                console.log(result);
                vm.pciMonthMap = _.indexBy(result, 'Month__c');

                //vm.fieldSet = Object.keys(result[0]);
                vm.months = Object.keys(vm.pciMonthMap);
                console.log(vm.pciMonthMap);
            });
        }

        vm.getMonthlyData = function(month){

            vm.showMonthMap[month] = !vm.showMonthMap[month];
            if(!(vm.monthDetailMap && vm.monthDetailMap[month])){
                var param = {CostCenterCode: vm.costCenterCode, Year: vm.selectedYear, Month: vm.monthSequence.indexOf(month)+1};
                dataservice.callAction('SPSReviewCtrl', 'returnPCILIForReview', param).then(function(result){
                    console.log(result);
                    vm.monthDetailMap[month] = result;
                });
            }

            if(!(vm.monthlyCommentMap && vm.monthlyCommentMap[month])){
                var monthIndex = vm.monthSequence.indexOf(month)+1;
                var param = {selectedUniqueIds: vm.costCenterCode+vm.selectedYear+monthIndex};
                dataservice.callAction('SPSReviewCtrl', 'returnPCIComments', param).then(function(result){
                    console.log(result);
                    vm.monthlyCommentMap[month] = result[0];
                });
            }
        }

        vm.saveComments = function(){
            var param = JSON.stringify(_.values(vm.monthlyCommentMap));
            dataservice.callAction('SPSReviewCtrl', 'updatePCIComments', param).then(function(result){
                console.log(result);
            });
        }

        vm.toggleView = function() {
            vm.fieldSet.forEach(function(fld){
                if (fld[vm.selectedShowItem]){
                    fld.isOpen = fld.isOpenparent = true;
                }else{
                    fld.isOpen = fld.isOpenparent = false;
                }

                if(fld.childLst){
                    if(vm.selectedShowItem == 'ShowOverview'){
                        fld.childLst.forEach(function(child){
                            child.isOpen = false;
                        });
                        fld.isOpen  = false;
                    }else{
                        fld.childLst.forEach(function(child){
                            if (child[vm.selectedShowItem])
                                child.isOpen = true;
                            else
                                child.isOpen = false;
                        });
                    }
                }
            });
        }

        vm.getTreeView();
        vm.getYearlyData();
        vm.sortingFn=sortingFn;
        function sortingFn(param){
            console.log(param.id,param.sortType);
        }
    }
})();