import { SyntheticEvent } from "react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";

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
    <InputGroup size="sm" w="50%" alignSelf="flex-end">
      <InputRightElement pointerEvents="none">
        <SearchIcon color="gray.500" />
      </InputRightElement>
      <Input placeholder={`Search ${title}`} onChange={filterItems} />
    </InputGroup>
  );
}

export { Filter };
