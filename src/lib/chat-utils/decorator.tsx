import { CompositeDecorator } from "draft-js";
// https://github.com/jaceyi/chat/blob/master/src/components/Chat/utils/decorator/index.tsx#L24
export const getDecorator = (store?: any) => {
    const connectStoreToProps = (Component: any) => (props: object) => <Component {...props} store={store} />;
  
    return new CompositeDecorator([
    //   {
    //     strategy: findEntities(LinkEntityType, LinkMutability),
    //     component: Link
    //   },
    //   {
    //     strategy: findEntities(EmojiEntityType, EmojiMutability),
    //     component: Emoji
    //   },
    //   {
    //     strategy: (contentBlock: any, callback: Function) => {
    //       AttachUtils.findWithRegex(SuggestionUserReg, contentBlock, callback);
    //     },
    //     component: connectStoreToProps(SuggestionUser)
    //   },
    //   {
    //     strategy: findEntities(UserEntityType, UserMutability),
    //     component: User
    //   },
    //   {
    //     strategy: (contentBlock: any, callback: Function) => {
    //       AttachUtils.findWithRegex(CodeReg, contentBlock, callback);
    //     },
    //     component: Code
    //   }
    ]);
  };