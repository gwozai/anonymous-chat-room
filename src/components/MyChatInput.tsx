import { Editor, EditorState, RichUtils, convertToRaw, SelectionState, AtomicBlockUtils, DraftHandleValue } from 'draft-js';
import * as React from 'react';
import { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import 'draft-js/dist/Draft.css';
import { getDecorator } from '@/lib/chat-utils/decorator';
import { bindKeyBindingFn } from '@/lib/chat-utils/bingKeyBingdingFn';
import { RichStates } from '@/lib/chat-utils';
import { KeyTypes } from '@/lib/chat-utils/types';
import AlertConfirm from 'react-alert-confirm';
import { bindBlockRendererFn } from '@/lib/chat-utils/blockRendererFn';
import { useCurState } from '@/lib/hooks/useCurState';
export interface SetEditorState {
    (editorState: EditorState): void;
  }
  export interface ChatInputRef {
    commitEditorState: () => void;
    uploadImg: (fileList: FileList) => void;
  }
  interface ChatInputProps {
    onCommit?: (content: any) => void;
  }
export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>((props, ref) => {
    const mcurState = useCurState()
    const onCommit = (props as any).onCommit || (()=>{});
    const storeRef: any = useRef({
        editor: null,
        suggestion: null
      });
      const [editorState, setEditorState] = useState(() => {
        return EditorState.createEmpty(getDecorator(storeRef.current));
      });
      const focusEditor = () => {
        const selection = editorState.getSelection();
        
        if (!selection.getHasFocus()) {
          setEditorState(EditorState.moveFocusToEnd(editorState));
        }
      };
      const changeEditorState = useCallback<SetEditorState>(editorState => {
        let newEditorState = editorState;
    
        if (!newEditorState.getCurrentContent().equals(editorState.getCurrentContent())) {
          const selection = editorState.getSelection();
          newEditorState = EditorState.forceSelection(newEditorState, selection);
        }
        setEditorState(newEditorState);
      }, []);

      // 发送消息
      const commitEditorState = useCallback(
        (editorState: EditorState) => {
          const contentState = editorState.getCurrentContent();
          const row = convertToRaw(contentState);
          if (!contentState.hasText()) return;
          const { blocks } = row;
          const lastBlock = blocks[blocks.length - 1];
          if (lastBlock.type === 'unstyled' && !lastBlock.text) {
            blocks.pop(); // 如果最后一行为空则删除该行
          }
          const first = blocks[0];
          if (blocks.length > 1 && blocks[1].type === 'atomic' && first.type === 'unstyled' && !first.text) {
            blocks.shift(); // 如果第二个块是原子块，则删除第一个空块
          }
          onCommit(row);
    
          const emptyEditorState = EditorState.createEmpty(getDecorator(storeRef.current?.editor));
          const selection = emptyEditorState.getSelection();
          setEditorState(EditorState.forceSelection(emptyEditorState, selection));
        },
        [onCommit]
      );

      const uploadImg = useCallback((fileList: FileList) => {
        try {
          RichStates.insertFiles(editorState, setEditorState, fileList, mcurState.token?.accessToken);
        } catch (e) {
          AlertConfirm.alert('文件上传失败！');
        }
        return 'handled';
      }, [mcurState.token]);

      useImperativeHandle(ref, () => ({
        commitEditorState: () => commitEditorState(editorState),
        uploadImg: (fileList: FileList) => uploadImg(fileList)
    }));

      // 键盘事件队列
  const keyCommandRef = useRef<KeyCommand>(new Map());
  interface HandleKeyCommand {
    (command: KeyTypes, editorState: any): DraftHandleValue;
  }
  
  type KeyCommand = Map<string, HandleKeyCommand>;
  const handleKeyCommand = useCallback<HandleKeyCommand>(
    (command, editorState) => {
      for (const [_, keyCommand] of keyCommandRef.current) {
        const handled = keyCommand(command, editorState);
        if (handled === 'handled') return handled;
      }
      switch (command) {
        case 'enter':
            // 重写enter事件处理函数，直接提交
          commitEditorState(editorState)
          return 'handled';
      }
      const newState = RichUtils.handleKeyCommand(editorState, command);

      if (newState) {
        changeEditorState(newState);
        return 'handled';
      }

      return 'not-handled';
    },
    [commitEditorState]
  );

    return (
        <div onClick={focusEditor} className='min-w-[400px]'>
        <Editor
          ref={(editor: any) => {
            storeRef.current.editor = editor;
            (window as any).editor = editor;
          }}
          onChange={changeEditorState}
          handleKeyCommand={handleKeyCommand}
          blockRendererFn={bindBlockRendererFn({
            store: storeRef.current
          })}
          keyBindingFn={bindKeyBindingFn({ editorState, setEditorState })}
          placeholder="请输入内容"
          editorState={editorState}
        />
      </div>
    )
}
)