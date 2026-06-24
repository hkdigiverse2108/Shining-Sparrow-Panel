import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined, OrderedListOutlined, UnorderedListOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { useField, useFormikContext } from 'formik';

const ToolBtn = ({ onClick, isActive, children }: any) => (
  <button 
    type="button" 
    onClick={onClick} 
    className={`p-1.5 rounded transition-colors ${isActive ? 'bg-primary text-white' : 'text-muted hover:bg-surface-muted hover:text-foreground'}`} 
  >
    {children}
  </button>
);

interface CommonRichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  name?: string;
}

export const CommonRichTextEditor: React.FC<CommonRichTextEditorProps> = ({ value, onChange, placeholder = 'Start writing here...', label, required, className = '', name }) => {
  const formikContext = useFormikContext();
  const [field, meta, helpers] = formikContext && name ? useField(name) : [{ value: value || '' } as any, { touched: false, error: undefined }, { setValue: () => {} } as any];

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content: field.value || value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const val = html === '<p></p>' ? '' : html;
      if (onChange) onChange(val);
      if (formikContext && name) helpers.setValue(val);
    },
    onBlur: () => {
      if (formikContext && name) helpers.setTouched(true);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
      },
    },
  });

  // Sync editor content when value from formik / props changes
  React.useEffect(() => {
    if (editor) {
      const currentValue = name ? field.value : value;
      if (currentValue !== undefined && currentValue !== editor.getHTML()) {
        editor.commands.setContent(currentValue || '');
      }
    }
  }, [editor, name ? field.value : value]);

  if (!editor) return null;

  const showError = meta.touched && meta.error;

  return (
    <Form.Item 
      label={label} 
      required={required} 
      validateStatus={showError ? "error" : ""} 
      help={showError ? meta.error : ""} 
      labelCol={{ span: 24 }} 
      wrapperCol={{ span: 24 }} 
      className={`modern-form-item ${className}`}
    >
      <div className={`w-full rounded-lg border overflow-hidden bg-surface-muted transition-all duration-300 flex flex-col ${
        showError 
          ? 'border-danger focus-within:border-danger focus-within:ring-2 focus-within:ring-red-500/20' 
          : 'border-border hover:border-border-hover focus-within:border-primary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary-ring'
      }`}>
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 p-1.5 border-b border-border bg-surface-muted flex-wrap">
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
            <BoldOutlined />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
            <ItalicOutlined />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
            <UnderlineOutlined />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
            <StrikethroughOutlined />
          </ToolBtn>
          
          <div className="w-px h-5 bg-border mx-1.5" />
          
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
            <UnorderedListOutlined />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
            <OrderedListOutlined />
          </ToolBtn>

          <div className="w-px h-5 bg-border mx-1.5" />

          <ToolBtn onClick={() => editor.chain().focus().undo().run()}>
            <UndoOutlined />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()}>
            <RedoOutlined />
          </ToolBtn>
        </div>

        {/* Writing Area */}
        <div className="w-full bg-transparent" onBlur={() => { if (formikContext && name) helpers.setTouched(true); }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </Form.Item>
  );
};