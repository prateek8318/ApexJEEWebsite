"use client";
import { cn } from "@lib/utils";
import { ScrollArea } from "./scroll-area";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import BoldExtension from "@tiptap/extension-bold";
import LinkExtension from "@tiptap/extension-link";
import TextExtension from "@tiptap/extension-text";
import ItalicExtension from "@tiptap/extension-italic";
import StrikeExtension from "@tiptap/extension-strike";
import HeadingExtension from "@tiptap/extension-heading";
import DocumentExtension from "@tiptap/extension-document";
import ListItemExtension from "@tiptap/extension-list-item";
import HighlightExtension from "@tiptap/extension-highlight";
import ParagraphExtension from "@tiptap/extension-paragraph";
import UnderlineExtension from "@tiptap/extension-underline";
import SubscriptExtension from "@tiptap/extension-subscript";
import { cva, VariantProps } from "class-variance-authority";
import CodeBlockExtension from "@tiptap/extension-code-block";
import TextAlignExtension from "@tiptap/extension-text-align";
import BlockquoteExtension from "@tiptap/extension-blockquote";
import BulletListExtension from "@tiptap/extension-bullet-list";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import SuperscriptExtension from "@tiptap/extension-superscript";
import OrderedListExtension from "@tiptap/extension-ordered-list";
import { HTMLAttributes, Ref, useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import {
  Editor,
  EditorContent,
  Extensions,
  mergeAttributes,
  useEditor,
} from "@tiptap/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code2,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  X,
} from "lucide-react";

export interface RichTextEditorProps
  extends
    Omit<
      HTMLAttributes<HTMLDivElement>,
      "onPaste" | "onBlur" | "onChange" | "onFocus" | "onDrop" | "value"
    >,
    VariantProps<typeof menuBarVariants> {
  disabled?: boolean;
  name?: string;
  onBlur?: (value?: string) => void;
  onChange?: (value?: string) => void;
  placeholder?: string;
  ref?: Ref<HTMLDivElement>;
  value?: string;
}

const menuBarVariants = cva("font-medium", {
  variants: {
    variant: {
      default:
        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
      success:
        "bg-success text-success-foreground hover:bg-success hover:text-success-foreground",
      warning:
        "bg-warning text-warning-foreground hover:bg-warning hover:text-warning-foreground",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const getExtensions = (placeholder?: string) => {
  return [
    BlockquoteExtension.configure({
      HTMLAttributes: {
        class:
          "text-secondary border-l-4 border-secondary italic bg-muted px-6 py-2 min-h-10",
      },
    }),
    BoldExtension.configure({
      HTMLAttributes: {
        class: "font-semibold",
      },
    }),
    BulletListExtension.configure({
      HTMLAttributes: {
        class: "list-disc px-6 py-2 list-outside",
      },
    }),
    CodeBlockExtension.configure({
      HTMLAttributes: {
        class:
          "bg-card text-card-foreground rounded-xl text-sm border px-3 py-2 shadow-xs min-h-10",
      },
    }),
    DocumentExtension,
    HeadingExtension.configure().extend({
      renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level);
        const level: 1 | 2 | 3 | 4 | 5 | 6 = hasLevel
          ? node.attrs.level
          : this.options.levels[0];
        const classes = {
          1: "text-5xl font-black",
          2: "text-4xl font-extrabold",
          3: "text-3xl font-bold",
          4: "text-2xl font-semibold",
          5: "text-xl font-medium",
          6: "text-lg font-normal",
        };
        return [
          `h${level}`,
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
            class: `${classes[level]}`,
          }),
          0,
        ];
      },
    }),
    HighlightExtension.configure({
      HTMLAttributes: {
        class: "bg-warning text-warning-foreground",
      },
    }),
    ItalicExtension.configure({
      HTMLAttributes: {
        class: "italic",
      },
    }),
    LinkExtension.configure({
      autolink: true,
      HTMLAttributes: {
        class: "text-secondary underline",
      },
      linkOnPaste: true,
      openOnClick: true,
      protocols: ["http", "https"],
      shouldAutoLink: (url) =>
        RegExp(
          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
        ).test(url),
    }),
    ListItemExtension.configure({
      HTMLAttributes: {
        class: "text-sm",
      },
    }),
    OrderedListExtension.configure({
      HTMLAttributes: {
        class: "list-decimal px-6 py-2 list-outside",
      },
    }),
    ParagraphExtension.configure({
      HTMLAttributes: {
        class: "text-sm wrap-anywhere",
      },
    }),
    PlaceholderExtension.configure({
      placeholder: placeholder,
    }),
    StrikeExtension.configure({
      HTMLAttributes: {
        class: "line-through",
      },
    }),
    SubscriptExtension,
    SuperscriptExtension,
    TextExtension,
    TextAlignExtension.configure({
      defaultAlignment: "left",
      types: ["heading", "paragraph"],
    }),
    UnderlineExtension.configure({
      HTMLAttributes: {
        class: "underline",
      },
    }),
  ] satisfies Extensions;
};

