
import { insertAtomic } from './insertAtomic';
// import { ImageBlockType } from 'chatUtils/blockRendererFn/components/Image';
// import { FileBlockType } from 'chatUtils/blockRendererFn/components/File';
export const insertFiles = async (
  editorState: any,
  setEditorState: any,
  fileList: FileList,
  token?: string
) => {
  let _editorState = editorState;

  for (const file of Array.from(fileList)) {
      const file = fileList.length > 0 ? fileList[0]: null;
      if (!file || fileList.length < 1) return;
      
      const formData = new FormData();
      formData.append('file', file);
    
      try {
          const response = await fetch('/api/upload', {
              method: 'POST',
              headers: {
                  "authorization": token ? 
                  ("Bearer " + token) : ''
               },
              body: formData
          });
    
          if (!response.ok) {
              throw new Error('Upload failed');
          }
    
          const data = await response.json();
          const url = data.url.startsWith('http') ? data.url : window.location.origin + data.url;
          _editorState = await new Promise((resolve, reject) => {
            if (/^image\/.+$/.test(file.type)) {
                const image = new Image();
                image.onload = () => {
                resolve(
                    insertAtomic(_editorState, 'image', {
                    src: url,
                    type: file.type,
                    name: file.name,
                    width: image.width,
                    height: image.height
                    })
                );
                };
                image.onerror = reject;
                image.src = url;
            }else {
                resolve(
                  insertAtomic(_editorState, 'file', {
                    src: url,
                    type: file.type,
                    name: file.name
                  })
                );
              }
          });

      } catch (error) {
          console.error('Upload error:', error);
          alert('图片上传失败，请重试');
      }
      
    // _editorState = await new Promise((resolve, reject) => {

    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     const result: string = reader.result as string;
    //     if (/^image\/.+$/.test(file.type)) {
    //       const image = new Image();
    //       image.onload = () => {
    //         resolve(
    //           insertAtomic(_editorState, 'image', {
    //             src: result,
    //             type: file.type,
    //             name: file.name,
    //             width: image.width,
    //             height: image.height
    //           })
    //         );
    //       };
    //       image.onerror = reject;
    //       image.src = result;
    //     } else {
    //       resolve(
    //         insertAtomic(_editorState, 'file', {
    //           src: result,
    //           type: file.type,
    //           name: file.name
    //         })
    //       );
    //     }
    //   };
    // });
  }
  setEditorState(_editorState);
};
