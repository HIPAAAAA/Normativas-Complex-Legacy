import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, label }) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Sync initial value
  useEffect(() => {
    if (contentEditableRef.current && contentEditableRef.current.innerHTML !== value) {
        // Only update if significantly different to prevent cursor jumps
        if (value === '' || !contentEditableRef.current.innerHTML) {
            contentEditableRef.current.innerHTML = value;
        }
    }
  }, []); // Only run on mount to establish initial value

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    // Get text/html
    const text = e.clipboardData.getData('text/plain');
    const html = e.clipboardData.getData('text/html');

    // Simple cleanup for Google Docs/Word trash code
    let cleanContent = text;
    if (html) {
        // Create a temp div to strip styles
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Remove all style attributes
        const all = temp.getElementsByTagName("*");
        for (let i = 0, max = all.length; i < max; i++) {
            all[i].removeAttribute("style");
            all[i].removeAttribute("class");
        }
        cleanContent = temp.innerHTML;
    }

    document.execCommand('insertHTML', false, cleanContent);
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    contentEditableRef.current?.focus();
  };

  return (
    <div className="w-full space-y-2 group">
      {label && <label className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-2">
        <span className="w-1 h-1 bg-accent rounded-full"></span>
        {label}
      </label>}
      
      <div className="bg-[#0f0f12] border border-white/10 group-focus-within:border-accent/50 rounded-xl overflow-hidden shadow-inner transition-colors duration-300">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-[#18181b] border-b border-white/5 flex-wrap">
          <ToolbarButton onClick={() => execCommand('bold')} label="B" activeClass="font-bold" title="Negrita" />
          <ToolbarButton onClick={() => execCommand('italic')} label="I" activeClass="italic" title="Cursiva" />
          <ToolbarButton onClick={() => execCommand('underline')} label="U" activeClass="underline" title="Subrayado" />
          
          <div className="w-px h-4 bg-white/10 mx-2" />
          
          <ToolbarButton onClick={() => execCommand('formatBlock', 'H3')} label="H3" title="Título Grande" />
          <ToolbarButton onClick={() => execCommand('formatBlock', 'H4')} label="H4" title="Subtítulo" />
          
          <div className="w-px h-4 bg-white/10 mx-2" />

          <ToolbarButton onClick={() => execCommand('insertUnorderedList')} label="• List" title="Lista con puntos" />
          <ToolbarButton onClick={() => execCommand('insertOrderedList')} label="1. List" title="Lista numérica" />

          <div className="w-px h-4 bg-white/10 mx-2" />
          
          <ToolbarButton 
            onClick={() => execCommand('foreColor', '#FFD65A')} 
            label="Color" 
            style={{ color: '#FFD65A', fontWeight: 'bold' }}
            title="Texto Dorado"
          />
           <ToolbarButton 
            onClick={() => execCommand('foreColor', '#ef4444')} 
            label="Color" 
            style={{ color: '#ef4444', fontWeight: 'bold' }}
            title="Texto Rojo"
          />
        </div>

        {/* Editable Area */}
        <div 
          ref={contentEditableRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          className="w-full min-h-[300px] p-6 text-gray-200 focus:outline-none prose prose-invert max-w-none prose-p:my-2 prose-headings:text-white prose-headings:font-display prose-headings:uppercase prose-strong:text-highlight prose-li:text-gray-300"
          style={{ minHeight: '300px' }}
        />
      </div>
      <p className="text-[10px] text-gray-600 flex justify-between">
         <span>* Soporta copiar y pegar desde Google Docs / Word.</span>
         <span>Formato Roleplay</span>
      </p>
    </div>
  );
};

const ToolbarButton: React.FC<{ 
  onClick: () => void; 
  label: string; 
  title?: string;
  activeClass?: string;
  style?: React.CSSProperties;
}> = ({ onClick, label, title, style }) => (
  <button
    type="button"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className="h-8 px-3 min-w-[32px] flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all font-medium text-xs border border-transparent hover:border-white/5"
    title={title}
    style={style}
  >
    {label}
  </button>
);

export default RichTextEditor;