const RichTextEditor = ({
  className,
  disabled,
  onBlur,
  onChange,
  placeholder,
  ref,
  value,
  variant,
  ...props
}: RichTextEditorProps) => {
  const extensions = getExtensions(placeholder);
  const editor = useEditor({
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-[inherit] overflow-x-hidden overflow-y-auto cursor-text [&_p.is-editor-empty]:first:before:content-[attr(data-placeholder)] [&_p.is-editor-empty]:first:before:float-left [&_p.is-editor-empty]:first:before:text-muted-foreground [&_p.is-editor-empty]:first:before:h-0 [&_p.is-editor-empty]:first:before:pointer-events-none",
      },
    },
    extensions: extensions,
    immediatelyRender: false,
    onBlur: () => onBlur?.(),
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    shouldRerenderOnTransaction: true,
    ...props,
  });

  if (editor) {
    return (
      <div
        ref={ref}
        className={cn(
          "border-border bg-background ring-offset-background has-focus:ring-ring flex w-full flex-col items-center justify-center rounded-xl border px-1 has-focus:ring-2 has-focus:ring-offset-2 has-disabled:cursor-not-allowed has-disabled:opacity-50",
          className,
        )}
      >
        <ToolBar
          className="border-border flex w-full cursor-grab items-center justify-start gap-1 overflow-x-auto border-b p-1 whitespace-nowrap [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden"
          editor={editor}
          variant={variant}
        />
        <EditorContent className="size-full py-4 px-4 min-h-[inherit]" editor={editor} />
      </div>
    );
  }
};

RichTextEditor.displayName = "RichTextEditor";

type ToolBarProps = {
  className?: string;
  editor: Editor;
} & VariantProps<typeof menuBarVariants>;

