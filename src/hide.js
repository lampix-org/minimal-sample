// UI Utils
function hideElementsByClass(...classes) {
  classes.forEach((c) => { document.getElementsByClassName(c)[0].style.display = 'none'; });
}

export default hideElementsByClass;
