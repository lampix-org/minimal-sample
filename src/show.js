// UI Utils
function showElementsByClass(...classes) {
  classes.forEach((c) => { document.getElementsByClassName(c)[0].style.display = 'block'; });
}

export default showElementsByClass;
