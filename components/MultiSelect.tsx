import { useState, useEffect, SyntheticEvent } from "react";
import {
  Box,
  Circle,
  Divider,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Checkbox } from "./Checkbox";

type Item = {
  id: number;
  name: string;
};

type MultiSelectProps = {
  title: string;
  items: Item[];
  onSelect?(items: Item[]): void;
};

function MultiSelect({ title, items, onSelect }: MultiSelectProps) {
  type ICheckboxStates = {
    [index: number]: boolean;
  };

  /*
   * Wrapper for onSelect. If onSelect is undefined, assign a noop function
   * so that we don't have to repeat this check everywhere the function is used.
   */
  const _onSelect =
    typeof onSelect !== "undefined"
      ? onSelect
      : () => {
          return;
        };

  /*
   * Wrapper for setState function and any additonal side effects that happend
   * when an item is selected.
   */
  const toggleCheckbox = (
    states: ICheckboxStates,
    id: number,
    value: boolean,
    setMethod: any
  ) => {
    const statesClone = Object.assign({}, states);
    statesClone[id] = value;
    setMethod(statesClone);
    _onSelect(items.filter((item) => statesClone[item.id]));
  };

  const empty = (
    <Box w="full" pt="15ex">
      <Circle
        size="2em"
        bg="gray.100"
        color="white"
        fontSize="8xl"
        m="0 auto"
        opacity="0.2"
      >
        🤷
      </Circle>
    </Box>
  );

  const [filteredItems, setFilteredItems] = useState(items);

  const filterItems = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const keyword = target.value.toLowerCase();
    if (keyword.length > 0) {
      const results = items.filter(
        (item) => item.name.toLowerCase().indexOf(keyword) > -1
      );
      if (results.length > 0) {
        setFilteredItems(results);
      } else {
        setFilteredItems([]);
      }
    } else {
      setFilteredItems(items);
    }
  };

  const itemsDefaultState: ICheckboxStates = items.reduce(
    (obj, item) => Object.assign(obj, { [item.id]: false }),
    {}
  );

  const [checkedItems, setCheckedItems] = useState(itemsDefaultState);

  const allItemsChecked = Object.values(checkedItems).every(Boolean);

  const renderedItems =
    items.length > 0
      ? filteredItems.length > 0
        ? filteredItems.map((item: Item) => {
            const key = `${title}_item_${item.id}`;
            return (
              <Checkbox
                key={key}
                id={`${title}_item_${item.id}`}
                checked={checkedItems[item.id]}
                onChange={(e: SyntheticEvent) => {
                  const target = e.target as HTMLInputElement;
                  toggleCheckbox(
                    checkedItems,
                    item.id,
                    target.checked,
                    setCheckedItems
                  );
                }}
              >
                {item.name}
              </Checkbox>
            );
          })
        : empty
      : empty;

  return (
    <VStack align="flex-start" w="full">
      <HStack w="full">
        <VStack align="flex-start">
          <Heading size="sm">{title}</Heading>
          <Checkbox
            id={`chk_${title}`}
            checked={allItemsChecked}
            onChange={(e: SyntheticEvent) => {
              const target = e.target as HTMLInputElement;
              setCheckedItems(
                items.reduce(
                  (obj, item) =>
                    Object.assign(obj, { [item.id]: target.checked }),
                  {}
                )
              );
              target.checked ? _onSelect(items) : _onSelect([]);
            }}
          >
            Select All {title}
          </Checkbox>
        </VStack>
        <Spacer />
        <InputGroup size="sm" w="50%" alignSelf="flex-end">
          <InputRightElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputRightElement>
          <Input placeholder={`Search ${title}`} onChange={filterItems} />
        </InputGroup>
      </HStack>
      <Divider />
      {renderedItems}
    </VStack>
  );
}

export { MultiSelect };
