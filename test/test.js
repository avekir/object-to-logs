const Log2 = require('./../Logger');
const json_100 = require("../data/report_100.json");
var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();

describe('application loading', function () {
  
    var logger = null;
    var testData = [
        {"prop1":1,"prop2":1,"prop3":1},
        {"prop1":2,"prop2":2,"prop3":2},
        {"prop1":3,"prop2":3,"prop3":3},
        {"prop1":4,"prop2":4,"prop3":4},
        {"prop1":5,"prop2":5,"prop3":5},
        {"prop1":6,"prop2":6,"prop3":6},
        {"prop1":7,"prop2":7,"prop3":7},
        {"prop1":8,"prop2":8,"prop3":8},
        {"prop1":9,"prop2":9,"prop3":9},
        {"prop1":10,"prop2":10,"prop3":10}
    ];

    var testConfig = {
        filter:{
            minLength:0,
            query:null,
            dontShowColumnLessThen:{
                value:20,
                units:'%'
            }
        }, 
        sort:{
            propName:null,
            currentState:null,
        },
        formatting: {
            formats:['String', 'Date', 'Money', "Yes/No"],
            current_state:{}
        }
    };

    beforeEach(function () {
        logger = new Log2();
        logger.data = json_100;
        logger.container = '#root2';
    })


    describe("all tests", function() {

        it("setFormatting", function() {
          
            logger.setFormatting('column1', 'value1');
            var target = logger.config.formatting.current_state;
            target.should.have.property('column1').equal('value1');
            
        });


        it("setFilterQuery", function() {
            logger.setFilterQuery('query');
            var target = logger.config.filter.query;
            assert.equal(target, 'query');
            
        });



        it("getUniqueValues", function() {
        
            var result = logger.getUniqueValues(testData)

            result.should.have.property('maxValue').equal(9);
            result.uniqueProps.prop1.should.have.property('amount').equal(9);
            result.uniqueProps.prop2.should.have.property('amount').equal(9);
            result.uniqueProps.prop3.should.have.property('amount').equal(9);

            result.uniqueProps.prop1.should.have.property('type').equal("string");
            result.uniqueProps.prop2.should.have.property('type').equal("string");
            result.uniqueProps.prop3.should.have.property('type').equal("string");

            
        });


        
        it("setSortColumn", function() {
        
            logger.setSortColumn('prop1')
            
            logger.config.sort.should.have.property('propName').equal('prop1');
            logger.config.sort.should.have.property('currentState').equal('desc');

            logger.setSortColumn('prop1')
            
            logger.config.sort.should.have.property('propName').equal('prop1');
            logger.config.sort.should.have.property('currentState').equal('asc');
            
        });


        it("filterData", function() {
        
            var result = logger.filterData(testData, '1');
    
            expect(result).to.eql([{"prop1":1,"prop2":1,"prop3":1}, {"prop1":10,"prop2":10,"prop3":10}]);
           
            
        });

        // it("removes columns if properties amount less than 20%", function() {
        
        //     testConfig.filter.dontShowColumnLessThen.value = 20;
        //     var testData1 = [
        //         {"prop1":1,"prop2":1,"prop3":1},
        //         {"prop1":2,"prop2":2,"prop3":2},
        //         {"prop1":3,"prop2":3},
        //         {"prop1":4,"prop2":4},
        //         {"prop1":5,"prop2":5},
        //         {"prop1":6,"prop2":6},
        //         {"prop1":7,"prop2":7},
        //         {"prop1":8,"prop2":8},
        //         {"prop1":9,"prop2":9},
        //         {"prop1":10,"prop2":10}
        //     ];

        //     var resultData1 = [
        //         {"prop1":1,"prop2":1},
        //         {"prop1":2,"prop2":2},
        //         {"prop1":3,"prop2":3},
        //         {"prop1":4,"prop2":4},
        //         {"prop1":5,"prop2":5},
        //         {"prop1":6,"prop2":6},
        //         {"prop1":7,"prop2":7},
        //         {"prop1":8,"prop2":8},
        //         {"prop1":9,"prop2":9},
        //         {"prop1":10,"prop2":10}
        //     ];

        //     let headersConf = logger.getUniqueValues(testData1);

        //     var result = logger.prepareDataBeforeDisplay(testData1, testConfig, headersConf);
            
        //     console.log(result)
        //     assert.equal(JSON.stringify(result), JSON.stringify(resultData1));
                
        // });
      
    });

})


