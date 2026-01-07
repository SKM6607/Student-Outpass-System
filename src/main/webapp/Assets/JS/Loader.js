const initFunction = function () {
    window.open(`home.html`, '_blank')
};
const loadAdminFunction = function () {
    window.open("adminHomepage.html", '_blank');
}
if(window.location.pathname.endsWith("d/")){
    initFunction()
}
if(window.location.pathname.includes('home.html')){
    loadAdminFunction();
}