const ToolBar = ({ className, editor, variant }: ToolBarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = toolbarRef.current;
    if (!element) {
      return;
    }

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (event: MouseEvent) => {
      isDown = true;
      element.classList.add("dragging");
      startX = event.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      element.classList.remove("dragging");
    };

    const onMouseUp = () => {
      isDown = false;
      element.classList.remove("dragging");
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDown) {
        return;
      }
      event.preventDefault();
      const x = event.pageX - element.offsetLeft;
      const walk = (x - startX) * 1.5;
      element.scrollLeft = scrollLeft - walk;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) {
        return;
      }
      event.preventDefault();
      element.scrollLeft += event.deltaY * 1.5;
    };

    element.addEventListener("mousedown", onMouseDown);
    element.addEventListener("mouseleave", onMouseLeave);
    element.addEventListener("mouseup", onMouseUp);
    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("wheel", onWheel);
    return () => {
      element.removeEventListener("mousedown", onMouseDown);
      element.removeEventListener("mouseleave", onMouseLeave);
      element.removeEventListener("mouseup", onMouseUp);
      element.removeEventListener("mousemove", onMouseMove);
      element.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div className={className} ref={toolbarRef}>
      <HeadingDropdownMenu editor={editor} />
      <Button
        className={cn(editor.isActive("bold") && menuBarVariants({ variant }))}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        size="icon"
        variant="ghost"
      >
        <Bold size={16} />
      </Button>
      <Button
        className={cn(
          editor.isActive("italic") && menuBarVariants({ variant }),
        )}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        size="icon"
        variant="ghost"
      >
        <Italic size={16} />
      </Button>
      <Button
        className={cn(
          editor.isActive("underline") && menuBarVariants({ variant }),
        )}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        size="icon"
        variant="ghost"
      >
        <Underline size={16} />
      </Button>
      <Button
        className={cn(
          editor.isActive("strike") && menuBarVariants({ variant }),
        )}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        size="icon"
        variant="ghost"
      >
        <Strikethrough size={16} />
      </Button>
      <Button
        className={cn(
          editor.isActive("subscript") && menuBarVariants({ variant }),
        )}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleSubscript().run();
        }}
        size="icon"
        variant="ghost"
      >
        <Subscript size={16} />
      </Button>
      <Button
        className={cn(
          editor.isActive("superscript") && menuBarVariants({ variant }),
        )}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleSuperscript().run();
        }}
        size="icon"
        variant="ghost"
      >
        <Superscript size={16} />
      </Button>
      <TextAlignDropdownMenu editor={editor} />
      <Button
        className={cn(
          editor.isActive("blockquote") && menuBarVariants({ variant }),
        )}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        size="icon"
        variant="ghost"
      >
        <Quote size={16} />
      </Button>
      <Button
        className={cn(
          editor.isActive("highlight") && menuBarVariants({ variant }),
        )}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleHighlight().run();
        }}
        size="icon"
        variant="ghost"
      >
        <Highlighter size={16} />
      </Button>
      <Button
        className={cn(editor.isActive("code") && menuBarVariants({ variant }))}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleCodeBlock().run();
        }}
        size="icon"
        variant="ghost"
      >
        <Code2 size={16} />
      </Button>
      <Button
        className={cn(
          editor.isActive("bulletList") && menuBarVariants({ variant }),
        )}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        size="icon"
        variant="ghost"
      >
        <List size={16} />
      </Button>
      <Button
        className={cn(
          editor.isActive("orderedList") && menuBarVariants({ variant }),
        )}
        onClick={(event) => {
          event.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        size="icon"
        variant="ghost"
      >
        <ListOrdered size={16} />
      </Button>
      <LinkDialog editor={editor} />
    </div>
  );
};

