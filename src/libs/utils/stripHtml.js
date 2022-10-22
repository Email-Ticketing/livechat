const stripHTML = (html) => {
    if (html) {
      let tmp = document.createElement('DIV');
      if (typeof html.replace === 'function')
        tmp.innerHTML = html.replace(/<style.*<\/style>/, '');
      else tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    } else {
      return '';
    }
  };
  
  export default stripHTML;