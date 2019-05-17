import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
    install (Vue, options) {
        Vue.prototype.getPdf = function () {
            var title = this.htmlTitle
            let that = this
            var dom = document.querySelector('#pdfDom')
            html2Canvas(dom, {
                allowTaint: false,
                taintTest: false,
                onclone: function(cloneDoc){
                    var h4 = document.createElement("h4");
                    h4.innerText = that.pdfTitle
                    var lineBox1 = cloneDoc.getElementsByClassName("lineBox")[0];
                    cloneDoc.getElementById("pdfDom").insertBefore(h4,lineBox1)
                    h4.style ="font-size:18px;line-height:30px;margin:10px 0;text-align:center;"
                }
            }).then(function (canvas) {
                    let height = 700

                    let contentWidth = canvas.width
                    let contentHeight = canvas.height
                    let pageHeight = contentWidth / 592.28 * height  //1页的高度
                    let position = 0
                    let imgWidth = 592.28
                    let imgHeight = 592.28 / contentWidth * contentHeight
                    let leftHeight = contentHeight
                    let pageData = canvas.toDataURL('image/jpeg', 1.0)
                    let PDF = new JsPDF('', 'pt', [592.28, imgHeight])
                    PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
                    // if (leftHeight < pageHeight) {
                    //     PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
                    // } else {
                    //     while (leftHeight > 0) {
                    //         console.log(leftHeight, ' test ')
                    //         console.log(pageData.length,'pageData  length')
                    //         PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                    //         leftHeight -= pageHeight
                    //         position -= height
                    //         if (leftHeight > 0) {
                    //             PDF.addPage()
                    //         }
                    //     }
                    // }
                    PDF.save(title + '.pdf')
            })
        }
    }
}