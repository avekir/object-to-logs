
global.$ = global.jQuery = require('jquery');


const json_10k = require("../data/report_1000.json");
const Log2 = require('./../Logger');



var logger = new Log2();
    logger.data = json_10k;
    logger.container = '#root2';
    logger.renderData();



function listeners() {
   
    let self = this;

    $(document).on('click', '.sort_btn', (e)=>{
        //const titleLabel = e.target.closest('.column-container').getAttribute('data-label');
        console.log(e.target.value)
        logger.setSortColumn(e.target.value)
        logger.renderData()
    })

    $("#filterInput").on('input', function(e){
        //console.log(l, l.renderData)
        logger.setFilterQuery(e.target.value);
        logger.renderData()
    });

    $(document).on('change', 'thead select', function (e) {
        var val = e.target.value;
        var column_name = e.target.closest('th').getAttribute('data-column-name');

        logger.setFormatting(column_name, val);
        logger.renderData()
        //console.log(val, column_name)
        //var text = $(e.target).find("option:selected").text(); //only time the find is required
        //var name = $(e.target).attr('name');
    })
}


jQuery(function($)
{
    listeners(); 
});
