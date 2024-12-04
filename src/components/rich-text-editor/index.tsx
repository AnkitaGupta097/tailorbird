import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { EditorConfig } from "@ckeditor/ckeditor5-core";
import "./styles.css";

// NOTE: CKEditor caches the editor in browser, so you need to refresh the page, if you make any changes in config below
type RichTextEditorProps = {
    data: string;
    minHeight?: string;
    config?: EditorConfig;
    onChange?: any;
    disabled?: boolean;
};

function RichTextEditor({
    data,
    minHeight = "270px",
    config,
    onChange,
    disabled,
}: RichTextEditorProps) {
    const defaultConfig: EditorConfig = {
        toolbar: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "|",
            "numberedList",
            "bulletedList",
        ],
        placeholder: "Enter text here",
    };
    const Editor: any = ClassicEditor;
    return (
        <CKEditor
            editor={Editor}
            data={data}
            config={config || defaultConfig}
            onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
                editor.editing.view.change((writer) => {
                    writer.setStyle(
                        "min-height",
                        minHeight,
                        editor.editing.view.document.getRoot()!,
                    );
                });
            }}
            onChange={(_, editor: typeof Editor) => {
                const content: string = editor.getData();
                onChange(content);
            }}
            onBlur={(event, editor) => {
                console.log("Blur.", editor);
            }}
            onFocus={(event, editor) => {
                console.log("Focus.", editor);
            }}
            disabled={disabled}
        />
    );
}

export default RichTextEditor;
