const departments = ["All", "HR", "IT", "Finance", "Sales", "Operations"];

export default function DepartmentFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-3 py-2"
    >
      {departments.map((d) => (
        <option key={d} value={d}>{d}</option>
      ))}
    </select>
  );
}