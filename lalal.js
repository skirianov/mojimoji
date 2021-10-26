window.addEventListener('load', () => {
  document.getElementsByClassName('DraftEditor-editorContainer')[0].addEventListener('click', () => {
    console.log('clicked');
    if (document.activeElement.getAttribute('contenteditable')) {
      const editable = document.getElementsByClassName('DraftEditor-editorContainer')[0];
      const suggestions = document.createElement('div');
      
      let words = '';
      let lastWord = '';

      function getLastWord(wordSet) {
        let wordsArray = wordSet.split(' ');
        return wordsArray.at(-1);
      }

      function updateWords() {
        return document.activeElement.textContent;
      }

      function removeButtons(elem) {
        elem.innerHTML = '';
      }

      function findEmoji(emojiList) {
        const filteredTags = emojiList.filter((emoji) => {
          return emoji.tags.includes(lastWord);
        });

        const filteredTagEmoji = filteredTags.map(each => {
          return each.emoji;
        });

        return filteredTagEmoji;
      }

      document.activeElement.addEventListener('DOMCharacterDataModified', (e) => {
        suggestions.innerHTML = '';
        words = updateWords();     
        lastWord = getLastWord(words);
        console.log('last word', lastWord);
        
        const filteredEmoji = findEmoji(emoji);

        function insertTextAtCaret(text) {
          var sel, range;
          if (window.getSelection) {
              sel = window.getSelection();
              if (sel.getRangeAt && sel.rangeCount) {
                  range = sel.getRangeAt(0);
                  range.deleteContents();
                  range.insertNode( document.createTextNode(text) );
              }
          } else if (document.selection && document.selection.createRange) {
              document.selection.createRange().text = text;
          }
      }

        function saveSelection() {
          if (window.getSelection) {
              sel = window.getSelection();
              if (sel.getRangeAt && sel.rangeCount) {
                  return sel.getRangeAt(0);
              }
          } else if (document.selection && document.selection.createRange) {
              return document.selection.createRange();
          }
          return null;
      }
      
        function restoreSelection(range) {
            if (range) {
                if (window.getSelection) {
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                }
            }
        }

        filteredEmoji.map(each => {
          let emojiToAdd = document.createElement('div');
          emojiToAdd.className = 'emoji';
          emojiToAdd.innerText = each;
          emojiToAdd.addEventListener('click', () => insertTextAtCaret(each))
          suggestions.appendChild(emojiToAdd);
        });

        editable.appendChild(suggestions);
      })

      document.activeElement.addEventListener('keydown', (e) => {
        if (e.keyCode === 46 && document.activeElement.textContent !== '' || e.keyCode === 8 && document.activeElement.textContent !== '' ) {
          
          
          suggestions.innerHTML = '';

          words = updateWords();
          lastWord = getLastWord(words);

          const filteredEmoji = findEmoji(emoji);
        
          filteredEmoji.map(each => {
            let emojiToAdd = document.createElement('button');
            emojiToAdd.innerText = each;
            suggestions.appendChild(emojiToAdd);
          });

          editable.appendChild(suggestions);

        }
      })
    }
  } 
  , {once: true})
})

//097e8bb203a7aba532a4dc5dba7b6ed81e17091d




let startNode = editable.firstChild.firstChild.firstChild.firstChild.firstChild;
console.log(startNode);
let range = document.createRange();
range.setStart(startNode,0);
let selection = window.getSelection();
selection.removeAllRanges()
selection.addRange(range);

range.insertNode(document.createTextNode(each));
range.insertNode(document.createTextNode(''));
const textNode = selection.focusNode;
const offset = selection.focusOffset + each.length;
selection.collapse(textNode, offset);