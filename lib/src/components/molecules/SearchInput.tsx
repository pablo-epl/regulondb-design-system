import { useState, type InputHTMLAttributes } from "react";
import { Icon } from "../atoms/Icon";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
}

export const SearchInput = ({ value, defaultValue, onChange, onClear, className, ...rest }: SearchInputProps) => {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const v = value ?? internal;
  const empty = !v;
  return (
    <div className={`search-input ${className ?? ""}`}>
      <span className="icon-search"><Icon name="search" size={16} /></span>
      <input
        type="search"
        className="input"
        value={v as string}
        onChange={(e) => { if (value === undefined) setInternal(e.currentTarget.value); onChange?.(e); }}
        {...rest}
      />
      {!empty && (
        <button type="button" className="clear" aria-label="Clear search"
                onClick={() => { if (value === undefined) setInternal(""); onClear?.(); }}>
          ×
        </button>
      )}
    </div>
  );
};
