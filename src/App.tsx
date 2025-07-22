import Editor from './Editor';
import { toolbar } from './toolbar';
import * as Items from './toolbar/items';
import * as MarkdownItems from './toolbar/items/markdown';

function App() {
  return (
    <Editor
      className="border-2"
      extensions={[
        toolbar({
          items: [
            MarkdownItems.bold,
            MarkdownItems.italic,
            MarkdownItems.strike,
            MarkdownItems.underline,
            Items.split,
            MarkdownItems.h1,
            MarkdownItems.h2,
            MarkdownItems.h3,
            MarkdownItems.h4,
            MarkdownItems.h5,
            MarkdownItems.h6,
            Items.split,
            MarkdownItems.quote,
            MarkdownItems.ul,
            MarkdownItems.ol,
            MarkdownItems.todo,
            Items.split,
            MarkdownItems.link,
            {
                ...MarkdownItems.image,
                command: (view) => {
                    view.dispatch({
                        // ...
                    });
                    
                    return true;
                }
            },
            Items.space,
            Items.fullScreen,
          ],
        }),
      ]}
    />
  );
}

export default App;
