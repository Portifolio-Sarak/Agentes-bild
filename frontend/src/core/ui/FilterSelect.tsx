import React from "react";

const FilterSelect = ({ col, placeholder, filters, onChange, options }: any) => (
    <select
        value={filters[col]}
        onChange={(e) => onChange(col, e.target.value)}
        className="w-full bg-slate-950 border border-slate-700 rounded px-1 py-1 text-[9px] text-slate-300 outline-none focus:border-blue-500 appearance-none cursor-pointer"
    >
        <option value="">(All)</option>
        {options.map((opt: any) => (
            <option key={opt} value={opt}>{opt}</option>
        ))}
    </select>
);

export default FilterSelect;
