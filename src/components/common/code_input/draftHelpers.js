import { EditorState, Modifier } from 'draft-js';
import { getIn } from 'immutable';

const TYPEAHEAD_ENTITY_TYPE = 'TYPEAHEAD';

export const selectVariable = (editorState, value, bindings, isTemplate) => {
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getFirstBlock();
  const { start, end, entity } = findTypeaheadEntity(
    contentBlock,
    contentState,
  );
  const selected = [...entity.getData().selected, value];
  const variable = getIn(bindings, selected);
  if (typeof variable === 'string') {
    return EditorState.push(
      editorState,
      Modifier.replaceText(
        contentState,
        editorState
          .getSelection()
          .set('anchorOffset', start)
          .set('focusOffset', end),
        isTemplate ? '${' + variable + '}' : variable,
      ),
      'insert-characters',
    );
  } else {
    const editorState1 = EditorState.push(
      editorState,
      Modifier.insertText(contentState, editorState.getSelection(), value),
      'insert-characters',
    );
    const selection = editorState1.getSelection();
    const contentState1 = editorState1
      .getCurrentContent()
      .createEntity(TYPEAHEAD_ENTITY_TYPE, 'IMMUTABLE', { selected });
    return EditorState.forceSelection(
      EditorState.push(
        editorState1,
        Modifier.applyEntity(
          contentState1,
          selection.set('anchorOffset', start),
          contentState1.getLastCreatedEntityKey(),
        ),
        'apply-entity',
      ),
      selection,
    );
  }
};

export const checkFocus = editorState =>
  editorState.getSelection().getHasFocus()
    ? editorState
    : closeVariableMenu(editorState);

// Helper responsible for clearing the typeahead entity based on the selection
// state. We do this by checking to see whether the current selection is within
// or immediately following the entity range. This works when the entity is a
// single "$" character and should work (or be close) when we want to filter
// menu items because the filter text should also be within that entity range.
export const checkTypeaheadEntity = editorState => {
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getFirstBlock();
  const selection = editorState.getSelection();
  const { start, end } = findTypeaheadEntity(contentBlock, contentState);
  if (
    start === null ||
    (selection.getStartOffset() > start && selection.getEndOffset() <= end)
  ) {
    return editorState;
  } else {
    return closeVariableMenu(editorState);
  }
};

export const openVariableMenu = editorState => {
  const editorState1 = insert('$', closeVariableMenu(editorState));
  const selection = editorState1.getSelection();
  const dollarSelection = selection.set(
    'anchorOffset',
    selection.getAnchorOffset() - 1,
  );
  const contentState = editorState1.getCurrentContent();
  const contentState1 = contentState.createEntity(
    TYPEAHEAD_ENTITY_TYPE,
    'IMMUTABLE',
    { selected: [] },
  );
  const contentState2 = Modifier.applyEntity(
    contentState,
    dollarSelection,
    contentState1.getLastCreatedEntityKey(),
  );
  const editorState2 = EditorState.push(
    editorState1,
    contentState2,
    'apply-entity',
  );
  return EditorState.forceSelection(editorState2, selection);
};

export const closeVariableMenu = editorState => {
  const contentState = editorState.getCurrentContent();
  const contentBlock = contentState.getFirstBlock();
  const selection = editorState.getSelection();
  const { start, end } = findTypeaheadEntity(contentBlock, contentState);
  const entitySelection = selection
    .set('anchorOffset', start)
    .set('focusOffset', end);
  if (start !== null) {
    // If you don't force the selection after clearing the entity, the entity
    // range will be selected.
    return EditorState.forceSelection(
      EditorState.push(
        editorState,
        Modifier.applyEntity(contentState, entitySelection, null),
        'apply-entity',
      ),
      selection,
    );
  } else {
    return editorState;
  }
};

export const findTypeaheadEntity = (contentBlock, contentState) => {
  let i = 0;
  const chars = contentBlock.getCharacterList();
  while (i < chars.size && !isTypeaheadEntity(chars.get(i), contentState)) {
    i++;
  }
  if (i === chars.size) {
    return { start: null, end: null };
  } else {
    const start = i;
    const entity = contentState.getEntity(chars.get(i).getEntity());
    while (i < chars.size && isTypeaheadEntity(chars.get(i), contentState)) {
      i++;
    }
    return { start, end: i, entity };
  }
};

const isTypeaheadEntity = (character, contentState) =>
  character.getEntity() &&
  contentState.getEntity(character.getEntity()).getType() ===
    TYPEAHEAD_ENTITY_TYPE;

export const insert = (text, editorState) => {
  const selection = editorState.getSelection();
  return EditorState.push(
    editorState,
    selection.isCollapsed()
      ? Modifier.insertText(editorState.getCurrentContent(), selection, text)
      : Modifier.replaceText(editorState.getCurrentContent(), selection, text),
    'insert-characters',
  );
};

export const getCurrentIndentation = (newLine, editorState) => {
  const text = editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey())
    .getText();
  const textBeforeCursor = text.slice(
    0,
    editorState.getSelection().getStartOffset(),
  );
  const lineBeforeCursor = textBeforeCursor.slice(
    textBeforeCursor.lastIndexOf(newLine) + 1,
  );
  return lineBeforeCursor.replace(/\S.*$/, '');
};
