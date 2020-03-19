class Filter {

  static validateMatchName(title, titleFiltered) {
    let result = false;
    if (title) {
      title = title.toLowerCase();
      result = title.includes(titleFiltered.toLowerCase());
    }

    return result;
  }

  static filterByName(titleFiltered, list) {
    let result = [];

    if (list) {
      list.forEach(element => {
        if (this.validateMatchName(element.title, titleFiltered)) {
          result.push(element);
        }
      });
    }

    return result;
  }
}

export default Filter;