const HeadingDropdownMenu = ({ editor }: { editor: Editor }) => {
  const DynamicHeading = ({
    editor,
    size,
  }: {
    editor: Editor;
    size?: string | number;
  }) => {
    if (editor.isActive("heading", { level: 1 })) {
      return (
        <>
          <Heading1 size={size} />
          <span>Heading 1</span>
        </>
      );
    } else if (editor.isActive("heading", { level: 2 })) {
      return (
        <>
          <Heading2 size={size} />
          <span>Heading 2</span>
        </>
      );
    } else if (editor.isActive("heading", { level: 3 })) {
      return (
        <>
          <Heading3 size={size} />
          <span>Heading 3</span>
        </>
      );
    } else if (editor.isActive("heading", { level: 4 })) {
      return (
        <>
          <Heading4 size={size} />
          <span>Heading 4</span>
        </>
      );
    } else if (editor.isActive("heading", { level: 5 })) {
      return (
        <>
          <Heading5 size={size} />
          <span>Heading 5</span>
        </>
      );
    } else if (editor.isActive("heading", { level: 6 })) {
      return (
        <>
          <Heading6 size={size} />
          <span>Heading 6</span>
        </>
      );
    } else {
      return (
        <>
          <Heading size={size} />
          <span>Heading</span>
        </>
      );
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="transition-all [&[data-state=open]>svg]:last:rotate-180"
        asChild
      >
        <Button
          className="h-10 w-32 justify-between p-2"
          size="lg"
          variant="ghost"
        >
          <DynamicHeading editor={editor} size={16} />
          <ChevronDown
            className="transition-transform duration-200"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuItem
          className="font-black"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={16} />
          Heading 1
        </DropdownMenuItem>
        <DropdownMenuItem
          className="font-extrabold"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={16} />
          Heading 2
        </DropdownMenuItem>
        <DropdownMenuItem
          className="font-bold"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={16} />
          Heading 3
        </DropdownMenuItem>
        <DropdownMenuItem
          className="font-semibold"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <Heading4 size={16} />
          Heading 4
        </DropdownMenuItem>
        <DropdownMenuItem
          className="font-medium"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          <Heading5 size={16} />
          Heading 5
        </DropdownMenuItem>
        <DropdownMenuItem
          className="font-normal"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
        >
          <Heading6 size={16} />
          Heading 6
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextAlignDropdownMenu = ({ editor }: { editor: Editor }) => {
  const DynamicTextAlign = ({
    editor,
    size,
  }: {
    editor: Editor;
    size?: string | number;
  }) => {
    if (editor.isActive({ textAlign: "left" })) {
      return (
        <>
          <AlignLeft size={size} />
          <span>Left</span>
        </>
      );
    } else if (editor.isActive({ textAlign: "center" })) {
      return (
        <>
          <AlignCenter size={size} />
          <span>Center</span>
        </>
      );
    } else if (editor.isActive({ textAlign: "right" })) {
      return (
        <>
          <AlignRight size={size} />
          <span>Right</span>
        </>
      );
    } else if (editor.isActive({ textAlign: "justify" })) {
      return (
        <>
          <AlignJustify size={size} />
          <span>Justify</span>
        </>
      );
    } else {
      return (
        <>
          <AlignLeft size={size} />
          <span>Left</span>
        </>
      );
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="transition-all [&[data-state=open]>svg]:last:rotate-180"
        asChild
      >
        <Button
          className="h-10 w-32 justify-between p-2"
          size="lg"
          variant="ghost"
        >
          <DynamicTextAlign editor={editor} size={16} />
          <ChevronDown
            className="transition-transform duration-200"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom">
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={16} />
          Left
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={16} />
          Center
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={16} />
          Right
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify size={16} />
          Justify
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LinkDialog = ({ editor }: { editor: Editor }) => {
  const [linkUrl, setLinkUrl] = useState("");

  const isLinkActive = editor.isActive("link");

  const onAttach = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
    }
  };
  if (isLinkActive) {
    return (
      <Button
        onClick={() => editor.chain().focus().unsetLink().run()}
        size="icon"
        variant="ghost"
      >
        <Link size={16} />
      </Button>
    );
  } else {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost">
            <Link size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="relative" align="end" side="bottom">
          <PopoverClose className="absolute top-3 right-3">
            <X size={16} />
          </PopoverClose>
          <div className="flex flex-col space-y-1.5 px-1 text-center sm:text-left">
            <h2 className="text-lg leading-none font-semibold tracking-tight">
              Link
            </h2>
            <p className="text-muted-foreground text-sm">
              Attach a link to the selected text
            </p>
          </div>
          <form
            className="flex w-full flex-col items-center justify-center gap-1"
            onSubmit={onAttach}
          >
            <ScrollArea className="max-h-96 w-full">
              <div className="grid grid-cols-1 gap-2 px-1 py-2">
                <Input
                  placeholder="https://consentgrid.in/privacy/customer-onboarding"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            </ScrollArea>
            <div className="flex w-full flex-col-reverse gap-1 px-1 sm:flex-row sm:justify-end sm:space-x-2">
              <Button type="submit" variant="secondary">
                <Link size={16} />
                Attach
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    );
  }
};

export { RichTextEditor };
