/**
 *  @file Create a library for quickly, easily and crossbrowser-ly creating dom elements from data
 *  @author jec006
 */

//create a wrapper object to contain all our functions and namespace them
window.mCreate = {
  /**
   * Create an element from data
   * @param tagName - the type of tag to create, e.g. div
   * @param content - the content of the created tag, can be a string (including html) or another element
   * @param attr - attributes to apply to the element - needs to be the js version i.e className not class
   */
  createElement : function(tagName, content, attr){
    var el = document.createElement(tagName);
    if(el){
      switch (typeof(content))
      {
        case 'object' :
          if(content && content != null)
            el.appendChild(content);
          break;
        case 'string' :
          if(content.indexOf('<') > -1 || content.indexOf('>') > -1 || /&[a-zA-Z]+;/.test(content)){
            el.innerHTML = content;
          } else {
            if(tagName == 'input'){
              el.value = content;
            } else {
              $(el).append(content);
            }
          }
          break;
        case 'undefined':
          //do nothing
          break
        default :
          //We aren't sure what this is but we'll just set the innerHTML element and call it a day
          typeof(el.innerHTML) != 'undefined' ? el.innerHTML = content : content;
      }
      //apply any provided attributes - these attributes should use the js name for this to work properly, for example className instead of class
      for(var a in attr){
        if(a == 'for') { a = 'htmlFor'; attr['htmlFor'] = attr['for']; } //simple fix to allow labels to have 'for' attribute
        el[a] = attr[a];
      }
    }
    return el;
  },
  /**
   * Append an element as the last child of a parent element and return el
   * @param parent - the element to append el as a child of
   * @param el - the element to be appended.  Must be a DOMElement
   * @return el after its appended to parent
   */
  appendChild : function(parent, el){
    parent.appendChild(el);
    return el;
  },
  /**
   * Creates a table from arrays of data and headers
   * @param data - the rows for the table.  An array of arrays, each subarray represents a row, each element a cell
   * @param headers - the headers (if any) for the table, or a string/int of the number of columns
   * TODO: Make headers not required and use array size of first row
   */
  createTable : function(data, headers){
    var table = u.createElement('table');
    var rowWidth = 2;
    if(typeof(headers) != 'object'){
      //assume its just a number of cells per row
      var temp = parseInt(headers);
      rowWidth = isNaN(temp) ? rowWidth : temp;
    } else {
      //create the headers
      rowWidth = headers.length
      var thead = u.appendChild(table, u.createElement('thead'));
      var r = thead.appendChild(u.createElement('tr'));
      for(var i=0; i<rowWidth; i++){
        r.appendChild(u.createElement('th', headers[i], {className: 'table-header col-'+(i%2?'odd':'even')+(!i?' first':'')}));
      }
    }
    var tbody = u.appendChild(table, u.createElement('tbody'));
    for(var i=0; i<data.length; i+=rowWidth){
      var tr = u.appendChild(tbody, u.createElement('tr', '', {className: 'table-row row-'+(i%(2*rowWidth)?'odd':'even')}));
      for(var c=0; c<rowWidth && i+c < data.length; c++){
        tr.appendChild(u.createElement('td', data[i+c], {className: 'table-cell cell-'+(c%2?'odd':'even')}));
      }
    }
    return table;
  },
  /**
   * Creates a list of checkbox options within a holder ul (UnorderedList) and returns it.
   * @param holder - DOMElement - the ul to append the items to.  Must already exist
   * @param options - object - each item to be attached. Should be in the form:
   *              {
   *                text: <labeltext>,
   *                value: <value>,
   *                checked:<true|false>,
   *                ch_attrs: {<attrs to be applied to the checkbox>},
   *                label_attrs: {<attrs to be applied to the label>}
   *              }
   * @param name - string - the name for the form item represented by all these checkboxes
   * @param radios - boolean - use radio buttons
   * @param nostriping - boolean - don't add even/odd classes
   */
  createCheckboxList : function(holder, options, name, radios, nostriping){
    if(!options instanceof Array){
      options = [options];
    }

    for(var i=0; i<options.length; i++){
      var option = options[i];
      if(typeof(option.ch_attrs) != 'object'){ option.ch_attrs = {}; };
      option.ch_attrs.type = radios? 'radio' : 'checkbox';
      option.ch_attrs.value = option.value;
      var checked = typeof(option.checked)=='undefined' ? option.ch_attrs.checked||false : option.checked;
      if(name){ option.ch_attrs.name = name; };
      if(nostriping){
        var item = u.appendChild(holder, u.createElement('li', '', {className:'checkbox-row clearfix'}));
      } else {
        var item = u.appendChild(holder, u.createElement('li', '', {className:'checkbox-row clearfix ' + (i%2?'odd':'even')}));
      }

      //var str = '<input type="' + option.ch_attrs.type + '" ' + (option.ch_attrs.checked ? 'checked ' : '') + 'cvalue="'+option.value + '"/>';
      //$(item).append(str);
      if(!radios){
        var c = u.appendChild(item, u.createElement('input', '', option.ch_attrs));
        c.cvalue = option.value;
        c.checked = checked;
      } else {
        item.innerHTML = '<input type="radio" value="'+option.value+'" cvalue="'+option.value+'" name="'+name+'" ' + (checked?'checked':'') + '/>';
      }
      item.appendChild(u.createElement('label', option.text, option.label_attrs));
    }
    return holder;
  }
};