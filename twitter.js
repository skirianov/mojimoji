{
let emoji;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message) {
      emoji = request.message;
      sendResponse({ ok: "message received" });
    }
  }
);

let lastWord = '';
let charInput = [];
let show = false;

function findEmoji(emojiList) {
  const filteredTags = emojiList.filter((emoji) => {
    return emoji.tags.includes(lastWord.toLowerCase());
  });

  const filteredTagEmoji = filteredTags.map(each => {
    return each.emoji;
  });

  return filteredTagEmoji;
}

function removeSuggestions() {
  let shownSuggestions = [...document.getElementsByClassName('emoji-container')];

  shownSuggestions.forEach(each => {
    each.remove();
  });
}

let selected;
let caretPosn;

document.activeElement.addEventListener('keyup', (e) => {
  if (document.activeElement.getAttribute('contenteditable') || document.activeElement.nodeName === 'INPUT' || document.activeElement.nodeName === 'TEXTAREA') {
    if (document.activeElement.getAttribute('contenteditable')) {
      let target = document.activeElement;
      let filteredEmoji;
      show = false;

      const suggestions = document.createElement('div');

      if (e.keyCode >= 65 && e.keyCode <= 90) {
        filteredEmoji = [];
        show = false;
        removeSuggestions();
        selected = window.getSelection().focusNode.parentElement;
      } else if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 8 || (e.keyCode >= 37 && e.keyCode <= 40)) {
        selected = window.getSelection().focusNode.parentElement;
        let range = window.getSelection().getRangeAt(0);
        let preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(e.target);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
        caretPosn = caretOffset;
        filteredEmoji = [];
        show = false;
        lastWord = getLastWordEntered();
        removeSuggestions();        
        if (lastWord) {
          filteredEmoji = findEmoji(emoji);
          show = true;
        }
      }


      function getLastWordEntered() {
        let el = document.activeElement;
        let selection = getSelection();
        let line;
        let cursor;
        if (selection.anchorOffset === 0) {
          let range = document.createRange();
          let sibling = selection.focusNode.parentElement.parentElement.parentElement.parentElement.previousElementSibling;
          if (!sibling) {
            return;
          }
          range.setStart(sibling, 0);
          range.setEnd(sibling, 1);
          line = range.endContainer.textContent || '';
          cursor = line.length - 1;
          if (!line) {
            let childNodes = sibling.childNodes;
            for (let i = 0; i < childNodes.length; i++) {
              if (childNodes[i] == sibling) { break; }
              if (childNodes[i].outerHTML) {
                if (childNodes[i].innerText) { line += ' ' + childNodes[i].innerText.trim(); }
              } else if (childNodes[i].nodeType == 3) {
                if (childNodes[i].textContent) { line += ' ' + childNodes[i].textContent.trim(); }
              }
            }
          }
        } else {
          let range = selection.getRangeAt(0);
          line = range.endContainer.nodeValue || '';
          cursor = selection.focusOffset;
          if (!line) {
            let childNodes = selection.anchorNode.parentNode.childNodes;
            for (let i = 0; i < childNodes.length; i++) {
              if (childNodes[i] == selection.anchorNode) { break; }
              if (childNodes[i].outerHTML) {
                if (childNodes[i].innerText) { line += ' ' + childNodes[i].innerText.trim(); }
              } else if (childNodes[i].nodeType == 3) {
                if (childNodes[i].textContent) { line += ' ' + childNodes[i].textContent.trim(); }
              }
            }
            cursor = line.length;
            console.log(line, 'line');
            console.log(cursor, 'cursor');
          }
        }

        let words = line.substring(0, cursor).split(' ').filter(each => each !== '');
        let lastWord = words[words.length - 1];
        return lastWord;
      }

      function insertEmoji() {
        filteredEmoji.map(each => {
          let emojiToAdd = document.createElement('div');
          emojiToAdd.className = 'emoji';
          emojiToAdd.innerText = each;
          emojiToAdd.addEventListener('click', () => {
            let nextText;
            let lastWordIndex;
            target.focus();
            let sel = document.getSelection();
            let range = document.createRange();
            if (selected.textContent.trim().length === 2) {
              let sibling = selected.parentElement.parentElement.parentElement.previousElementSibling;
              range.setStart(sibling, 0);
              range.setEnd(sibling, 1);
              lastWordIndex = sibling.textContent.lastIndexOf(lastWord, caretPosn);
              newText = sibling.textContent.slice(0, lastWordIndex) + sibling.textContent.slice(lastWordIndex).replace(lastWord, each);
            } else {
              range.setStart(selected, 0);
              range.setEnd(selected, 1);
              lastWordIndex = selected.textContent.lastIndexOf(lastWord, caretPosn);
              newText = selected.textContent.slice(0, lastWordIndex) + selected.textContent.slice(lastWordIndex).replace(lastWord, each);
            }
            sel.removeAllRanges();
            sel.addRange(range);
            removeSuggestions();


            setTimeout(() => {
              const dataTransfer = new DataTransfer();

              // this may be 'text/html' if it's required
              dataTransfer.setData('text/plain', `${newText}`);

              target.dispatchEvent(
                new ClipboardEvent('paste', {
                  clipboardData: dataTransfer,

                  // need these for the event to reach Draft paste handler
                  bubbles: true,
                  cancelable: true
                })
              );
              // clear DataTransfer Data
              dataTransfer.clearData();
            }, 0);
          });
          suggestions.appendChild(emojiToAdd);
        });
      }

      if (show) {
        suggestions.className = 'emoji-container';
        target.appendChild(suggestions);
        insertEmoji();
      }

    }
  }
})
}