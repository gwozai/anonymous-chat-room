export type Mutability = 'MUTABLE' | 'IMMUTABLE' | 'SEGMENTED';

export interface ChatStore {
    editor?: any;
    onViewerImage?: (data: { src: string; name: string }) => void;
    getWrapperWidth?: () => number;
    onResize?: Function;
    [prop: string]: any;
  }

export type KeyTypes =
  | 'enter'
  | 'prompt-link'
  | 'submit'
  | 'backspace'
  | 'up'
  | 'down';

export interface Raw {
  blocks: any[];
  entityMap: object;
}

export interface SetEditorState {
  (editorState: any): void;
}

export type DraftHandleValue = 'handled' | 'not-handled';

export interface HandleKeyCommand {
  (command: KeyTypes, editorState: any): DraftHandleValue;
}

export type KeyCommand = Map<string, HandleKeyCommand>;