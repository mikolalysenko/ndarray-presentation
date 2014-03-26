exports.get = getCaretOffset
exports.set = setCaretOffset

function getCaretOffset(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        var sel = win.getSelection()
        if(!sel.baseNode) {
            return -1
        }
        var range = sel.getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

function setCaretOffset(content, char) {
    if(char < 0) {
        return
    }
    var sel
    content.focus();
    if (document.selection) {
        sel = document.selection.createRange();
        sel.moveStart('character', char);
        sel.select();
    }
    else {
        sel = window.getSelection();
        sel.collapse(content, char);
    }
}