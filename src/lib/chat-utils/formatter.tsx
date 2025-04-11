import { convertFromRaw, Editor, EditorState, RawDraftContentState } from "draft-js";
import { getDecorator } from "./decorator";
export const formatter = (rawStr?: string) => {
    const raw = JSON.parse(rawStr || "{}");
    const editorState = EditorState.createWithContent(
          convertFromRaw(
            Object.assign(
              {
                blocks: {},
                entityMap: {}
              },
              raw
            )
          ),
          getDecorator()
        )
      
    return (
        <Editor
        readOnly
        onChange={() => {}}
        editorState={editorState}
      />
    )
}