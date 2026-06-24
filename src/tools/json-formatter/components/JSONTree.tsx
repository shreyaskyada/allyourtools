import React, { useState } from "react";

interface TreeProps {
  data: unknown;
  name?: string;
  isLast?: boolean;
  depth?: number;
}

export function JSONTree({ data, name, isLast = true, depth = 0 }: TreeProps): React.JSX.Element | null {
  const [collapsed, setCollapsed] = useState(false);

  if (data === null) {
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16 + 12}px` }}>
        {name && <span className="text-blue-500 dark:text-blue-400 font-semibold">{name}: </span>}
        <span className="text-rose-500 font-medium">null</span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  if (typeof data === "boolean") {
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16 + 12}px` }}>
        {name && <span className="text-blue-500 dark:text-blue-400 font-semibold">{name}: </span>}
        <span className="text-purple-600 dark:text-purple-400 font-medium">{data.toString()}</span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  if (typeof data === "number") {
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16 + 12}px` }}>
        {name && <span className="text-blue-500 dark:text-blue-400 font-semibold">{name}: </span>}
        <span className="text-amber-600 dark:text-amber-400 font-medium">{data}</span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  if (typeof data === "string") {
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16 + 12}px` }}>
        {name && <span className="text-blue-500 dark:text-blue-400 font-semibold">{name}: </span>}
        <span className="text-green-600 dark:text-green-400 break-all">&quot;{data}&quot;</span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  if (Array.isArray(data)) {
    const isEmpty = data.length === 0;
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:text-primary font-bold cursor-pointer text-[10px] text-muted-foreground h-4 w-4 flex items-center justify-center rounded hover:bg-muted"
          >
            {isEmpty ? " " : collapsed ? "▶" : "▼"}
          </button>
          {name && <span className="text-blue-500 dark:text-blue-400 font-semibold">{name}: </span>}
          <span className="text-foreground/80">[</span>
          {collapsed && (
            <span className="text-[10px] text-muted-foreground bg-muted/60 px-1 py-0.2 rounded border border-border">
              {data.length} items
            </span>
          )}
          {collapsed && <span className="text-foreground/80">]</span>}
          {collapsed && !isLast && <span className="text-muted-foreground">,</span>}
        </div>

        {!collapsed && !isEmpty && (
          <div className="my-0.5 border-l border-muted-foreground/20 ml-2">
            {data.map((item, index) => (
              <JSONTree
                key={index}
                data={item}
                isLast={index === data.length - 1}
                depth={depth + 1}
              />
            ))}
          </div>
        )}

        {!collapsed && (
          <div className="pl-4 text-foreground/80">
            <span>]</span>
            {!isLast && <span className="text-muted-foreground">,</span>}
          </div>
        )}
      </div>
    );
  }

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    const keys = Object.keys(obj);
    const isEmpty = keys.length === 0;
    return (
      <div className="font-mono text-xs py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:text-primary font-bold cursor-pointer text-[10px] text-muted-foreground h-4 w-4 flex items-center justify-center rounded hover:bg-muted"
          >
            {isEmpty ? " " : collapsed ? "▶" : "▼"}
          </button>
          {name && <span className="text-blue-500 dark:text-blue-400 font-semibold">{name}: </span>}
          <span className="text-foreground/80">{"{"}</span>
          {collapsed && (
            <span className="text-[10px] text-muted-foreground bg-muted/60 px-1 py-0.2 rounded border border-border">
              {keys.length} keys
            </span>
          )}
          {collapsed && <span className="text-foreground/80">{"}"}</span>}
          {collapsed && !isLast && <span className="text-muted-foreground">,</span>}
        </div>

        {!collapsed && !isEmpty && (
          <div className="my-0.5 border-l border-muted-foreground/20 ml-2">
            {keys.map((key, index) => (
              <JSONTree
                key={key}
                name={key}
                data={obj[key]}
                isLast={index === keys.length - 1}
                depth={depth + 1}
              />
            ))}
          </div>
        )}

        {!collapsed && (
          <div className="pl-4 text-foreground/80">
            <span>{"}"}</span>
            {!isLast && <span className="text-muted-foreground">,</span>}
          </div>
        )}
      </div>
    );
  }

  return null;
}
