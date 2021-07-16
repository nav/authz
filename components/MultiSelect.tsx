import { useState, useEffect } from "react";
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
import styles from "./Checkbox.module.css";

type Item = {
  id: number;
  name: string;
};

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: any;
  children: any;
  disabled?: boolean;
  style?: any;
};

type MultiSelectProps = {
  title: string;
  items: Item[];
  onSelect?(items: Item[]): void;
};

function Checkbox(props: CheckboxProps) {
  return (
    <label htmlFor={props.id} className={styles.checkbox} style={props.style}>
      <input
        id={props.id}
        type="checkbox"
        checked={props.checked}
        disabled={props.disabled || false}
        onChange={props.onChange}
      />
      {props.children}
    </label>
  );
}
function MultiSelect({ title, items, onSelect }: MultiSelectProps) {
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
   * Wrapper for setState function and any additonal side effects that when
   * an item is selected.
   */
  const toggleIndex = (
    array: boolean[],
    index: number,
    value: boolean,
    setMethod: any
  ) => {
    const arrayClone = [...array];
    arrayClone[index] = value;
    setMethod(arrayClone);
    _onSelect(items.filter((item, i) => arrayClone[i]));
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
  const filterItems = (e: any) => {
    const keyword = e.target.value.toLowerCase();
    if (keyword.length > 0) {
      const results = items.filter(
        (item) => item.name.toLowerCase().indexOf(keyword) > -1
      );
      setFilteredItems(results);
    } else {
      setFilteredItems(items);
    }
  };

  const itemsDefaultState = Array.from(
    { length: items.length },
    (_, i) => false
  );
  const [checkedItems, setCheckedItems] = useState(itemsDefaultState);
  const allItemsChecked = checkedItems.every(Boolean);
  const renderedItems =
    items.length > 0
      ? filteredItems.length > 0
        ? filteredItems.map((item: Item, i: number) => {
            const key = `${title}_item_${item.id}`;
            return (
              <Checkbox
                key={key}
                id={`${title}_item_${item.id}`}
                checked={checkedItems[i]}
                onChange={(e: any) =>
                  toggleIndex(
                    checkedItems,
                    i,
                    e.target.checked,
                    setCheckedItems
                  )
                }
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
            onChange={(e: any) => {
              setCheckedItems(
                Array.from({ length: items.length }, (_, i) => e.target.checked)
              );
              e.target.checked ? _onSelect(items) : _onSelect([]);
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
