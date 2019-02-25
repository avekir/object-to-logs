class Log2 {

    constructor() {
        this.config = {
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
    }

    set container (selector) {
        this.containerElm = document.querySelector(selector);
    }

    get container() {
        return this.containerElm;
    }

    set data (data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    setFormatting(column, value) {

        this.config.formatting.current_state[column] = value;
        //console.log('this.config.formatting', this.config.formatting)
    }

    setFilterQuery(query) {
        this.config.filter.query = query;
    }

    
    setSortColumn(propName) {
        if(this.config.sort.propName === propName) {
            this.config.sort.currentState = (this.config.sort.currentState === 'desc' ? 'asc' : 'desc');
        } else {
            this.config.sort.propName = propName;
            this.config.sort.currentState = 'desc';
        }
    }

    filterData(targetArr, query) {
        return targetArr.filter(el => {
            let result = Object.values(el).join().toLowerCase().indexOf(query.toLowerCase());
            return (result > -1)
        });
    };

    sortData(targetArr, sortConf) {
        console.log('sortData',sortConf)

        //TODO athoer sort data types: number, date, etc

        // let dateParse = Date.parse("1991-03-27 21:08:51");
        // let isNumber = Number.isInteger()
        const label = sortConf.propName
        
        
        let descFilter= function(a, b) { 
            //console.log(a[label], b[label])
            if(isNaN(a[label]))
                return a[label] > b[label];
            else
            return a[label] - b[label];
        };

        let ascFilter= function(a, b) { 
            return b[label] > a[label];
        };
    
    
        if(sortConf.currentState=== 'desc'){
            targetArr.sort(descFilter);
    
        }
        else {
            targetArr.sort(ascFilter)
        }

        //return targetArr;
    }

    getUniqueValues(data, dontShowColumnLessThen) {

        let uniqueProps = {};
        let maxValue = 0;
        
        data.forEach(item => {
            
            Object.keys(item).forEach(function(key) {
                
                //find all unique props name and fields count
                if(!uniqueProps.hasOwnProperty(key))
                {
                    uniqueProps[key] = {type:'string', amount:0};
                } else {
                    uniqueProps[key].amount += 1;
                }

                if(uniqueProps[key].amount > maxValue) {
                    maxValue = uniqueProps[key].amount
                }
            })

        })

        
        let excludeColumns = this.getColumnsToExclude({uniqueProps, maxValue}, dontShowColumnLessThen )
        return {uniqueProps, maxValue, excludeColumns};
    }

    prepareDataBeforeDisplay(data, config, headersConf) {

        //sorting and filtering go here;

        let dataCloneTmp = JSON.parse(JSON.stringify(data));//.slice();
       
        if(config.filter.query !== null && config.filter.query.length > config.filter.minLength) {
            dataCloneTmp = this.filterData(dataCloneTmp, config.filter.query);

        }

        if(config.sort.propName !== null ) {
            this.sortData(dataCloneTmp, config.sort);
        }

        if(config.filter.dontShowColumnLessThen)
        {
            if(config.filter.dontShowColumnLessThen.units === '%') {

                console.log('columnToExclude', headersConf.excludeColumns)
                dataCloneTmp.forEach(item => {
                    headersConf.excludeColumns.forEach(column2exclude => {
                        delete item[column2exclude]
                    })
                })
               
            } else {
                console.warn('TODO implement other cases');
            }
            
        }

        return dataCloneTmp;
        
    }

    getColumnsToExclude(headersConf, dontShowColumnLessThen) {
        console.log('headersConf', headersConf, dontShowColumnLessThen)
        var columnToExclude = [];
        Object.keys(headersConf.uniqueProps).forEach(item => {
            if((headersConf.uniqueProps[item].amount * 100) / headersConf.maxValue < dontShowColumnLessThen) {
                columnToExclude.push(item)
            }
        })

        return columnToExclude
               
    }
    renderData(){
        this.container.innerHTML = '';

        let headersConf = this.getUniqueValues(this._data, this.config.filter.dontShowColumnLessThen.value);

        
        //let columnsToExclude = this.getColumnsToExclude(headersConf, this.config);

        const preparedData = this.prepareDataBeforeDisplay(this._data, this.config, headersConf);
        
        this.container.appendChild(this.displayData(preparedData, headersConf, this.config.formatting));
    }

    createFormatinChoice(formats) {
        let selectElm = document.createElement('select');

        formats.forEach(item => {
            let optionElm = document.createElement('option');
            optionElm.textContent = item;
            selectElm.appendChild(optionElm)
        })

        return selectElm;
    }


    displayData(data, headersConf, formatting) {
        
        if(!Array.isArray(data)) {
            throw new Error('Array is expected')
        }

       // console.log('displayData', headersConf);

        let self = this;

        let tableElm = document.createElement('table');
            tableElm.setAttribute('border', 1);
        
        let bodyElm = document.createElement('tbody');

        let formatData = function(data, format) {
        
            let dataClone = {...{}, ...data};

            Object.keys(dataClone).forEach(item => {
                if(format.current_state.hasOwnProperty(item)) {
                    let columnFormat = format.current_state[item];

                    switch(columnFormat) {
                        case 'Date':
                        dataClone[item] = new Date(dataClone[item])

                        case 'Money':
                        dataClone[item] = dataClone[item] + ' $';
                        break;

                        case "Yes/No":
                            if(dataClone[item] === true) {
                                dataClone[item] = 'Yes'
                            }
                        else {
                            dataClone[item] = 'No'
                        }
                        
                        break; 
                    }
                }
                
            })
            return dataClone;
        }
        
        let creatRowHeader = function(headerConf) {
            
            ///console.log(headerConf)

            let theadElm = document.createElement('thead');
            let trElm = document.createElement('tr');

            Object.keys(headerConf.uniqueProps).forEach(item => {
                if(headerConf.excludeColumns.join().indexOf(item) === -1) {
                    let thElm = document.createElement('th');
                    //thElm.textContent = item;
                    thElm.setAttribute('data-column-name', item);
                let sortBtn = document.createElement('input');
                    sortBtn.type = 'button';
                    sortBtn.classList.add('sort_btn');
                    sortBtn.value = item;

                    thElm.appendChild(sortBtn);

                let formatSelectElm = self.createFormatinChoice(formatting.formats);
                
               // console.log('formatting', formatting)
                if(formatting.current_state.hasOwnProperty(item))
                {
                    //console.log('formatting',formatSelectElm, item, formatting.current_state )
                    formatSelectElm.value = formatting.current_state[item]
                }
                //formatSelectElm.value = 

                    thElm.appendChild(formatSelectElm);
                    trElm.appendChild(thElm);   
                }
                
            })
            
            theadElm.appendChild(trElm);
            
            return theadElm;
        }

        let creatRowBody = function(item, headersConf){
            
            let trElm = document.createElement('tr');
            
            let header2Obj = {};
            Object.keys(headersConf.uniqueProps).forEach(item => {
                header2Obj[item] = '';
            })

            headersConf.excludeColumns.forEach(item => {
                delete header2Obj[item]
            })

            let normilized = {...header2Obj, ...item };

            //console.log('headersConf', headersConf)
            Object.keys(normilized).forEach(function(key) {
                let tdElm = document.createElement('td');
                tdElm.textContent = normilized[key];
                trElm.appendChild(tdElm);
            })

            return trElm;
        }


        data.forEach(item => {
            //console.log(headersConf.uniqueProps, item)
            bodyElm.appendChild(creatRowBody(formatData(item, formatting), headersConf ));
            
        })

        tableElm.appendChild(bodyElm);

        console.log(headersConf)
        const headerElm = creatRowHeader(headersConf);

        tableElm.appendChild(headerElm);

        return tableElm;
        

    }
}

module.exports = Log2;