// (function() {

//     var getStyle = (function() {
//         if (window.currentStyle) {
//             return function(obj, name) {
//                 return obj.currentStyle[name]
//             }
//         } else {
//             return function(obj, name) {
//                 return getComputedStyle(obj, false)[name]
//             }
//         }
//     })()

//     var addEvent = (function() {
//         if (document.attachEvent) {
//             return function(obj, ev, fn) {
//                 obj.attachEvent('on' + ev, fn)
//             }
//         } else {
//             return function(obj, ev, fn) {
//                 obj.addEventListener(ev, fn, false)
//             }
//         }
//     })()
//     var oMenu = document.getElementById('menu')
//     console.log(oMenu)
//         // console.log(getStyle(oMenu, 'height'))




// })()








export function getStyle(obj,name) {

    if (window.currentStyle) {
        return function(obj, name) {
            return obj.currentStyle[name]
        }
    } else {
        return function(obj, name) {
            return getComputedStyle(obj, false)[name]
        }
        

    }




}