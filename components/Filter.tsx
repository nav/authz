import { SyntheticEvent } from "react";
import { SearchCircleIcon } from "@heroicons/react/outline";

type IFilterableItem = Record<string, any>;

type IFilterProps = {
  title: string;
  items: IFilterableItem[];
  filterKey: string;
  onFilter: (filteredItems: IFilterableItem[]) => void;
};

function Filter({ title, items, filterKey, onFilter }: IFilterProps) {
  const filterItems = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const keyword = target.value.toLowerCase();
    if (keyword.length > 0) {
      const results = items.filter(
        (item) => item[filterKey].toLowerCase().indexOf(keyword) > -1
      );
      if (results.length > 0) {
        onFilter(results);
      } else {
        onFilter([]);
      }
    } else {
      onFilter(items);
    }
  };

  return (
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        type="text"
        name="search"
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
        placeholder={`Search ${title}`}
        onChange={filterItems}
      />
    </div>
  );
}

export { Filter };
