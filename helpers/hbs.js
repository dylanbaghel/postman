const moment = require('moment');

const formatDate = (date, format) => {
  return moment(date).format(format);
};

const truncate = (str, length, ending) => {
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
};

const stripTags = (input) => {
    return input.replace(/<(?:.|\n)*?>/gm, '');
};

const select = (selected, options) => {
  return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
}

module.exports = { truncate, stripTags, formatDate, select };