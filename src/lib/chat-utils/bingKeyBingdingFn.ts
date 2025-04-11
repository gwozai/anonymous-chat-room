import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import { SetEditorState, KeyTypes } from './types';

const { hasCommandModifier, isCtrlKeyCommand } = KeyBindingUtil;


/**
 * @description 扩展快捷键
 */
export const bindKeyBindingFn = ({
  editorState,
  setEditorState
}: {
  editorState?: any;
  setEditorState?: SetEditorState;
}) => {
  return (e: KeyboardEvent): KeyTypes => {
    // 重写enter快捷键
    switch (e.key) {
      case 'Enter': // enter
        return 'enter'; // shift + enter
    }

    return getDefaultKeyBinding(e as any) as any;
  };
};